from amundsen_application.base.base_issue import BaseIssue


class IssueResults(dict):
    def __init__(self,
                 issues: [BaseIssue],
                 remaining: int) -> None:
        self.issues = issues
        self.remaining = remaining

        dict.__init__(self, issues=issues,
                      remaining=remaining)
