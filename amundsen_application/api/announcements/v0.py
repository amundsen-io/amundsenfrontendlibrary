# Copyright Contributors to the Amundsen project.
# SPDX-License-Identifier: Apache-2.0

import logging

from http import HTTPStatus
from pkg_resources import iter_entry_points

from flask import Response, jsonify, make_response
from flask.blueprints import Blueprint

LOGGER = logging.getLogger(__name__)

# TODO: Blueprint classes might be the way to go
ANNOUNCEMENT_CLIENT_CLASS = None
ANNOUNCEMENT_CLIENT_INSTANCE = None

# get the announcement_client_class from the python entry point
for entry_point in iter_entry_points(group='announcement_client', name='announcement_client_class'):
    announcement_client_class = entry_point.load()
    if announcement_client_class is not None:
        ANNOUNCEMENT_CLIENT_CLASS = announcement_client_class

announcements_blueprint = Blueprint('announcements', __name__, url_prefix='/api/announcements/v0')


@announcements_blueprint.route('/', methods=['GET'])
def get_announcements() -> Response:
    global ANNOUNCEMENT_CLIENT_INSTANCE

    # Testing Code, remove at the end
    payload = jsonify({"msg":"Success","posts":[{"date":"October 31, 2018","html_content":"Tables under the following schemas are now available in Amundsen! \ud83c\udf89\n\n<ul>\n<li>basemap</li>\n<li>driver_engagement</li>\n<li>enterprise</li>\n<li>experimentation</li>\n<li>production</li>\n</ul>\n","title":"New Schemas Added"},{"date":"October 31, 2018","html_content":"<p>Presto views were not being indexed correctly in Amundsen. As of September 27th 2018, we have removed Presto views from Amundsen until we scope out a long term solution. See <a href=\"https://superset.lyft.net/superset/sqllab?id=1638\">this Superset query</a> for the full list of views that were removed.</p>","title":"Presto Views Removed"},{"date":"September 11, 2018","html_content":"<p>The search feature has been modified to work with query terms that include a period, underscore, or empty space. For example, you can now search for <code>core.fact_rides</code> or <code>core fact rides</code> or <code>fact_rides</code>. We now also display paginated results to further aid your search.</p>\n\n<p>Curious to know more about the frequent users of a resource? You can now click on a frequent user to get directed to their Family profile.<p>\n\n<p>Curious to know how a table was generated? We now provide a link to the Airflow DAG.<p>\n\n<p>We have updated the formatting of the url for the table detail page. Please make a note to update any links you may have shared with others or posted in any docs.</p>","title":"Search Improvements & New Features"}]})

    return make_response(payload, HTTPStatus.OK)

    try:
        if ANNOUNCEMENT_CLIENT_INSTANCE is None and ANNOUNCEMENT_CLIENT_CLASS is not None:
            ANNOUNCEMENT_CLIENT_INSTANCE = ANNOUNCEMENT_CLIENT_CLASS()

        if ANNOUNCEMENT_CLIENT_INSTANCE is None:
            payload = jsonify({'posts': [], 'msg': 'A client for retrieving announcements must be configured'})
            return make_response(payload, HTTPStatus.NOT_IMPLEMENTED)

        return ANNOUNCEMENT_CLIENT_INSTANCE._get_posts()
    except Exception as e:
        message = 'Encountered exception: ' + str(e)
        logging.exception(message)
        payload = jsonify({'posts': [], 'msg': message})
        return make_response(payload, HTTPStatus.INTERNAL_SERVER_ERROR)
