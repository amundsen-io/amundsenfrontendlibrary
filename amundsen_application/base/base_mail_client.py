import abc
from typing import Dict, List, Optional

from flask import Response


class BaseMailClient(abc.ABC):
    @abc.abstractmethod
    def __init__(self, recipients: List[str]) -> None:
        pass  # pragma: no cover

    @abc.abstractmethod
    def send_email(self,
                   sender: Optional[str],
                   recipients: Optional[List[str]],
                   subject: Optional[str],
                   text: Optional[str],
                   html: Optional[str],
                   options: Optional[Dict]) -> Response:
        """
        Sends an email using any combination of the following optional parameters
        Parameters are optional as any custom mail client may contain its own logic
        to generate some of these parameters based on custom needs.
        :param sender: The sending address associated with the email
        :param recipients: A list of receipients for the email
        :param subject: The subject of the email
        :param text: Plain text email content
        :param html: HTML email content
        :param options: A dictionary of any values needed for custom implementations
        :return:
        """
        raise NotImplementedError  # pragma: no cover
