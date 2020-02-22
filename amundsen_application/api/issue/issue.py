from flask import current_app as app
from flask import jsonify, make_response, Response
from flask_restful import Resource, reqparse
from http import HTTPStatus
import logging

from amundsen_application.issue_tracker_clients import get_issue_tracker_client
from amundsen_application.issue_tracker_clients.issue_exceptions import IssueConfigurationException
from jira import JIRAError

LOGGER = logging.getLogger(__name__)


class IssuesAPI(Resource):
    def __init__(self) -> None:
        self.reqparse = reqparse.RequestParser()
        # declared as none initially so that it doesn't throw configuration errors until a call is made
        self.client = None

    def get(self) -> Response:
        """
        Given a table key, returns all tickets containing that key. Returns an empty array if none exist
        :return: List of tickets
        """
        try:
            self.client = get_issue_tracker_client()
            if not app.config['ISSUE_TRACKER_CLIENT_ENABLED']:
                message = 'Issuing tracking is not enabled. Request was accepted but no issue will be returned.'
                logging.exception(message)
                return make_response(jsonify({'msg': message}), HTTPStatus.ACCEPTED)

            self.reqparse.add_argument('key', 'Request requires a key', location='args')
            args = self.reqparse.parse_args()
            response = self.client.get_issues(args['key'])
            return make_response(jsonify({'issues': response}), HTTPStatus.OK)

        except IssueConfigurationException as e:
            message = 'Encountered exception: ' + str(e)
            logging.exception(message)
            return make_response(jsonify({'msg': message}), HTTPStatus.NOT_IMPLEMENTED)
        except (JIRAError, Exception) as e:
            message = 'Encountered exception: ' + str(e)
            logging.exception(message)
            return make_response(jsonify({'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)


class IssueAPI(Resource):
    def __init__(self) -> None:
        self.reqparse = reqparse.RequestParser()
        # declared as none initially so that it doesn't throw configuration errors until a call is made
        self.client = None
        super(IssueAPI, self).__init__()

    def post(self) -> Response:
        try:
            self.client = get_issue_tracker_client()
            if not app.config['ISSUE_TRACKER_CLIENT_ENABLED']:
                message = 'Issuing tracking is not enabled. Request was accepted but no issue will be created.'
                logging.exception(message)
                return make_response(jsonify({'msg': message}), HTTPStatus.ACCEPTED)

            self.reqparse.add_argument('title', type=str, location='form')
            self.reqparse.add_argument('key', type=str, location='form')
            self.reqparse.add_argument('description', type=str, location='form')
            args = self.reqparse.parse_args()
            response = self.client.create_issue(description=args['description'],
                                                table_uri=args['key'],
                                                title=args['title'])
            return make_response(jsonify({'issue': response}), HTTPStatus.OK)

        except IssueConfigurationException as e:
            message = 'Encountered exception: ' + str(e)
            logging.exception(message)
            return make_response(jsonify({'msg': message}), HTTPStatus.NOT_IMPLEMENTED)
        except (JIRAError, Exception) as e:
            message = 'Encountered exception: ' + str(e)
            logging.exception(message)
            return make_response(jsonify({'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)
