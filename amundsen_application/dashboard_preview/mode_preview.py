import logging
import os
from typing import Optional, Any

import requests
from requests.auth import HTTPBasicAuth
from retrying import retry

from amundsen_application.dashboard_preview.base_preview import BasePreview

LOGGER = logging.getLogger(__name__)
DEFAULT_REPORT_URL_TEMPLATE = 'https://app.mode.com/api/{organization}/reports/{dashboard_id}'

# Environment variables
MODE_ACCESS_TOKEN = 'CREDENTIALS_MODE_ADMIN_TOKEN'
MODE_PASSWORD = 'CREDENTIALS_MODE_ADMIN_PASSWORD'
MODE_ORGANIZATION = 'MODE_ORGANIZATION'
REPORT_URL_TEMPLATE = 'REPORT_URL_TEMPLATE'


def _validate_not_none(var: Any) -> Any:
    if not var:
        raise ValueError
    return var


class ModePreview(BasePreview):
    def __init__(self, *,
                 access_token: Optional[str] = os.getenv(MODE_ACCESS_TOKEN),
                 password: Optional[str] = os.getenv(MODE_PASSWORD),
                 organization: Optional[str] = os.getenv(MODE_ORGANIZATION),
                 report_url_template: Optional[str] = os.getenv(REPORT_URL_TEMPLATE, DEFAULT_REPORT_URL_TEMPLATE)):
        self._access_token = _validate_not_none(access_token)
        self._password = _validate_not_none(password)
        self._organization = _validate_not_none(organization)
        self._report_url_template = _validate_not_none(report_url_template)

    @retry(stop_max_attempt_number=3, wait_random_min=500, wait_random_max=1000)
    def get_preview_image(self, *, uri) -> bytes:
        url = self._get_preview_image_url(uri=uri)
        r = requests.get(url, allow_redirects=True)
        r.raise_for_status()

        return r.content

    def _get_preview_image_url(self, *, uri) -> str:
        url = self._report_url_template.format(organization=self._organization, dashboard_id=uri.split('/')[-1])

        LOGGER.info('Calling URL {} to fetch preview image URL'.format(url))
        response = requests.get(url, auth=HTTPBasicAuth(self._access_token, self._password))
        response.raise_for_status()

        return response.json()['web_preview_image']
