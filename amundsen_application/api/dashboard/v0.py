import logging
from http import HTTPStatus
from flask import Response, jsonify, make_response, request
from flask import current_app as app
from flask.blueprints import Blueprint

from amundsen_application.log.action_log import action_logging
from amundsen_application.api.utils.request_utils import get_query_param, request_metadata
from amundsen_application.api.utils.metadata_utils import marshall_dashboard_full

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
        pass  # pragma: no cover

    try:
        uri = get_query_param(request.args, 'uri')
        index = request.args.get('index', None)
        source = request.args.get('source', None)
        _get_dashboard(uri=uri, index=index, source=source)

        url = '{0}{1}/{2}'.format(app.config['METADATASERVICE_BASE'],
                                  DASHBOARD_ENDPOINT,
                                  uri)

        response = request_metadata(url=url, method=request.method)
        dashboards = marshall_dashboard_full(response.json())
        status_code = response.status_code
        return make_response(jsonify({'msg': 'success', 'dashboard': dashboards}), status_code)
    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        return make_response(jsonify({'tableData': {}, 'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)
