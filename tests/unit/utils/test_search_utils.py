import unittest

from amundsen_application.api.utils.search_utils import generate_query_json, has_filters, transform_filters, \
    map_dashboard_result


class SearchUtilsTest(unittest.TestCase):
    def setUp(self) -> None:
        self.test_filters = {
            'invalid_option': 'invalid',
            'column': 'column_name',
            'database': {
                'db1': True,
                'db2': False,
                'db3': True,
            },
            'schema': 'schema_name',
            'table': 'table_name',
            'tag': 'tag_name',
        }
        self.expected_transformed_filters = {
            'column': ['column_name'],
            'database': ['db1', 'db3'],
            'schema': ['schema_name'],
            'table': ['table_name'],
            'tag': ['tag_name'],
        }
        self.test_page_index = "1"
        self.test_term = 'hello'

    def test_transform_filters(self) -> None:
        """
        Verify that the given filters are correctly transformed
        :return:
        """
        self.assertEqual(transform_filters(filters=self.test_filters), self.expected_transformed_filters)

    def test_generate_query_json(self) -> None:
        """
        Verify that the returned diction correctly transforms the parameters
        :return:
        """
        query_json = generate_query_json(filters=self.expected_transformed_filters,
                                         page_index=self.test_page_index,
                                         search_term=self.test_term)
        self.assertEqual(query_json.get('page_index'), int(self.test_page_index))
        self.assertEqual(query_json.get('search_request'), {
            'type': 'AND',
            'filters': self.expected_transformed_filters
        })
        self.assertEqual(query_json.get('query_term'), self.test_term)

    def test_has_filters_return_true(self) -> None:
        """
        Returns true if called with a dictionary that has values for a valid filter category
        :return:
        """
        self.assertTrue(has_filters(filters=self.expected_transformed_filters))

    def test_has_filters_return_false(self) -> None:
        """
        Returns false if called with a dictionary that has no values for a valid filter category
        :return:
        """
        self.assertFalse(has_filters(filters={'fake_category': ['db1']}))
        self.assertFalse(has_filters(filters={'tag': []}))
        self.assertFalse(has_filters())

    def test_map_dashboard_result(self) -> None:
        """
        Verifies that the given dashboard results are correctly transformed
        :return:
        """
        given = {
            'group_name': 'Amundsen Team',
            'group_url': 'product_dashboard://cluster.group',
            'name': 'Amundsen Metrics Dashboard',
            'product': 'mode',
            'description': 'I am a dashboard',
            'uri': 'product_dashboard://cluster.group/name',
            'url': 'product/name',
            'cluster': 'cluster',
            'last_successful_run_timestamp': 1585062593,
            'total_usage': 1,
        }
        expected = {
            'group_name': 'Amundsen Team',
            'group_url': 'product_dashboard://cluster.group',
            'name': 'Amundsen Metrics Dashboard',
            'key': 'product_dashboard://cluster.group/name',
            'product': 'mode',
            'description': 'I am a dashboard',
            'uri': 'product_dashboard://cluster.group/name',
            'url': 'product/name',
            'cluster': 'cluster',
            'last_successful_run_timestamp': 1585062593,
            'type': 'dashboard'
        }
        self.assertEqual(map_dashboard_result(given), expected)
