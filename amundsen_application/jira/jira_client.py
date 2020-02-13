from typing import Any
from jira import JIRA, JIRAError
from flask import current_app as app

import logging

SEARCH_STUB = 'project={project_id} AND text ~ "{table_key}"'


class JiraClient:

    def __init__(self):
        self.jira_url = app.config['JIRA_URL']
        self.jira_user = app.config['JIRA_USER']
        self.jira_password = app.config['JIRA_PASSWORD']
        self.jira_project_id = app.config['JIRA_PROJECT_ID']
        self.jira_project_name = app.config['JIRA_PROJECT_NAME']
        self.jira_client = self.get_client()

    def get_client(self) -> JIRA:
        """
        Get the Jira client properly formatted prepared for hitting Lyft JIRA
        :return: A Jira client.
        """
        return JIRA(
            server=self.jira_url,
            basic_auth=(self.jira_user, self.jira_password)
        )

    def search(self, table_key) -> Any:
        """
        Runs a query against a given Jira project for tickets matching the key
        :param table_key: Table key
        :return: Metadata of matching issues
        """
        try:
            issues = self.jira_client.search_issues(SEARCH_STUB.format(
                project_id=self.jira_project_name,
                table_key=table_key),
                maxResults=3)
            result = []
            for issue in issues:
                result.append(self.get_issue_properties(issue))
            return result
        except JIRAError:
            return None

    def create_issue(self, description, key, title) -> Any:
        """
        Creates an issue in Jira
        :param description: Description of the Jira issue
        :param key: Table key
        :param title: Title of the Jira ticket
        :return: Metadata about the newly created issue
        """
        try:
            issue = self.jira_client.create_issue(fields=dict(project={
                "id": self.jira_project_id
            }, issuetype={
                "id": 1,
                "name": "Bug",
            }, summary=title, description=description + "\n Table Key: " + key))

            return [self.get_issue_properties(issue)]
        except JIRAError as jira_error:
            logging.error(str(jira_error))
            raise Exception(str(jira_error))

    def get_issue_properties(self, issue):
        return {
            'issue_key': issue.key,
            'title': issue.fields.summary,
            'url': issue.permalink(),
            'create_date': issue.fields.created,
            'last_updated': issue.fields.updated
        }
