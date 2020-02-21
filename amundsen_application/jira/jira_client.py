from jira import JIRA, JIRAError, Issue
from amundsen_application.models.jira_issue import JiraIssue

import logging

SEARCH_STUB = 'project={project_id} AND text ~ "{table_key}" AND resolution = Unresolved order by createdDate DESC'
# this is provided by jira as the type of a bug
ISSUE_TYPE_ID = 1
ISSUE_TYPE_NAME = 'Bug'


class JiraClient:

    def __init__(self, jira_url: str,
                 jira_user: str,
                 jira_password: str,
                 jira_project_id: int,
                 jira_project_name: str) -> None:
        self.jira_url = jira_url
        self.jira_user = jira_user
        self.jira_password = jira_password
        self.jira_project_id = jira_project_id
        self.jira_project_name = jira_project_name
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

    def search(self, table_key: str) -> [JiraIssue]:
        """
        Runs a query against a given Jira project for tickets matching the key
        Returns open issues sorted by most recently created.
        :param table_key: Table key
        :return: Metadata of matching issues
        """
        try:
            issues = self.jira_client.search_issues(SEARCH_STUB.format(
                project_id=self.jira_project_name,
                table_key=table_key))
            return [self._get_issue_properties(issue) for issue in issues]
        except JIRAError as e:
            logging.exception(str(e))
            raise e

    def create_issue(self, description: str, key: str, title: str) -> JiraIssue:
        """
        Creates an issue in Jira
        :param description: Description of the Jira issue
        :param key: Table Uri ie databasetype://database/table
        :param title: Title of the Jira ticket
        :return: Metadata about the newly created issue
        """
        try:
            issue = self.jira_client.create_issue(fields=dict(project={
                'id': self.jira_project_id
            }, issuetype={
                'id': ISSUE_TYPE_ID,
                'name': ISSUE_TYPE_NAME,
            }, summary=title, description=description + '\n Table Key: ' + key))

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
            missing_fields.append('JIRA_URL')
        if not self.jira_user:
            missing_fields.append('JIRA_USER')
        if not self.jira_password:
            missing_fields.append('JIRA_PASSWORD')
        if not self.jira_project_id:
            missing_fields.append('JIRA_PROJECT_ID')
        if not self.jira_project_name:
            missing_fields.append('JIRA_PROJECT_NAME')

        if len(missing_fields) > 0:
            raise Exception(f'The following config settings must be set for Jira: { ", ".join(missing_fields) } ')

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
