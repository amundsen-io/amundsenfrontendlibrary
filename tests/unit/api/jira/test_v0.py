import json
import unittest
from http import HTTPStatus
from amundsen_application import create_app

local_app = create_app('amundsen_application.config.TestConfig', 'tests/templates')


class JiraTest(unittest.TestCase):

    def setUp(self) -> None:
        local_app.config['ISSUE_TRACKER_URL'] = 'url'
        self.mock_jira_issues = {
            'jiraIssues': [
                {
                    'issue_key': 'key',
                    'title': 'some title',
                    'url': 'http://somewhere',
                    'create_date': 'some date',
                    'last_updated': 'some other date'
                }
            ]
        }
        self.expected_jira_issues = [
            {
                'issue_key': 'key',
                'title': 'some title',
                'url': 'http://somewhere',
                'create_date': 'some date',
                'last_updated': 'some other date'
            }
        ]

    # ----- Jira API Tests ---- #

    def test_get_jira_issues_missing_config(self) -> None:
        """
        Test request failure if config settings are missing
        :return:
        """
        local_app.config['ISSUE_TRACKER_URL'] = None
        with local_app.test_client() as test:
            response = test.get('/api/jira/v0/issues', query_string=dict(key='table_key'))
            self.assertEqual(response.status_code, HTTPStatus.NOT_IMPLEMENTED)

    def test_get_jira_issues_no_key(self) -> None:
        """
        Test request failure if table key is missing
        :return:
        """
        with local_app.test_client() as test:
            response = test.get('/api/jira/v0/issues', query_string=dict(some_key='value'))
            self.assertEqual(response.status_code, HTTPStatus.INTERNAL_SERVER_ERROR)

    @unittest.mock.patch('amundsen_application.api.jira.v0.JiraClient')
    def test_get_jira_issues_success(self, mock_jira_client) -> None:
        """
        Tests successful get request
        :return:
        """
        mock_jira_client.return_value.search.return_value = self.expected_jira_issues

        with local_app.test_client() as test:
            response = test.get('/api/jira/v0/issues', query_string=dict(key='table_key'))
            data = json.loads(response.data)
            self.assertEqual(response.status_code, HTTPStatus.OK)
            self.assertCountEqual(data.get('jiraIssues'), self.expected_jira_issues)
            mock_jira_client.return_value.search.assert_called_with('table_key')

    def test_create_jira_issue_missing_config(self) -> None:
        """
        Test request failure if config settings are missing
        :return:
        """
        local_app.config['ISSUE_TRACKER_URL'] = None
        with local_app.test_client() as test:
            response = test.post('/api/jira/v0/issue', data={
                'description': 'test description',
                'title': 'test title',
                'key': 'key'
            })
            self.assertEqual(response.status_code, HTTPStatus.NOT_IMPLEMENTED)

    def test_create_jira_issue_no_description(self) -> None:
        """
         Test request failure if table key is missing
         :return:
         """
        with local_app.test_client() as test:
            response = test.post('/api/jira/v0/issue', data={
                'key': 'table_key',
                'title': 'test title',
            })
            self.assertEqual(response.status_code, HTTPStatus.INTERNAL_SERVER_ERROR)

    def test_create_jira_issue_no_key(self) -> None:
        """
         Test request failure if table key is missing
         :return:
         """
        with local_app.test_client() as test:
            response = test.post('/api/jira/v0/issue', data={
                'description': 'test description',
                'title': 'test title'
            })
            self.assertEqual(response.status_code, HTTPStatus.INTERNAL_SERVER_ERROR)

    def test_create_jira_issue_no_title(self) -> None:
        """
         Test request failure if table key is missing
         :return:
         """
        with local_app.test_client() as test:
            response = test.post('/api/jira/v0/issue', data={
                'description': 'test description',
                'key': 'table_key',
            })
            self.assertEqual(response.status_code, HTTPStatus.INTERNAL_SERVER_ERROR)

    @unittest.mock.patch('amundsen_application.api.jira.v0.JiraClient')
    def test_create_jira_issue_success(self, mock_jira_client) -> None:
        """
        Test request returns success and expected outcome
        :return:
        """
        mock_jira_client.return_value.create_issue.return_value = self.expected_jira_issues

        with local_app.test_client() as test:
            response = test.post('/api/jira/v0/issue',
                                 content_type='multipart/form-data',
                                 data={
                                     'description': 'test description',
                                     'title': 'test title',
                                     'key': 'key'
                                 })
            data = json.loads(response.data)
            self.assertEqual(response.status_code, HTTPStatus.OK)
            mock_jira_client.assert_called
            mock_jira_client.return_value.create_issue.assert_called
            self.assertCountEqual(data.get('jiraIssue'), self.expected_jira_issues)
