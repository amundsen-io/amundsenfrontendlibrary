import abc
from amundsen_application.base.base_issue import BaseIssue


class BaseIssueTrackerClient(abc.ABC):
    @abc.abstractmethod
    def __init__(self) -> None:
        pass  # pragma: no cover

    @abc.abstractmethod
    def get_issues(self, table_uri: str):
        """
        Gets issues from the issue tracker
        :param table_uri: Table Uri ie databasetype://database/table
        :return:
        """
        raise NotImplementedError  # pragma: no cover

    @abc.abstractmethod
    def create_issue(self, table_uri: str, title: str, description: str) -> BaseIssue:
        """
        Given a title, description, and table key, creates a ticket in the configured project
        Automatically places the table_uri in the description of the ticket.
        Returns the ticket information, including URL.
        :param description: user provided description for the jira ticket
        :param table_uri: Table URI ie databasetype://database/table
        :param title: Title of the ticket
        :return: A single ticket
        """
        raise NotImplementedError  # pragma: no cover
