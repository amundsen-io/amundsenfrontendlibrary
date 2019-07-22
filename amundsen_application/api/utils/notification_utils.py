from flask import render_template
from typing import Dict


def get_notification_content(notification_type: str, data: Dict) -> Dict:
    """
    Returns a subject and a rendered html email template based off
    the input notification_type and data provided
    :param notification_type: type of notification
    :param data: data necessary to render email template content
    :return: subject and html Dict
    """
    notification_type_dict = {
        'added': {
            'subject': 'You have been added',
            'html': 'notifications/notification_added.html'
        },
        'removed': {
            'subject': 'You have been removed',
            'html': 'notifications/notification_removed.html'
        },
        'edited': {
            'subject': 'You have been edited',
            'html': 'notifications/notification_edited.html'
        },
        'requested': {
            'subject': 'You have been requested',
            'html': 'notifications/notification_requested.html'
        },
    }

    html = render_template(notification_type_dict.get(notification_type, {}).get('html'), form_data=data)

    return {
        'subject': notification_type_dict[notification_type]['subject'],
        'html': html,
    }
