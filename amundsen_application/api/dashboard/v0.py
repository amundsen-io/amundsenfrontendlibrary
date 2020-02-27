import logging
import time
from http import HTTPStatus

from flask import Response, jsonify, make_response, request
from flask.blueprints import Blueprint

from amundsen_application.log.action_log import action_logging

LOGGER = logging.getLogger(__name__)

dashboard_blueprint = Blueprint('dashboard', __name__, url_prefix='/api/dashboard/v0')
DASHBOARD_ENDPOINT = '/dashboard'


@dashboard_blueprint.route('/dashboard', methods=['GET'])
def get_dashboard() -> Response:
    """
    Call metadata service endpoint to fet specified dashboard
    :return:
    """
    @action_logging
    def _get_dashboard(*, uri: str, index: int, source: str) -> None:
        pass  #pragma: no cover

    uri = request.args.get('uri', None)
    index = request.args.get('index', None)
    source = request.args.get('source', None)
    _get_dashboard(uri=uri, index=index, source=source)

    results_dict = {
        'dashboard': {
            'uri': uri or 'hello',
            'cluster': 'cluster',
            'group_name': 'google group',
            'group_url': 'https://google.com',
            'name': 'lmgtfy dashboard',
            'url': 'https://lmgtfy.com/?q=dashboard',
            'description': 'test description',
            'created_timestamp': 1582153297,
            'updated_timestamp': 1582153297,
            'last_run_timestamp': 1582153297,
            'last_run_state': 'state',
            'owners': [{
                    'email': 'dwon@lyft.com',
                    'display_name': 'Daniel Won',
                    'profile_url': '',
                    'user_id': 'dwon@lyft.com',
                }],
            'frequent_users': [{
                'read_count': 10,
                'user': {
                    'email': 'dwon@lyft.com',
                    'display_name': 'Daniel Won',
                    'profile_url': '',
                    'user_id': 'dwon@lyft.com',
                }
            }],
            'chart_names': [],
            'query_names': [],
            'tables': [],
            'tags': [],
        },
        'msg': '',
    }
    time.sleep(1)
    return make_response(jsonify(results_dict), HTTPStatus.OK)
