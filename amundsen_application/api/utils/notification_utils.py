from flask import render_template
from typing import Dict


def get_notification_content(notification_type: str, data: Dict) -> Dict:
    """
    Forms a short version of a table Dict, with selected fields and an added 'key'
    :param table: Dict of partial table object
    :return: partial table Dict

    TODO - Unify data format returned by search and metadata.
    """
    notification_type_dict = {
        'added': {
            'subject': 'You have been added',
            'html': 'notification_added.html'
        },
        'removed': {
            'subject': 'You have been removed',
            'html': 'notification_removed.html'
        },
        'edited': {
            'subject': 'You have been edited',
            'html': 'notification_edited.html'
        },
        'requested': {
            'subject': 'You have been requested',
            'html': 'notification_requested.html'
        },
    }

    html = render_template(notification_type_dict[notification_type]['html'], form_data=data)

    return {
        'subject': notification_type_dict[notification_type]['subject'],
        'html': html,
    }
