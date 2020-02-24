from amundsen_application.base.base_issue import BaseIssue


class IssueResults(dict):
    def __init__(self,
                 issues: [BaseIssue],
                 remaining: int) -> None:
        """
        Returns an object representing results from an issue tracker.
        :param issues: Issues in the issue tracker matching the requested table
        :param remaining: How many issues remain in the issue tracker and are not displayed
        """
        self.issues = issues
        self.remaining = remaining

        dict.__init__(self, issues=issues,
                      remaining=remaining)
