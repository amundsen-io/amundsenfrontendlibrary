import logging
import re

from http import HTTPStatus

from flask import current_app as app
from flask import jsonify, make_response, render_template, Response
from typing import Dict, List

from amundsen_application.api.exceptions import MailClientNotImplemented
from amundsen_application.log.action_log import action_logging


def send_notification(*, notification_type: str, options: Dict, recipients: List, sender: str) -> Response:
    """
    Sends a notification via email to a given list of recipients
    :param notification_type: type of notification
    :param options: data necessary to render email template content
    :param recipients: list of recipients who should receive notification
    :param sender: email of notification sender
    :return: Response
    """
    @action_logging
    def _log_send_notification(*, notification_type: str, options: Dict, recipients: List, sender: str) -> None:
        """ Logs the content of a sent notification"""
        pass  # pragma: no cover

    # TODO: write tests
    try:
        mail_client = get_mail_client()

        notification_content = get_notification_content(
            notification_type=notification_type,
            sender=sender,
            options=options
        )

        if sender in recipients:
            recipients.remove(sender)
        recipients.append('rlieu@lyft.com')
        if len(recipients) == 0:
            logging.info('No recipients exist for notification')
            return make_response(
                jsonify({
                    'msg': 'Sender is excluded from notification recipients, no recipients exist.'
                }),
                HTTPStatus.OK
            )

        _log_send_notification(
            notification_type=notification_type,
            options=options,
            recipients=recipients,
            sender=sender
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


def get_notification_content(*, notification_type: str, sender: str, options: Dict) -> Dict:
    """
    Returns a subject and a rendered html email template based off
    the input notification_type and data provided
    :param notification_type: type of notification
    :param options: data necessary to render email template content
    :return: subject and html Dict
    """
    notification_type_dict = {
        'added': {
            'subject': 'You are now an owner of {}'.format(options['resource_name']),
            'html': 'notifications/notification_added.html'
        },
        'removed': {
            'subject': 'You have been removed as an owner of {}'.format(options['resource_name']),
            'html': 'notifications/notification_removed.html'
        },
        'edited': {
            'subject': 'Your dataset {}\'s metadata has been edited'.format(options['resource_name']),
            'html': 'notifications/notification_edited.html'
        },
        'requested': {
            'subject': 'Request for metadata on {}'.format(options['resource_name']),
            'html': 'notifications/notification_requested.html'
        },
    }

    html = render_template(notification_type_dict.get(
        notification_type, {}).get('html'),
        sender=sender,
        options=options
    )

    return {
        'subject': notification_type_dict[notification_type]['subject'],
        'html': html,
    }


def table_key_to_url(*, table_key: str) -> str:
    """
    Takes a table key and transforms it to a usable URL
    :param table_key: table key string
    :return: table url string
    """
    split = re.split('/|\.', table_key)
    return '{}/table_detail/{}/{}/{}/{}'.format(
        app.config['FRONTEND_BASE'],
        split[2],
        split[0][:-1],
        split[3],
        split[4]
    )
