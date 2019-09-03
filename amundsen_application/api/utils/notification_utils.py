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

    try:
        if sender in recipients:
            recipients.remove(sender)
        if len(recipients) == 0:
            logging.info('No recipients exist for notification')
            return make_response(
                jsonify({
                    'msg': 'No valid recipients exist for notification, notification was not sent.'
                }),
                HTTPStatus.OK
            )

        mail_client = get_mail_client()

        notification_content = get_notification_content(
            notification_type=notification_type,
            sender=sender,
            options=options
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
    :return: html and subject Dict
    """
    template = get_notification_template(notification_type=notification_type)
    logging.info('Got template for NOTIFICATION')
    html_content = render_template(template, sender=sender, options=options)
    logging.info('Generated html content for NOTIFICATION')
    return {
        'html': html_content,
        'subject': get_notification_subject(notification_type=notification_type, options=options),
    }


def get_notification_template(*, notification_type: str) -> str:
    """
    Returns the template to use for the given notification_type
    :param notification_type: type of notification
    :return: The path to the template
    """
    notification_template_dict = {
        'added': 'notifications/notification_added.html',
        'removed': 'notifications/notification_removed.html',
        'edited': 'notifications/notification_edited.html',
        'requested': 'notifications/notification_requested.html',
    }
    return notification_template_dict.get(notification_type, '')


def get_notification_subject(*, notification_type: str, options: Dict) -> str:
    """
    Returns the subject to use for the given notification_type
    :param notification_type: type of notification
    :param options: data necessary to render email template content
    :return: The subject to be used with the notification
    """
    notification_subject_dict = {
        'added': 'You are now an owner of {}'.format(options['resource_name']),
        'removed': 'You have been removed as an owner of {}'.format(options['resource_name']),
        'edited': 'Your dataset {}\'s metadata has been edited'.format(options['resource_name']),
        'requested': 'Request for metadata on {}'.format(options['resource_name']),
    }
    return notification_subject_dict.get(notification_type, '')


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
