from typing import Dict
from flask import current_app as app

from amundsen_application.api.utils.request_utils import get_query_param
from amundsen_application.models.user import load_user, dump_user


def get_table_key(args: Dict) -> str:
    """
    Extracts the 'key' for a table resource
    :param args: Dict which includes 'db', 'cluster', 'schema', and 'table'
    :return: the table key
    """
    db = get_query_param(args, 'db')
    cluster = get_query_param(args, 'cluster')
    schema = get_query_param(args, 'schema')
    table = get_query_param(args, 'table')
    table_key = '{db}://{cluster}.{schema}/{table}'.format(**locals())
    return table_key


def marshall_table_partial(table: Dict) -> Dict:
    """
    Forms a short version of a table Dict, with selected fields and an added 'key'
    :param table: Dict of partial table object
    :return: partial table Dict

    TODO - Unify data format returned by search and metadata.
    """
    table_name = table.get('table_name', '')
    schema_name = table.get('schema', '')
    cluster = table.get('cluster', '')
    db = table.get('database', '')
    return {
        'cluster': cluster,
        'database': db,
        'description': table.get('table_description', ''),
        'key': '{0}://{1}.{2}/{3}'.format(db, cluster, schema_name, table_name),
        'name': table_name,
        'schema_name': schema_name,
        'type': 'table',
        'last_updated_epoch': table.get('last_updated_epoch', None),
    }


def marshall_table_full(table: Dict) -> Dict:
    """
    Forms the full version of a table Dict, with additional and sanitized fields
    :param table:
    :return:
    """
    # Filter and parse the response dictionary from the metadata service
    fields = [
        'columns',
        'cluster',
        'database',
        'is_view',
        'key',
        'owners',
        'schema',
        'source',
        'table_description',
        'table_name',
        'table_readers',
        'table_writer',
        'tags',
        'watermarks',
    ]

    results = {field: table.get(field, None) for field in fields}

    is_editable = results['schema'] not in app.config['UNEDITABLE_SCHEMAS']
    results['is_editable'] = is_editable

    # In the list of owners, sanitize each entry
    results['owners'] = [_map_user_object_to_schema(owner) for owner in results['owners']]

    # In the list of reader_objects, sanitize the reader value on each entry
    readers = results['table_readers']
    for reader_object in readers:
        reader_object['reader'] = _map_user_object_to_schema(reader_object['reader'])

    # If order is provided, we sort the column based on the pre-defined order
    if app.config['COLUMN_STAT_ORDER']:
        columns = results['columns']
        for col in columns:
            # the stat_type isn't defined in COLUMN_STAT_ORDER, we just use the max index for sorting
            col['stats'].sort(key=lambda x: app.config['COLUMN_STAT_ORDER'].
                              get(x['stat_type'], len(app.config['COLUMN_STAT_ORDER'])))
            col['is_editable'] = is_editable

    # Temp code to make 'partition_key' and 'partition_value' part of the table
    results['partition'] = _get_partition_data(results['watermarks'])
    return results


def _map_user_object_to_schema(u: Dict) -> Dict:
    return dump_user(load_user(u))


def _get_partition_data(watermarks: Dict) -> Dict:
    if watermarks:
        high_watermark = next(filter(lambda x: x['watermark_type'] == 'high_watermark', watermarks))
        if high_watermark:
            return {
                'is_partitioned': True,
                'key': high_watermark['partition_key'],
                'value': high_watermark['partition_value']
            }
    return {
        'is_partitioned': False
    }



#Popular Tables
# "database": "hive",
# "cluster": "gold",
# "schema": "redshift",
# "table_name": "dimension_applicants",
# "table_description": "data for driver applicants"


#Search Result
# "name": "a0427171d3994c58a539bd8ca6caf557",
# "key": "hive://gold.default/a0427171d3994c58a539bd8ca6caf557",
# "description": null,
# "cluster": "gold",
# "database": "hive",
# "schema_name": "default",
# "column_names": [],
# "tags": [],
# "last_updated_epoch": 0

