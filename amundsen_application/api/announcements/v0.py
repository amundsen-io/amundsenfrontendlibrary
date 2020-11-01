# Copyright Contributors to the Amundsen project.
# SPDX-License-Identifier: Apache-2.0

import logging

from http import HTTPStatus

from flask import Response, jsonify, make_response, current_app as app
from flask.blueprints import Blueprint
from werkzeug.utils import import_string

LOGGER = logging.getLogger(__name__)
ANNOUNCEMENT_CLIENT_INSTANCE = None

announcements_blueprint = Blueprint('announcements', __name__, url_prefix='/api/announcements/v0')


@announcements_blueprint.route('/', methods=['GET'])
def get_announcements() -> Response:
    global ANNOUNCEMENT_CLIENT_INSTANCE
    try:
        if ANNOUNCEMENT_CLIENT_INSTANCE is None:
            if (app.config['ANNOUNCEMENT_CLIENT_ENABLED']
                    and app.config['ANNOUNCEMENT_CLIENT'] is not None):
                announcement_client_class = import_string(app.config['ANNOUNCEMENT_CLIENT'])
                ANNOUNCEMENT_CLIENT_INSTANCE = announcement_client_class()
            else:
                payload = jsonify({'posts': [],
                                   'msg': 'A client for retrieving announcements must be configured'})
                return make_response(payload, HTTPStatus.NOT_IMPLEMENTED)
        return ANNOUNCEMENT_CLIENT_INSTANCE._get_posts()
    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        payload = jsonify({'posts': [], 'msg': message})
        return make_response(payload, HTTPStatus.INTERNAL_SERVER_ERROR)
