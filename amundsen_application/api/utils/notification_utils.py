import logging

from http import HTTPStatus

from flask import current_app as app
from flask import jsonify, make_response, render_template, Response
from typing import Dict, List

from amundsen_application.api.exceptions import MailClientNotImplemented


def send_notification(*, notification_type: str, options: Dict, recipients: List, sender: str) -> Response:
    """
    Sends a notification via email to a given list of recipients
    :param notification_type: type of notification
    :param options: data necessary to render email template content
    :param recipients: list of recipients who should receive notification
    :param sender: email of notification sender
    :return: Response
    """
    # TODO: write tests
    try:
        mail_client = get_mail_client()

        notification_content = get_notification_content(
            notification_type=notification_type,
            options=options
        )

        response = mail_client.send_email(
            recipients=recipients,
            sender=sender,
            subject=notification_content['subject'],
            html=notification_content['html'],
            options={
                'email_type': 'notification'
            },
        )
        status_code = response.status_code

        if status_code == HTTPStatus.OK:
            message = 'Success'
        else:
            message = 'Mail client failed with status code ' + str(status_code)
            logging.error(message)

        return make_response(jsonify({'msg': message}), status_code)
    except MailClientNotImplemented as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        return make_response(jsonify({'msg': message}), HTTPStatus.NOT_IMPLEMENTED)
    except Exception as e1:
        message = 'Encountered exception: ' + str(e1)
        logging.exception(message)
        return make_response(jsonify({'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)


def get_mail_client():  # type: ignore
    """
    Gets a mail_client object to send emails, raises an exception
    if mail client isn't implemented
    """
    # TODO: write tests
    mail_client = app.config['MAIL_CLIENT']

    if not mail_client:
        raise MailClientNotImplemented('An instance of BaseMailClient client must be configured on MAIL_CLIENT')

    return mail_client


def get_notification_content(*, notification_type: str, options: Dict) -> Dict:
    """
    Returns a subject and a rendered html email template based off
    the input notification_type and data provided
    :param notification_type: type of notification
    :param options: data necessary to render email template content
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

    html = render_template(notification_type_dict.get(notification_type, {}).get('html'), form_data=options)

    return {
        'subject': notification_type_dict[notification_type]['subject'],
        'html': html,
    }
