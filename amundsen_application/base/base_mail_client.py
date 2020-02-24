import abc
from typing import Dict, List, Optional

from flask import Response


class BaseMailClient(abc.ABC):
    @abc.abstractmethod
    def __init__(self, recipients: List[str]) -> None:
        pass  # pragma: no cover

    @abc.abstractmethod
    def send_email(self,
                   html: str,
                   subject: str,
                   options: Optional[Dict],
                   recipients: List[str],
                   sender: str) -> Response:
        """
        Sends an email using the following parameters
        :param html: HTML email content
        :param subject: The subject of the email
        :param options: An optional dictionary of any values needed for custom implementations
        :param recipients: A list of recipients for the email
        :param sender: The sending address associated with the email
        :return:
        """
        raise NotImplementedError  # pragma: no cover
