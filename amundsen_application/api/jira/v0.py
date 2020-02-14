import logging

from amundsen_application.api.utils.request_utils import get_query_param
from http import HTTPStatus
from flask import Response, jsonify, make_response, request
from flask.blueprints import Blueprint
from flask import current_app as app
from amundsen_application.jira.jira_client import JiraClient

LOGGER = logging.getLogger(__name__)

jira_blueprint = Blueprint('jira', __name__, url_prefix='/api/jira/v0')


@jira_blueprint.route('/issues', methods=['GET'])
def get_jira_issues() -> Response:
    try:
        missing_config_response = validate_jira_properties()
        if missing_config_response is not None:
            return make_response(missing_config_response, HTTPStatus.NOT_IMPLEMENTED)

        jira_client = JiraClient()  # should lazy load this instead
        table_key = get_query_param(request.args, 'key', 'Request requires a key')
        response = jira_client.search(table_key)
        return make_response(jsonify({'jiraIssues': response}), HTTPStatus.OK)

    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        return make_response(jsonify({'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)


@jira_blueprint.route('/issue', methods=["POST"])
def create_jira_issue() -> Response:
    try:
        missing_config_response = validate_jira_properties()
        if missing_config_response is not None:
            return make_response(missing_config_response, HTTPStatus.NOT_IMPLEMENTED)

        jira_client = JiraClient()  # should lazy load this instead
        description = request.form.get('description')
        key = request.form.get('key')
        title = request.form.get('title')
        response = jira_client.create_issue(description=description, key=key, title=title)
        return make_response(jsonify({'jiraIssue': response}), HTTPStatus.OK)

    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        return make_response(jsonify({'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)


def validate_jira_properties():
    missing_fields = []
    if app.config['JIRA_URL'] is None:
        missing_fields.append('JIRA_URL')
    if app.config['JIRA_USER'] is None:
        missing_fields.append('JIRA_USER')
    if app.config['JIRA_PASSWORD'] is None:
        missing_fields.append('JIRA_PASSWORD')
    if app.config['JIRA_PROJECT_ID'] is None:
        missing_fields.append('JIRA_PROJECT_ID')
    if app.config['JIRA_PROJECT_NAME'] is None:
        missing_fields.append('JIRA_PROJECT_NAME')

    if len(missing_fields) > 0:
        return jsonify({'jiraIssues': {},
                        'msg': f'The following config settings must be set for Jira: { ", ".join(missing_fields) } '})
    return None
