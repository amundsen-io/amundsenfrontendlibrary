import logging

from http import HTTPStatus
from flask import Response, jsonify, make_response, request
from flask.blueprints import Blueprint
from flask import current_app as app
from typing import Any

from amundsen_application.jira.jira_client import JiraClient
from amundsen_application.api.utils.request_utils import get_query_param

LOGGER = logging.getLogger(__name__)

jira_blueprint = Blueprint('jira', __name__, url_prefix='/api/jira/v0')


@jira_blueprint.route('/issues', methods=['GET'])
def get_jira_issues() -> Response:
    """
    Given a table key, returns all JIRA tickets containing that key. Returns an empty array if none exist
    :return: List of JIRA tickets
    """
    try:
        table_key = get_query_param(request.args, 'key', 'Request requires a key')
        jira_client = JiraClient(jira_url=app.config['JIRA_URL'],
                                 jira_user=app.config['JIRA_USER'],
                                 jira_password=app.config['JIRA_PASSWORD'],
                                 jira_project_id=app.config['JIRA_PROJECT_ID'],
                                 jira_project_name=app.config['JIRA_PROJECT_NAME'])
        response = jira_client.search(table_key)
        return make_response(jsonify({'jiraIssues': response}), HTTPStatus.OK)

    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        return make_response(jsonify({'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)


@jira_blueprint.route('/issue', methods=["POST"])
def create_jira_issue() -> Response:
    """
    Given a title, description, and table key, creates a JIRA ticket in the configured project
    Automatically places the tablekey in the description of the JIRA ticket.
    Returns the JIRA ticket information, including UI.
    :return: List containing a single JIRA ticket
    """
    try:
        description = get_query_param(request.form, 'description', 'Request requires a description')
        key = get_query_param(request.form, 'key', 'Request requires a key')
        title = get_query_param(request.form, 'title', 'Request requires a title')
        jira_client = JiraClient(jira_url=app.config['JIRA_URL'],
                                 jira_user=app.config['JIRA_USER'],
                                 jira_password=app.config['JIRA_PASSWORD'],
                                 jira_project_id=app.config['JIRA_PROJECT_ID'],
                                 jira_project_name=app.config['JIRA_PROJECT_NAME'])
        response = jira_client.create_issue(description=description, key=key, title=title)
        return make_response(jsonify({'jiraIssue': response}), HTTPStatus.OK)

    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        return make_response(jsonify({'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)


