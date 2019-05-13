import abc
import requests
import uuid

from flask import Response as FlaskResponse, make_response, jsonify
from http import HTTPStatus
from requests import Response
from typing import Dict  # noqa: F401

from amundsen_application.base.base_preview_client import BasePreviewClient
from amundsen_application.models.preview_data import ColumnItem, PreviewData, PreviewDataSchema

DEFAULT_DATABASE_ID = 1
DEFAULT_HEADERS = {}
DEFAULT_QUERY_LIMIT = 50
DEFAULT_URL = 'http://localhost:8088/superset/sql_json/'


class SupersetPreviewClient(BasePreviewClient):
    def __init__(self,
                 * ,
                 database_id: int = DEFAULT_DATABASE_ID,
                 headers: Dict = DEFAULT_HEADERS,
                 query_limit: int = DEFAULT_QUERY_LIMIT,
                 url: str = DEFAULT_URL) -> None:
        self.database_id = database_id
        self.headers = headers
        self.url = url

    @abc.abstractmethod
    def post_to_sql_json(self, *, request_data: Dict, headers: Dict) -> Response:
        """
        Returns the post response from Superset's `sql_json` endpoint
        """
        return requests.post(self.url, data=request_data, headers=headers)

    @abc.abstractmethod
    def generate_request_sql(self, *, params: Dict) -> str:
        """
        Generates the sql statement for the post request to Superset's `sql_json` endpoint
        """
        schema = 'main'  # params.get('schema')
        table_name = 'ab_user'  # params.get('tableName')
        return 'SELECT * FROM {schema}.{table} LIMIT {limit}'.format(schema=schema, table=table_name, limit=self.query_limit)

    @abc.abstractmethod
    def generate_request_data(self, *, params: Dict) -> Dict:
        """
        Returns a dictionary of data for the post request to Superset's `sql_json` endpoint
        """
        request_data = {}

        # Superset's sql_json endpoint requires a unique client_id
        request_data['client_id'] = uuid.uuid4()

        request_data['database_id'] = self.database_id
        request_data['sql'] = self.generate_request_sql(params=params)
        return request_data

    @abc.abstractmethod
    def get_preview_data(self, params: Dict, optionalHeaders: Dict = None) -> FlaskResponse:
        """
        Returns a FlaskResponse object, where the response data represents a json object
        with the preview data accessible on 'preview_data' key. The preview data should
        match amundsen_application.models.preview_data.PreviewDataSchema
        """
        try:
            # Clone headers so that it does not mutate instance's state
            headers = dict(self.headers)

            # Merge optionalHeaders into headers
            if optionalHeaders is not None:
                headers.update(optionalHeaders)

            # Generate the request data
            request_data = self.generate_request_data(params=params)

            # Request preview data
            response = self.post_to_sql_json(request_data=request_data, headers=headers)

            # Map the results to amundsen_application.models.preview_data.PreviewDataSchema
            response_dict = response.json()
            columns = [ColumnItem(c['name'], c['type']) for c in response_dict['columns']]
            preview_data = PreviewData(columns, response_dict['data'])
            data, errors = PreviewDataSchema().dump(preview_data)
            if not errors:
                payload = jsonify({'preview_data': data})
                return make_response(payload, response.status_code)
            else:
                return make_response(jsonify({'preview_data': {}}), HTTPStatus.INTERNAL_SERVER_ERROR)
        except Exception as e:
            return make_response(jsonify({'preview_data': {}}), HTTPStatus.INTERNAL_SERVER_ERROR)
