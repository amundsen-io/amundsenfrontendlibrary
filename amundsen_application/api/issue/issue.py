from flask import current_app as app
from flask import jsonify, make_response
from flask_restful import Resource, reqparse
from http import HTTPStatus
import logging

from amundsen_application.jira.jira_client import JiraClient

LOGGER = logging.getLogger(__name__)


class IssuesAPI(Resource):
    def __init__(self) -> None:
        self.reqparse = reqparse.RequestParser()
        self.client = JiraClient(jira_url=app.config['JIRA_URL'],
                                 jira_user=app.config['JIRA_USER'],
                                 jira_password=app.config['JIRA_PASSWORD'],
                                 jira_project_id=app.config['JIRA_PROJECT_ID'])

    def get(self):
        """
        Given a table key, returns all tickets containing that key. Returns an empty array if none exist
        :return: List of tickets
        """
        try:
            self.reqparse.add_argument('key', 'Request requires a key', location='args')
            args = self.reqparse.parse_args()
            response = self.client.get_issues(args['key'])
            return make_response(jsonify({'issues': response}), HTTPStatus.OK)

        except Exception as e:
            message = 'Encountered exception: ' + str(e)
            logging.exception(message)
            return make_response(jsonify({'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)


class IssueAPI(Resource):
    def __init__(self) -> None:
        self.reqparse = reqparse.RequestParser()
        self.client = JiraClient(jira_url=app.config['JIRA_URL'],
                                 jira_user=app.config['JIRA_USER'],
                                 jira_password=app.config['JIRA_PASSWORD'],
                                 jira_project_id=app.config['JIRA_PROJECT_ID'])
        super(IssueAPI, self).__init__()

    def post(self):
        try:
            self.reqparse.add_argument('title', type=str, location='form')
            self.reqparse.add_argument('key', type=str, location='form')
            self.reqparse.add_argument('description', type=str, location='form')
            args = self.reqparse.parse_args()
            response = self.client.create_issue(description=args['description'],
                                                key=args['key'],
                                                title=args['title'])
            return make_response(jsonify({'issue': response}), HTTPStatus.OK)

        except Exception as e:
            message = 'Encountered exception: ' + str(e)
            logging.exception(message)
            return make_response(jsonify({'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)
