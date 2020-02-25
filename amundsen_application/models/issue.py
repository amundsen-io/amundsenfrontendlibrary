class Issue(dict):
    def __init__(self,
                 issue_key: str,
                 title: str,
                 url: str) -> None:
        self.issue_key = issue_key
        self.title = title
        self.url = url

        dict.__init__(self, issue_key=issue_key,
                      title=title,
                      url=url)
