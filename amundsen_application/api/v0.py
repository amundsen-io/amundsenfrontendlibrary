import logging
from typing import Any, Tuple, Optional


from http import HTTPStatus

from flask import Response, jsonify, make_response, render_template
from flask import current_app as app
from flask.blueprints import Blueprint

from amundsen_application.api.metadata.v0 import USER_ENDPOINT
from amundsen_application.api.utils.request_utils import request_metadata
from amundsen_application.models.user import load_user, dump_user


LOGGER = logging.getLogger(__name__)

blueprint = Blueprint('main', __name__, url_prefix='/')


@blueprint.route('/', defaults={'path': None}, methods=['GET'])
@blueprint.route('/<path:path>', methods=['GET'])
def index(path: Optional[str]) -> Any:
    return render_template("index.html")  # pragma: no cover


@blueprint.route('/healthcheck', methods=['GET'])
def healthcheck() -> Tuple[str, int]:
    return '', 200  # pragma: no cover


@blueprint.route('/api/auth_user', methods=['GET'])
def current_user() -> Response:
    try:
        if app.config['AUTH_USER_METHOD']:
            user = app.config['AUTH_USER_METHOD'](app)
        else:
            raise Exception('AUTH_USER_METHOD is not configured')

        url = '{0}{1}/{2}'.format(app.config['METADATASERVICE_BASE'], USER_ENDPOINT, user.user_id)

        response = request_metadata(url=url)
        status_code = response.status_code
        if status_code == HTTPStatus.OK:
            message = 'Success'
        else:
            message = 'Encountered error: failed to fetch user with user_id: {0}'.format(user.user_id)
            logging.error(message)

        payload = {
            'msg': message,
            'user': dump_user(load_user(response.json()))
        }
        return make_response(jsonify(payload), status_code)
    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        payload = jsonify({'msg': message})
        return make_response(payload, HTTPStatus.INTERNAL_SERVER_ERROR)
