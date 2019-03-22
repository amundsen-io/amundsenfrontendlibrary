import logging

from http import HTTPStatus

from flask import Response, jsonify, make_response, request
from flask.blueprints import Blueprint

from amundsen_application.log.action_log import action_logging
from amundsen_application.api.utils.request_utils import get_query_param


LOGGER = logging.getLogger(__name__)

log_blueprint = Blueprint('log', __name__, url_prefix='/api/log/v0')


@log_blueprint.route('/', methods=['PUT'])
def log_generic_action() -> Response:
    """
    Log a generic action on the frontend. Captured parameters include

    :param command: (Required) Name of action to be logged
    :param key: (Optional)
    :param value: (Optional)
    :param source: (Optional)
    :return:
    """
    @action_logging
    def _log_generic_action(*, command: str, key: str, value: str, source: str) -> None:
        pass  # pragma: no cover

    try:
        command = get_query_param(request.args, 'command', '"command" is a required parameter.')
        _log_generic_action(
            command=command,
            key=request.args.get('key', None),
            value=request.args.get('value', None),
            source=request.args.get('source', None)
        )
        return make_response({}, HTTPStatus.OK)

    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        payload = jsonify({'msg': message})
        return make_response(payload, HTTPStatus.INTERNAL_SERVER_ERROR)

