from unittest.mock import Mock

import flask
import unittest
from amundsen_application.issue_tracker_clients.issue_exceptions import IssueConfigurationException
from amundsen_application.issue_tracker_clients.jira_client import JiraClient
from amundsen_application.models.jira_issue import JiraIssue
from jira import JIRAError

app = flask.Flask(__name__)
app.config.from_object('amundsen_application.config.TestConfig')


class JiraClientTest(unittest.TestCase):

    def setUp(self) -> None:
        self.mock_issue = {
            'issue_key': 'key',
            'title': 'some title',
            'url': 'http://somewhere',
            'create_date': 'some date',
            'last_updated': 'some other date'
        }
        self.mock_jira_issues = [self.mock_issue]
        self.mock_issue_instance = JiraIssue(issue_key='key',
                                             title='some title',
                                             url='http://somewhere',
                                             create_date='some date',
                                             last_updated='some other date')

    @unittest.mock.patch('amundsen_application.issue_tracker_clients.jira_client.JIRA')
    def test_create_JiraClient_validates_config(self, mock_JIRA_client: Mock) -> None:
        with app.test_request_context():
            try:
                JiraClient(issue_tracker_url=None,
                           issue_tracker_user=None,
                           issue_tracker_password=None,
                           issue_tracker_project_id=None)
            except IssueConfigurationException as e:
                self.assertTrue(type(e), type(IssueConfigurationException))
                self.assertTrue(e, 'The following config settings must be set for Jira: '
                                   'ISSUE_TRACKER_URL, ISSUE_TRACKER_USER, ISSUE_TRACKER_PASSWORD, '
                                   'ISSUE_TRACKER_PROJECT_ID')

    @unittest.mock.patch('amundsen_application.issue_tracker_clients.jira_client.JIRA')
    def test_get_issues_returns_JIRAError(self, mock_JIRA_client: Mock) -> None:
        mock_JIRA_client.return_value.get_issues.side_effect = JIRAError('Some exception')
        with app.test_request_context():
            try:
                jira_client = JiraClient(issue_tracker_url=app.config['ISSUE_TRACKER_URL'],
                                         issue_tracker_user=app.config['ISSUE_TRACKER_USER'],
                                         issue_tracker_password=app.config['ISSUE_TRACKER_PASSWORD'],
                                         issue_tracker_project_id=app.config['ISSUE_TRACKER_PROJECT_ID'])
                jira_client.get_issues('key')
            except JIRAError as e:
                self.assertTrue(type(e), type(JIRAError))
                self.assertTrue(e, 'Some exception')

    @unittest.mock.patch('amundsen_application.issue_tracker_clients.jira_client.JIRA')
    @unittest.mock.patch('amundsen_application.issue_tracker_clients.jira_client.JiraClient._get_issue_properties')
    def test_get_issues_returns_issues(self, mock_get_issue_properties: Mock, mock_JIRA_client: Mock) -> None:
        mock_JIRA_client.return_value.search_issues.return_value = self.mock_jira_issues
        mock_get_issue_properties.return_value = self.mock_issue
        with app.test_request_context():
            jira_client = JiraClient(issue_tracker_url=app.config['ISSUE_TRACKER_URL'],
                                     issue_tracker_user=app.config['ISSUE_TRACKER_USER'],
                                     issue_tracker_password=app.config['ISSUE_TRACKER_PASSWORD'],
                                     issue_tracker_project_id=app.config['ISSUE_TRACKER_PROJECT_ID'])
            results = jira_client.get_issues(table_uri='key')
            mock_JIRA_client.assert_called
            self.assertEqual(results, self.mock_jira_issues)
            mock_JIRA_client.return_value.search_issues.assert_called_with(
                'text ~ "key" AND resolution = Unresolved order by createdDate DESC')

    @unittest.mock.patch('amundsen_application.issue_tracker_clients.jira_client.JIRA')
    def test_create_returns_JIRAError(self, mock_JIRA_client: Mock) -> None:
        mock_JIRA_client.return_value.create_issue.side_effect = JIRAError('Some exception')
        with app.test_request_context():
            try:
                jira_client = JiraClient(issue_tracker_url=app.config['ISSUE_TRACKER_URL'],
                                         issue_tracker_user=app.config['ISSUE_TRACKER_USER'],
                                         issue_tracker_password=app.config['ISSUE_TRACKER_PASSWORD'],
                                         issue_tracker_project_id=app.config['ISSUE_TRACKER_PROJECT_ID'])
                jira_client.create_issue(description='desc', table_uri='key', title='title')
            except JIRAError as e:
                self.assertTrue(type(e), type(JIRAError))
                self.assertTrue(e, 'Some exception')

    @unittest.mock.patch('amundsen_application.issue_tracker_clients.jira_client.JIRA')
    @unittest.mock.patch('amundsen_application.issue_tracker_clients.jira_client.JiraClient._get_issue_properties')
    def test_create_issue(self, mock_get_issue_properties: Mock, mock_JIRA_client: Mock) -> None:
        mock_JIRA_client.return_value.create_issue.return_value = self.mock_issue
        mock_get_issue_properties.return_value = self.mock_issue_instance
        with app.test_request_context():
            jira_client = JiraClient(issue_tracker_url=app.config['ISSUE_TRACKER_URL'],
                                     issue_tracker_user=app.config['ISSUE_TRACKER_USER'],
                                     issue_tracker_password=app.config['ISSUE_TRACKER_PASSWORD'],
                                     issue_tracker_project_id=app.config['ISSUE_TRACKER_PROJECT_ID'])
            results = jira_client.create_issue(description='desc', table_uri='key', title='title')
            mock_JIRA_client.assert_called
            self.assertEqual(results, self.mock_issue_instance)
            mock_JIRA_client.return_value.create_issue.assert_called_with(fields=dict(project={
                'id': app.config["ISSUE_TRACKER_PROJECT_ID"]
            }, issuetype={
                'id': 1,
                'name': 'Bug',
            }, summary='title', description='desc' + '\n Table Key: ' + 'key'))
