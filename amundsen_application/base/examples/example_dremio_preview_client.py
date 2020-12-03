# Copyright Contributors to the Amundsen project.
# SPDX-License-Identifier: Apache-2.0

from http import HTTPStatus
import json
import logging
from random import randint
from time import sleep
from typing import Dict  # noqa: F401

from flask import Response, jsonify, make_response, current_app as app
import requests

from amundsen_application.base.base_superset_preview_client import BasePreviewClient
from amundsen_application.models.preview_data import PreviewData, PreviewDataSchema, ColumnItem


class DremioPreviewClient(BasePreviewClient):

    SQL_STATEMENT = 'SELECT * FROM {schema}."{table}" LIMIT 50'

    def __init__(self,) -> None:
        self.url = app.config['PREVIEW_CLIENT_URL']
        self.username = app.config['PREVIEW_CLIENT_USERNAME']
        self.password = app.config['PREVIEW_CLIENT_PASSWORD']

    def get_preview_data(self, params: Dict, optionalHeaders: Dict = None) -> Response:
        """Preview data from Dremio source
        """
        database = params.get('database')
        if database != 'DREMIO':
            logging.info('Skipping table preview for non-Dremio table')
            return make_response(jsonify({'preview_data': {}}), HTTPStatus.OK)

        try:
            token = self._get_authorization_token()

            headers = {
                'Authorization': token,
                'Content-Type': "application/json",
                'cache-control': "no-cache",
            }

            # Merge optionalHeaders into headers
            if optionalHeaders is not None:
                headers.update(optionalHeaders)

            # Double quote table path
            schema = '"{}"'.format(params['schema'].replace('.', '"."'))
            table = params.get('tableName')
            sql = DremioPreviewClient.SQL_STATEMENT.format(schema=schema,
                                                           table=table)

            data = json.dumps({'sql': sql})

            results = self._get_sql_response(headers, data)
            columns = [ColumnItem(c['name'], c['type']['name']) for c in results['schema']]
            preview_data = PreviewData(columns, results['rows'])

            data = PreviewDataSchema().dump(preview_data)[0]
            errors = PreviewDataSchema().load(data)[1]
            if errors:
                logging.error(f'Error(s) occurred while building preview data: {errors}')
                payload = jsonify({'preview_data': {}})
                return make_response(payload, HTTPStatus.INTERNAL_SERVER_ERROR)
            else:
                payload = jsonify({'preview_data': data})
                return make_response(payload, HTTPStatus.OK)

        except Exception as e:
            logging.error(f'Encountered exception: {e}')
            payload = jsonify({'preview_data': {}})
            return make_response(payload, HTTPStatus.INTERNAL_SERVER_ERROR)

    def _get_authorization_token(self,) -> str:
        '''Get token for the Dremio REST API

        Authorization tokens currently expire after 30 hours, so they must be
        regenerated with each new request:

        https://community.dremio.com/t/do-the-rest-api-login-tokens-expire/1150/5
        '''
        headers = {'content-type': 'application/json'}
        data = json.dumps({'userName': self.username, 'password': self.password})
        url = f'{self.url}/apiv2/login'
        response = requests.post(url, headers=headers, data=data)

        if response.status_code != HTTPStatus.OK:
            raise Exception('Failed to get authorization token')

        token = response.json().get('token')
        return f'_dremio{token}'

    def _get_sql_response(self, headers: Dict[str, str], data: str) -> Dict:
        '''Get SQL response via Dremio API
        '''
        terminal_states = {'COMPLETED', 'CANCELED', 'FAILED'}

        response = requests.post(f'{self.url}/api/v3/sql', headers=headers,
                                 data=data)

        if response.status_code != HTTPStatus.OK:
            raise Exception('Failed to post job')

        job_id = response.json().get('id')

        n = 0
        while True:
            response = requests.get(f'{self.url}/api/v3/job/{job_id}', headers=headers)

            if response.status_code != HTTPStatus.OK:
                raise Exception(f'Failed to retrieve status for job: {job_id}')

            job_state = json.loads(response.text).get('jobState')
            if job_state not in terminal_states:
                sleep(((2 ** n) + randint(0, 1000) / 1e3) / 1e3)
                n += 1
                continue
            elif job_state == 'COMPLETED':
                break
            else:
                raise Exception(f'Failed to complete job: {job_id}')

        response = requests.get(f'{self.url}/api/v3/job/{job_id}/results',
                                headers=headers, data=data)

        if response.status_code != HTTPStatus.OK:
            raise Exception(f'Failed to get results for job: {job_id}')

        return response.json()
