from jira import JIRA, JIRAError, Issue
from amundsen_application.base.base_issue_tracker_client import BaseIssueTrackerClient
from amundsen_application.issue_tracker_clients.issue_exceptions import IssueConfigurationException
from amundsen_application.models.jira_issue import JiraIssue

import logging


SEARCH_STUB = 'text ~ "{table_key}" AND resolution = Unresolved order by createdDate DESC'
# this is provided by jira as the type of a bug
ISSUE_TYPE_ID = 1
ISSUE_TYPE_NAME = 'Bug'


class JiraClient(BaseIssueTrackerClient):

    def __init__(self, issue_tracker_url: str,
                 issue_tracker_user: str,
                 issue_tracker_password: str,
                 issue_tracker_project_id: int) -> None:
        self.jira_url = issue_tracker_url
        self.jira_user = issue_tracker_user
        self.jira_password = issue_tracker_password
        self.jira_project_id = issue_tracker_project_id
        self._validate_jira_configuration()
        self.jira_client = self.get_client()

    def get_client(self) -> JIRA:
        """
        Get the Jira client properly formatted prepared for hitting JIRA
        :return: A Jira client.
        """
        return JIRA(
            server=self.jira_url,
            basic_auth=(self.jira_user, self.jira_password)
        )

    def get_issues(self, table_uri: str) -> [JiraIssue]:
        """
        Runs a query against a given Jira project for tickets matching the key
        Returns open issues sorted by most recently created.
        :param table_uri: Table Uri ie databasetype://database/table
        :return: Metadata of matching issues
        """
        try:
            issues = self.jira_client.search_issues(SEARCH_STUB.format(
                table_key=table_uri))
            return [self._get_issue_properties(issue) for issue in issues]
        except JIRAError as e:
            logging.exception(str(e))
            raise e

    def create_issue(self, description: str, table_uri: str, title: str) -> JiraIssue:
        """
        Creates an issue in Jira
        :param description: Description of the Jira issue
        :param table_uri: Table Uri ie databasetype://database/table
        :param title: Title of the Jira ticket
        :return: Metadata about the newly created issue
        """
        try:
            issue = self.jira_client.create_issue(fields=dict(project={
                'id': self.jira_project_id
            }, issuetype={
                'id': ISSUE_TYPE_ID,
                'name': ISSUE_TYPE_NAME,
            }, summary=title, description=description + '\n Table Key: ' + table_uri))

            return self._get_issue_properties(issue)
        except JIRAError as e:
            logging.exception(str(e))
            raise e

    def _validate_jira_configuration(self) -> None:
        """
        Validates that all properties for jira configuration are set. Returns a list of missing properties
        to return if they are missing
        :return: String representing missing Jira properties, or an empty string.
        """
        missing_fields = []
        if not self.jira_url:
            missing_fields.append('ISSUE_TRACKER_URL')
        if not self.jira_user:
            missing_fields.append('ISSUE_TRACKER_USER')
        if not self.jira_password:
            missing_fields.append('ISSUE_TRACKER_PASSWORD')
        if not self.jira_project_id:
            missing_fields.append('ISSUE_TRACKER_PROJECT_ID')

        if missing_fields:
            raise IssueConfigurationException(
                f'The following config settings must be set for Jira: { ", ".join(missing_fields) } ')

    @staticmethod
    def _get_issue_properties(issue: Issue) -> JiraIssue:
        """
        Maps the jira issue object to properties we want in the UI
        :param issue: Jira issue to map
        :return: JiraIssue
        """
        return JiraIssue(issue_key=issue.key,
                         title=issue.fields.summary,
                         url=issue.permalink(),
                         create_date=issue.fields.created,
                         last_updated=issue.fields.updated)