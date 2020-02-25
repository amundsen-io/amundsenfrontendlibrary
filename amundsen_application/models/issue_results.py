from amundsen_application.base.base_issue import BaseIssue
from typing import List


class IssueResults(dict):
    def __init__(self,
                 issues: List[BaseIssue],
                 remaining: int,
                 remaining_url: str) -> None:
        """
        Returns an object representing results from an issue tracker.
        :param issues: Issues in the issue tracker matching the requested table
        :param remaining: How many issues remain in the issue tracker and are not displayed
        :param remaining_url: url to the remaining issues in the issue tracker
        """
        self.issues = issues
        self.remaining = remaining
        self.remaining_url = remaining_url

        dict.__init__(self, issues=issues,
                      remaining=remaining,
                      remaining_url=remaining_url)
