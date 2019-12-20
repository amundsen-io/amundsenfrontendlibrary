import logging
import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from http import HTTPStatus
from typing import Dict, List

from flask import Response, jsonify, make_response

from amundsen_application.base.base_mail_client import BaseMailClient


class MailClient(BaseMailClient):
    def __init__(self, recipients: List[str]) -> None:
        self.recipients = recipients

    def send_email(self,
                   subject: str,
                   text: str,
                   html: str,
                   sender: str = None,
                   recipients: List[str] = None,
                   optional_data: Dict = None) -> Response:
        if not sender:
            sender = '< amundsen email >'  # change me
        if not recipients:
            recipients = self.recipients

        # TODO refactor that, it's insecure!
        sender_pass = '< amundsen email password >'  # change me

        # Create message container - the correct MIME type
        # to combine text and html is multipart/alternative.
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = sender
        msg['To'] = ', '.join(recipients)

        # Record the MIME types of both parts - text/plain and text/html.
        part1 = MIMEText(text, 'plain')
        part2 = MIMEText(html, 'html')

        # Attach parts into message container.
        # According to RFC 2046, the last part of a multipart message,
        # in this case the HTML message, is the best option and preferred.
        msg.attach(part1)
        msg.attach(part2)

        s = smtplib.SMTP('smtp.gmail.com')
        try:
            s.connect('smtp.gmail.com', 587)
            s.ehlo()
            s.starttls()
            s.ehlo()
            s.login(sender, sender_pass)
            message = s.send_message(msg)
            payload = jsonify({'msg': message})
            s.quit()
            return make_response(payload, HTTPStatus.OK)
        except Exception as e:
            message = 'Encountered exception: ' + str(e)
            logging.exception(message)
            payload = jsonify({'msg': message})
            s.quit()
            return make_response(payload, HTTPStatus.INTERNAL_SERVER_ERROR)
