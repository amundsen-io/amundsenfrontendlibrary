import logging

from amundsen_application.api.utils.request_utils import get_query_param
from http import HTTPStatus
from flask import Response, jsonify, make_response, request
from flask.blueprints import Blueprint
from upstream.amundsen_application.jira.jira_client import JiraClient

LOGGER = logging.getLogger(__name__)

jira_blueprint = Blueprint('jira', __name__, url_prefix='/api/jira/v0')


@jira_blueprint.route('/issues', methods=['GET'])
def get_jira_issues() -> Response:
    try:
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
        jira_client = JiraClient()  # should lazy load this instead
        description = request.form.get('description')
        key = request.form.get('key')
        title = request.form.get('title')
        response = jira_client.create_issue(description=description, key=key, title=title)
        return make_response(jsonify({'issue_id': response}), HTTPStatus.OK)

    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        return make_response(jsonify({'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)
