import unittest

from amundsen_application import create_app
from amundsen_application.api.utils.notification_utils import table_key_to_url

local_app = create_app('amundsen_application.config.TestConfig', 'tests/templates')


class MetadataTest(unittest.TestCase):
    def setUp(self) -> None:
        self.mock_table_key = 'db://cluster.schema/table'

    def test_table_key_to_url(self) -> None:
        """
        Test successful conversion between key and url
        :return:
        """
        url = table_key_to_url(self.mock_table_key)
        self.assertEqual('{}/table_detail/cluster/db/schema/table'.format(local_app.config['FRONTEND_BASE']), url)
