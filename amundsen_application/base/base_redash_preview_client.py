# Copyright Contributors to the Amundsen project.
# SPDX-License-Identifier: Apache-2.0

import abc
import logging
import requests as r
import time

from flask import Response as FlaskResponse, make_response, jsonify
from http import HTTPStatus
from typing import Any, Dict, Optional, Tuple

from amundsen_application.base.base_preview_client import BasePreviewClient
from amundsen_application.models.preview_data import ColumnItem, PreviewData, PreviewDataSchema


LOGGER = logging.getLogger(__name__)


REDASH_SUBMIT_QUERY_ENDPOINT = '{redash_host}/api/queries/{query_id}/results'
REDASH_TRACK_JOB_ENDPOINT = '{redash_host}/api/jobs/{job_id}'
REDASH_QUERY_RESULTS_ENDPOINT = '{redash_host}/api/query_results/{query_result_id}'


class RedashQueryCouldNotCompleteException(Exception):
    pass


class RedashQueryTemplateDoesNotExistForResource(Exception):
    pass


class BaseRedashPreviewClient(BasePreviewClient):
    """
    Generic client for using Redash as a preview client backend.

    Redash does not allow arbitrary queries to be submitted but it does allow
    the creation of templated queries that can be saved and referenced. Amundsen
    uses these templated queries to pass in arguments such as the schema name
    and table name in order to dynamically build a query on the fly.

    The suggested format of the query template is:

        select {{ SELECT_FIELDS }}
        from {{ SCHEMA_NAME }}.{{ TABLE_NAME }}
        {{ WHERE_CLAUSE }}
        limit {{ RCD_LIMIT }}

    You will need to use the params (e.g. database, cluster, schema and table names)
    to idenfiy the specific query ID in Redash to use. This is done via the
    `get_redash_query_id` method.

    The template values in the Redash query will be filled by the `build_redash_query_params`
    function.
    """

    def __init__(self, redash_host: str = None) -> None:
        self.redash_host = redash_host
        self.headers: Dict = dict()
        self.default_query_limit = 50
        self.max_redash_cache_age = 86400  # One day

    @abc.abstractmethod
    def get_redash_query_id(self, params: Dict) -> Optional[int]:
        """
        Retrieves the query template that should be executed for the given
        source / database / schema / table combination.

        Redash Connections are generally unique to the source and database.
        For example, Snowflake account that has two databases would require two
        separate connections in Redash. This would require at least one query
        template per connection.

        :param params: A dictionary of input parameters containing the database,
            cluster, schema and tableName
        :returns: the ID for the query in Redash. Can be None if one does not exist.
        """
        pass  # pragma: no cover

    def get_select_fields(self, params: Dict) -> str:
        """
        Allows customization of the fields in the select clause. This can be used to
        return a subset of fields or to apply functions (e.g. to mask data) on a
        table by table basis. Defaults to `*` for all fields.

        This string should be valid SQL AND fit BETWEEN the brackets `SELECT {} FROM ...`

        :param params: A dictionary of input parameters containing the database,
            cluster, schema and tableName
        :returns: a string corresponding to fields to select in the query
        """
        return '*'

    def get_where_clause(self, params: Dict) -> str:
        """
        Allows customization of the 'WHERE' clause to be provided for each set of parameters
        by the client implementation. Defaults to an empty string.
        """
        return ''

    def build_redash_query_params(self, params: Dict) -> Dict:
        """
        Builds a dictionary of parameters that will be injected into the Redash query
        template. The keys in this dictionary MUST be a case-sensitive match to the
        template names in the Redash query and you MUST have the exact same parameters,
        no more, no less.

        Override this function to provide custom values.
        """
        return {
            'parameters': {
                'SELECT_FIELDS': self.get_select_fields(params),
                'SCHEMA_NAME': params.get('schema'),
                'TABLE_NAME': params.get('tableName'),
                'WHERE_CLAUSE': self.get_where_clause(params),
                'RCD_LIMIT': str(self.default_query_limit)
            },
            'max_age': self.max_redash_cache_age
        }

    def _start_redash_query(self, query_id: int, query_params: Dict) -> Tuple[Any, bool]:
        """
        Starts a query in Redash. Returns a job ID that can be used to poll for
        the job status.

        :param query_id: The ID of the query in the Redash system. This can
            be retrieved by viewing the URL for your query template in the
            Redash GUI.
        :param query_params: A dictionary of parameters to inject into the
            corresponding query's template
        :return: A tuple of the response object and boolean. The response object
            changes based off of whether or not the result from Redash came from
            the cache.
            The boolean is True if the result came from the cache, otherwise False.
        """
        url_inputs = {'redash_host': self.redash_host, 'query_id': query_id}
        query_url = REDASH_SUBMIT_QUERY_ENDPOINT.format(**url_inputs)

        resp = r.post(query_url, json=query_params, headers=self.headers)
        resp_json = resp.json()

        LOGGER.debug('Response from redash query: %s', resp_json)

        if 'job' in resp_json:
            cached = False
        else:
            cached = True

        return resp_json, cached

    def _wait_for_query_finish(self, job_id: str, max_wait: int = 60) -> str:
        """
        Waits for the query to finish and validates that a successful response is returned.

        Redash job statuses:
            1 == PENDING (waiting to be executed)
            2 == STARTED (executing)
            3 == SUCCESS
            4 == FAILURE
            5 == CANCELLED

        :param job_id: the ID for the job executing the query
        :return: a query result ID tha can be used to fetch the results
        """
        url_inputs = {'redash_host': self.redash_host, 'job_id': job_id}
        query_url = REDASH_TRACK_JOB_ENDPOINT.format(**url_inputs)

        query_result_id: Optional[str] = None
        max_time = time.time() + max_wait

        while time.time() < max_time:
            resp = r.get(query_url, headers=self.headers)
            resp_json = resp.json()

            LOGGER.debug('Received response from Redash job %s: %s', job_id, resp_json)

            job_info = resp_json['job']
            job_status = job_info['status']

            if job_status == 3:
                query_result_id = job_info['query_result_id']
                break

            elif job_status == 4:
                raise RedashQueryCouldNotCompleteException(job_info['error'])
            time.sleep(.5)

        if query_result_id is None:
            raise RedashQueryCouldNotCompleteException('Query execution took too long')

        return query_result_id

    def _get_query_results(self, query_result_id: str) -> Dict:
        """
        Retrieves query results from a successful query run

        :param query_result_id: ID returned by Redash after a successful query execution
        :return: A Redash response dictionary
        """
        url_inputs = {'redash_host': self.redash_host, 'query_result_id': query_result_id}
        results_url = REDASH_QUERY_RESULTS_ENDPOINT.format(**url_inputs)
        resp = r.get(results_url, headers=self.headers)
        return resp.json()

    def get_preview_data(self, params: Dict, optionalHeaders: Dict = None) -> FlaskResponse:
        """
        Returns a FlaskResponse object, where the response data represents a json object
        with the preview data accessible on 'preview_data' key. The preview data should
        match amundsen_application.models.preview_data.PreviewDataSchema
        """
        LOGGER.debug('Retrieving preview data from Redash with params: %s', params)
        try:
            query_id = self.get_redash_query_id(params)
            if query_id is None:
                raise RedashQueryTemplateDoesNotExistForResource('Could not find query for params: %s', params)

            query_params = self.build_redash_query_params(params)
            query_results, cached_result = self._start_redash_query(query_id=query_id, query_params=query_params)

            # Redash attempts to use internal caching. The format of the response
            # changes based on whether or not a cached response is returned
            if not cached_result:
                query_result_id = self._wait_for_query_finish(job_id=query_results['job']['id'])
                query_results = self._get_query_results(query_result_id=query_result_id)

            columns = [ColumnItem(c['name'], c['type']) for c in query_results['query_result']['data']['columns']]
            preview_data = PreviewData(columns, query_results['query_result']['data']['rows'])

            data = PreviewDataSchema().dump(preview_data)
            PreviewDataSchema().load(data)  # for validation only
            payload = jsonify({'preview_data': data})
            return make_response(payload, HTTPStatus.OK)

        except Exception as e:
            LOGGER.error('ERROR getting Redash preview: %s', e)
            return make_response(jsonify({'preview_data': {}}), HTTPStatus.INTERNAL_SERVER_ERROR)
