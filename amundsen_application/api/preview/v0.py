# Copyright Contributors to the Amundsen project.
# SPDX-License-Identifier: Apache-2.0

import json
import logging

from http import HTTPStatus

from flask import Response, jsonify, make_response, request, current_app as app
from flask.blueprints import Blueprint
from werkzeug.utils import import_string

from amundsen_application.models.preview_data import PreviewDataSchema

LOGGER = logging.getLogger(__name__)
PREVIEW_CLIENT_INSTANCE = None

preview_blueprint = Blueprint('preview', __name__, url_prefix='/api/preview/v0')


@preview_blueprint.route('/', methods=['POST'])
def get_table_preview() -> Response:
    global PREVIEW_CLIENT_INSTANCE
    try:
        if PREVIEW_CLIENT_INSTANCE is None:
            if (app.config['PREVIEW_CLIENT_ENABLED']
                    and app.config['PREVIEW_CLIENT'] is not None):
                preview_client_class = import_string(app.config['PREVIEW_CLIENT'])
                PREVIEW_CLIENT_INSTANCE = preview_client_class()
            else:
                payload = jsonify({'previewData': {}, 'msg': 'A client for the preview feature must be configured'})
                return make_response(payload, HTTPStatus.NOT_IMPLEMENTED)

        response = PREVIEW_CLIENT_INSTANCE.get_preview_data(params=request.get_json())
        status_code = response.status_code

        preview_data = json.loads(response.data).get('preview_data')
        if status_code == HTTPStatus.OK:
            # validate the returned table preview data
            data, errors = PreviewDataSchema().load(preview_data)
            if not errors:
                payload = jsonify({'previewData': data, 'msg': 'Success'})
            else:
                logging.error('Preview data dump returned errors: ' + str(errors))
                raise Exception('The preview client did not return a valid PreviewData object')
        else:
            message = 'Encountered error: Preview client request failed with code ' + str(status_code)
            logging.error(message)
            # only necessary to pass the error text
            payload = jsonify({'previewData': {'error_text': preview_data.get('error_text', '')}, 'msg': message})
        return make_response(payload, status_code)
    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        payload = jsonify({'previewData': {}, 'msg': message})
        return make_response(payload, HTTPStatus.INTERNAL_SERVER_ERROR)
