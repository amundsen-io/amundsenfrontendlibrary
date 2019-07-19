import logging

from http import HTTPStatus

from flask import Response, jsonify, make_response, render_template, request
from flask import current_app as app
from flask.blueprints import Blueprint

from amundsen_application.api.utils.notification_utils import get_notification_content
from amundsen_application.api.utils.request_utils import get_query_param
from amundsen_application.log.action_log import action_logging

LOGGER = logging.getLogger(__name__)

mail_blueprint = Blueprint('mail', __name__, url_prefix='/api/mail/v0')


class MailClientNotImplemented(Exception):
    """
    An exception when Mail Client is not implemented
    """
    pass


def get_mail_client():  # type: ignore
    mail_client = app.config['MAIL_CLIENT']

    if not mail_client:
        raise MailClientNotImplemented('An instance of BaseMailClient client must be configured on MAIL_CLIENT')

    return mail_client


@mail_blueprint.route('/feedback', methods=['POST'])
def feedback() -> Response:
    try:
        """ An instance of BaseMailClient client must be configured on MAIL_CLIENT """
        mail_client = get_mail_client()
        data = request.form.to_dict()
        text_content = '\r\n'.join('{}:\r\n{}\r\n'.format(key, val) for key, val in data.items())
        html_content = render_template('email.html', form_data=data)

        # action logging
        feedback_type = data.get('feedback-type')
        rating = data.get('rating')
        comment = data.get('comment')
        bug_summary = data.get('bug-summary')
        repro_steps = data.get('repro-steps')
        feature_summary = data.get('feature-summary')
        value_prop = data.get('value-prop')
        subject = data.get('subject') or data.get('feedback-type')

        _feedback(feedback_type=feedback_type,
                  rating=rating,
                  comment=comment,
                  bug_summary=bug_summary,
                  repro_steps=repro_steps,
                  feature_summary=feature_summary,
                  value_prop=value_prop,
                  subject=subject)

        options = {
            'email_type': 'feedback',
            'form_data': data
        }

        response = mail_client.send_email(subject=subject, text=text_content, html=html_content, options=options)
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
    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        return make_response(jsonify({'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)


@action_logging
def _feedback(*,
              feedback_type: str,
              rating: str,
              comment: str,
              bug_summary: str,
              repro_steps: str,
              feature_summary: str,
              value_prop: str,
              subject: str) -> None:
    """ Logs the content of the feedback form """
    pass  # pragma: no cover


@mail_blueprint.route('/notification', methods=['POST'])
def notification() -> Response:
    # TODO: Write unit tests once actual logic is implemented
    try:
        mail_client = get_mail_client()
        data = request.get_json()

        notification_content = get_notification_content(
            get_query_param(data, 'notificationType'),
            get_query_param(data, 'options')
        )

        response = mail_client.send_email(
            recipients=get_query_param(data, 'recipients'),
            sender=get_query_param(data, 'sender'),
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
    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        return make_response(jsonify({'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)
