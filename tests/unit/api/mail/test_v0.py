import unittest

from http import HTTPStatus
from typing import Dict, List
from unittest import mock

from flask import Response, jsonify, make_response

from amundsen_application import create_app
from amundsen_application.base.base_mail_client import BaseMailClient

local_app = create_app('amundsen_application.config.TestConfig', 'tests/templates')


class MockMailClient(BaseMailClient):
    def __init__(self, status_code: int, recipients: List = []) -> None:
        self.status_code = status_code

    def send_email(self,
                   sender: str = None,
                   recipients: List = [],
                   subject: str = None,
                   text: str = None,
                   html: str = None,
                   optional_data: Dict = {}) -> Response:
        return make_response(jsonify({}), self.status_code)


class MockBadClient(BaseMailClient):
    def __init__(self) -> None:
        pass

    def send_email(self,
                   sender: str = None,
                   recipients: List = [],
                   subject: str = None,
                   text: str = None,
                   html: str = None,
                   optional_data: Dict = {}) -> Response:
        raise Exception('Bad client')


class MailTest(unittest.TestCase):
    def test_feedback_client_not_implemented(self) -> None:
        """
        Test mail client is not implemented, and endpoint should return appropriate code
        :return:
        """
        with local_app.test_client() as test:
            response = test.post('/api/mail/v0/feedback', json={
                'rating': '10', 'comment': 'test'
            })
            self.assertEqual(response.status_code, HTTPStatus.NOT_IMPLEMENTED)

    def test_feedback_client_success(self) -> None:
        """
        Test mail client success
        :return:
        """
        local_app.config['MAIL_CLIENT'] = MockMailClient(status_code=200)
        with local_app.test_client() as test:
            response = test.post('/api/mail/v0/feedback', json={
                'rating': '10', 'comment': 'test'
            })
            self.assertEqual(response.status_code, HTTPStatus.OK)

    def test_feedback_client_raise_exception(self) -> None:
        """
        Test failure due to incorrect implementation of base_mail_client
        :return:
        """
        local_app.config['MAIL_CLIENT'] = MockBadClient()
        with local_app.test_client() as test:
            response = test.post('/api/mail/v0/feedback', json={
                'rating': '10', 'comment': 'test'
            })
            self.assertEqual(response.status_code, HTTPStatus.INTERNAL_SERVER_ERROR)

    def test_feedback_client_propagate_status_code(self) -> None:
        """
        Test that specific status codes returned from a custom mail client propagate,
        so that they may be appropriately logged and surfaced to the React application
        :return:
        """
        expected_code = HTTPStatus.BAD_REQUEST
        local_app.config['MAIL_CLIENT'] = MockMailClient(status_code=expected_code)
        with local_app.test_client() as test:
            response = test.post('/api/mail/v0/feedback', json={
                'rating': '10', 'comment': 'test'
            })
            self.assertEqual(response.status_code, expected_code)

    @mock.patch('amundsen_application.base.base_mail_client.BaseMailClient')
    def test_anonymous_user_if_not_authed(self, mail_mock) -> None:
        """
        Test that 'anonymous' is populated for the user if no auth method is specified
        :return:
        """
        sample_app = create_app('amundsen_application.config.TestConfig', 'tests/templates')
        with sample_app.app_context():
            mail_mock.send_email.return_value = make_response(jsonify({}), HTTPStatus.OK)
            sample_app.config['MAIL_CLIENT'] = mail_mock
            sample_app.config['AUTH_USER_METHOD'] = None
            with sample_app.test_client() as test:
                test.post('/api/mail/v0/feedback', json={
                    'rating': '10', 'comment': 'test'
                })
                call_args = sample_app.config['MAIL_CLIENT'].send_email.call_args
                self.assertIn('anonymous', call_args[1]['text'])

    @mock.patch('amundsen_application.base.base_mail_client.BaseMailClient')
    def test_user_if_authed(self, mail_mock) -> None:
        """
        Test that the logged in user is sent if an auth method is specified
        :return:
        """
        sample_app = create_app('amundsen_application.config.TestConfig', 'tests/templates')
        with sample_app.app_context():
            mail_mock.send_email.return_value = make_response(jsonify({}), HTTPStatus.OK)
            sample_app.config['MAIL_CLIENT'] = mail_mock
            with sample_app.test_client() as test:
                test.post('/api/mail/v0/feedback', json={
                    'rating': '10', 'comment': 'test'
                })
                call_args = sample_app.config['MAIL_CLIENT'].send_email.call_args
                self.assertIn('test_user', call_args[1]['text'])
