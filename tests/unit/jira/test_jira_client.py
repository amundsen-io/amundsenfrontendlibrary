from unittest.mock import Mock

import flask
import unittest
from amundsen_application.jira.jira_client import JiraClient
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

    @unittest.mock.patch('amundsen_application.jira.jira_client.JIRA')
    def test_search_returns_JIRAError(self, mock_JIRA_client: Mock) -> None:
        mock_JIRA_client.return_value.search_issues.side_effect = JIRAError('Some exception')
        with app.test_request_context():
            jira_client = JiraClient()
            try:
                jira_client.search('key')
            except JIRAError as e:
                self.assertTrue(type(e), type(JIRAError))
                self.assertTrue(e, 'Some exception')

    @unittest.mock.patch('amundsen_application.jira.jira_client.JIRA')
    @unittest.mock.patch('amundsen_application.jira.jira_client.JiraClient._get_issue_properties')
    def test_search_returns_issues(self, mock_get_issue_properties: Mock, mock_JIRA_client: Mock) -> None:
        mock_JIRA_client.return_value.search_issues.return_value = self.mock_jira_issues
        mock_get_issue_properties.return_value = self.mock_issue
        with app.test_request_context():
            jira_client = JiraClient()
            results = jira_client.search('key')
            mock_JIRA_client.assert_called
            self.assertEqual(results, self.mock_jira_issues)
            mock_JIRA_client.return_value.search_issues.assert_called_with(
                'project=test_project_name AND text ~ "key"', maxResults=3)

    @unittest.mock.patch('amundsen_application.jira.jira_client.JIRA')
    def test_create_returns_JIRAError(self, mock_JIRA_client: Mock) -> None:
        mock_JIRA_client.return_value.create_issue.side_effect = JIRAError('Some exception')
        with app.test_request_context():
            jira_client = JiraClient()
            try:
                jira_client.create_issue(description='desc', key='key', title='title')
            except JIRAError as e:
                self.assertTrue(type(e), type(JIRAError))
                self.assertTrue(e, 'Some exception')

    @unittest.mock.patch('amundsen_application.jira.jira_client.JIRA')
    @unittest.mock.patch('amundsen_application.jira.jira_client.JiraClient._get_issue_properties')
    def test_create_issue(self, mock_get_issue_properties: Mock, mock_JIRA_client: Mock) -> None:
        mock_JIRA_client.return_value.create_issue.return_value = self.mock_issue
        mock_get_issue_properties.return_value = self.mock_issue
        with app.test_request_context():
            jira_client = JiraClient()
            results = jira_client.create_issue(description='desc', key='key', title='title')
            mock_JIRA_client.assert_called
            self.assertEqual(results, self.mock_jira_issues)
            mock_JIRA_client.return_value.create_issue.assert_called_with(fields=dict(project={
                'id': app.config["ISSUE_TRACKER_PROJECT_ID"]
            }, issuetype={
                'id': 1,
                'name': 'Bug',
            }, summary='title', description='desc' + '\n Table Key: ' + 'key'))
