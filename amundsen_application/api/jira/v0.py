import logging

from http import HTTPStatus
import json
from flask import Response, jsonify, make_response, request
from pkg_resources import iter_entry_points
from flask.blueprints import Blueprint

LOGGER = logging.getLogger(__name__)

jira_blueprint = Blueprint('jira', __name__, url_prefix='/api/jira/v0')


# TODO: Blueprint classes might be the way to go
JIRA_INTEGRATION_CLASS = None
JIRA_INTEGRATION_INSTANCE = None

# get the jira_integration_class from the python entry point
for entry_point in iter_entry_points(group='jira_integration', name='jira_integration_class'):
    jira_integration_class = entry_point.load()
    if jira_integration_class is not None:
        JIRA_INTEGRATION_CLASS = jira_integration_class


@jira_blueprint.route('/search', methods=['GET'])
def get_jira_issues() -> Response:
    global JIRA_INTEGRATION_INSTANCE
    try:
        if JIRA_INTEGRATION_INSTANCE is None and JIRA_INTEGRATION_CLASS is not None:
            JIRA_INTEGRATION_INSTANCE = JIRA_INTEGRATION_CLASS()
        if JIRA_INTEGRATION_INSTANCE is None:
            payload = jsonify({'jiraIssues': {},
                               'msg': 'A client for the jira integration feature must be configured'})
            return make_response(payload, HTTPStatus.NOT_IMPLEMENTED)

        table_key = request.args.get('table_key')
        response = JIRA_INTEGRATION_INSTANCE.search(table_key)
        return make_response(jsonify({'jiraIssues': response}), HTTPStatus.OK)

    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        return make_response(jsonify({'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)

