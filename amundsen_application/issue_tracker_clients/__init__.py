from flask import current_app as app
from threading import Lock
from werkzeug.utils import import_string

from amundsen_application.base.base_issue_tracker_client import BaseIssueTrackerClient

_issue_tracker_client = None
_issue_tracker_client_lock = Lock()


def get_issue_tracker_client() -> BaseIssueTrackerClient:
    """
    Provides singleton proxy client based on the config
    :return: Proxy instance of any subclass of BaseProxy
    """
    global _issue_tracker_client

    if _issue_tracker_client:
        return _issue_tracker_client

    with _issue_tracker_client_lock:
        if _issue_tracker_client:
            return _issue_tracker_client
        else:
            # Gather all the configuration to create an IssueTrackerClient
            url = app.config['ISSUE_TRACKER_URL']
            user = app.config['ISSUE_TRACKER_USER']
            password = app.config['ISSUE_TRACKER_PASSWORD']
            project_id = app.config['ISSUE_TRACKER_PROJECT_ID']

            client = import_string(app.config['ISSUE_TRACKER_CLIENT'])
            _issue_tracker_client = client(issue_tracker_url=url,
                                           issue_tracker_user=user,
                                           issue_tracker_password=password,
                                           issue_tracker_project_id=project_id)

    return _issue_tracker_client
