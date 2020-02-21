from amundsen_application.base.base_issue import BaseIssue


class JiraIssue(dict, BaseIssue):
    def __init__(self,
                 issue_key: str,
                 title: str,
                 url: str,
                 create_date: str,
                 last_updated: str) -> None:
        self.issue_key = issue_key
        self.title = title
        self.url = url
        self.create_date = create_date
        self.last_updated = last_updated

        dict.__init__(self, issue_key=issue_key,
                      title=title,
                      url=url,
                      create_date=create_date,
                      last_updated=last_updated)
