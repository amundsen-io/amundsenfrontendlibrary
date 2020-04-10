import io
import logging

from flask import send_file, request, Response, current_app as app
from flask.blueprints import Blueprint

from amundsen_application.api.utils.request_utils import get_query_param
from amundsen_application.dashboard_preview.preview_factory_method import DefaultPreviewMethodFactory, \
    BasePreviewMethodFactory

LOGGER = logging.getLogger(__name__)
PREVIEW_FACTORY: BasePreviewMethodFactory = None

dashboard_preview_blueprint = Blueprint('dashboard_preview', __name__, url_prefix='/api/dashboard_preview/v0')


def initialize_preview_factory_class():
    """
    # get the Dashboard preview_factory_class from the python entry point
    :return:
    """
    global PREVIEW_FACTORY

    PREVIEW_FACTORY = app.config['DASHBOARD_PREVIEW_FACTORY']
    if not PREVIEW_FACTORY:
        PREVIEW_FACTORY = DefaultPreviewMethodFactory()

    LOGGER.info('Using {} for Dashboard'.format(PREVIEW_FACTORY))


@dashboard_preview_blueprint.route('/image', methods=['GET'])
def get_preview_image() -> Response:
    """
    Provides preview image of Dashboard which can be cached for a day.
    :return:
    """

    if not PREVIEW_FACTORY:
        LOGGER.info('Initializing Dashboard PREVIEW_FACTORY')
        initialize_preview_factory_class()

    uri = get_query_param(request.args, 'uri')

    preview_client = PREVIEW_FACTORY.get_instance(uri=uri)
    return send_file(io.BytesIO(preview_client.get_preview_image(uri=uri)),
                     mimetype='image/jpeg',
                     cache_timeout=60 * 60 * 24 * 1)
