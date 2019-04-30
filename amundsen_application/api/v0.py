import logging

from flask import Response
from flask import current_app as app
from flask.blueprints import Blueprint

from amundsen_application.api.metadata.v0 import USER_ENDPOINT
from amundsen_application.api.utils.request_utils import request_wrapper
from amundsen_application.models.user import load_user

REQUEST_SESSION_TIMEOUT = 10

LOGGER = logging.getLogger(__name__)

blueprint = Blueprint('api', __name__, url_prefix='/api')


@blueprint.route('/auth_user', methods=['GET'])
def current_user() -> Response:
    if app.config['AUTH_USER_METHOD']:
        user_info = app.config['AUTH_USER_METHOD'](app)
    else:
        user_info = {'email': 'test@test.com', 'user_id': 'test'}

    url = '{0}{1}/{2}'.format(app.config['METADATASERVICE_BASE'], USER_ENDPOINT, user_info['user_id'])

    response = request_wrapper(method='GET',
                               url=url,
                               client=app.config['METADATASERVICE_REQUEST_CLIENT'],
                               headers=app.config['METADATASERVICE_REQUEST_HEADERS'],
                               timeout_sec=REQUEST_SESSION_TIMEOUT)

    return load_user(response.json()).to_json()
