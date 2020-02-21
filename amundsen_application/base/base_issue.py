import abc


class BaseIssue(abc.ABC):
    def __init__(self,
                 issue_key: str,
                 title: str,
                 url: str):
        self.issue_key = issue_key
        self.title = title
        self.url = url
