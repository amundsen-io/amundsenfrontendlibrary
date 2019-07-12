import logging

from http import HTTPStatus

from flask import Response, jsonify, make_response, render_template, request
from flask import current_app as app
from flask.blueprints import Blueprint

from amundsen_application.log.action_log import action_logging

LOGGER = logging.getLogger(__name__)

mail_blueprint = Blueprint('mail', __name__, url_prefix='/api/mail/v0')


@mail_blueprint.route('/feedback', methods=['POST'])
def feedback() -> Response:
    """ An instance of BaseMailClient client must be configured on MAIL_CLIENT """
    mail_client = app.config['MAIL_CLIENT']

    if not mail_client:
        message = 'An instance of BaseMailClient client must be configured on MAIL_CLIENT'
        logging.exception(message)
        return make_response(jsonify({'msg': message}), HTTPStatus.NOT_IMPLEMENTED)

    try:
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
        data = request.get_json()
        # TODO: When making a real api call, check the status code and return appropriate response
        mail_client = app.config['MAIL_CLIENT']

        if not mail_client:
            message = 'An instance of BaseMailClient client must be configured on MAIL_CLIENT'
            logging.exception(message)
            return make_response(jsonify({'msg': message}), HTTPStatus.NOT_IMPLEMENTED)
        
        notification_type = data['notificationType']
        notification_type_dict = {
            'added': {
                'subject': 'You have been added',
                'template': 'notification_added.html'
            },
            'removed': {
                'subject': 'You have been removed',
                'template': 'notification_removed.html'
            },
            'edited': {
                'subject': 'You have been edited',
                'template': 'notification_edited.html'
            },
            'requested': {
                'subject': 'You have been requested',
                'template': 'notification_requested.html'
            },
        }
        template = render_template(notification_type_dict[notification_type]['template'])

        response = mail_client.send_email(
            recipients=data['recipients'],
            sender=data['sender'],
            subject=notification_type_dict[notification_type]['subject'],
            html=template,
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
    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        return make_response(jsonify({'msg': message}), HTTPStatus.INTERNAL_SERVER_ERROR)
