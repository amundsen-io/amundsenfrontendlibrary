from http import HTTPStatus
from typing import Dict, List
from amundsen_application.base.base_preview_client import BasePreviewClient
from amundsen_application.models.preview_data import (
    ColumnItem,
    PreviewData,
    PreviewDataSchema,
)
from flask import Response, make_response, jsonify
from flask import current_app as app


class BaseBigqueryPreviewClient(BasePreviewClient):
    """
    Returns a Response object, where the response data represents a json object
    with the preview data accessible on 'preview_data' key. The preview data should
    match amundsen_application.models.preview_data.PreviewDataSchema
    """

    def __init__(self) -> None:
        self.previewable_projects = app.config["PREVIEW_PROJECTS"]

    def _bq_list_rows(
        self, gcp_project_id: str, table_project_name: str, table_name: str
    ) -> PreviewData:
        """
        Returns PreviewData from bigquery list rows api.
        """
        pass  # pragma: no cover

    def _column_item_from_bq_schema(self, schemafield, key=None) -> List:
        """
        Recursively build ColumnItems from the bigquery schema
        """
        all_fields = []
        if schemafield.field_type != "RECORD":
            name = key + "." + schemafield.name if key else schemafield.name
            return [ColumnItem(name, schemafield.field_type)]
        for field in schemafield.fields:
            if key:
                name = key + "." + schemafield.name
            else:
                name = schemafield.name
            all_fields.extend(self._column_item_from_bq_schema(field, name))
        return all_fields

    def get_preview_data(self, params: Dict, optionalHeaders: Dict = None) -> Response:
        if self.previewable_projects and params["cluster"] not in self.previewable_projects:
            return make_response(jsonify({"preview_data": {}}), HTTPStatus.FORBIDDEN)

        preview_data = self._bq_list_rows(
            params["cluster"],
            params["schema"],
            params["tableName"],
        )
        data = PreviewDataSchema().dump(preview_data)[0]
        errors = PreviewDataSchema().load(data)[1]
        payload = jsonify({"preview_data": data})

        if not errors:
            payload = jsonify({"preview_data": data})
            return make_response(payload, HTTPStatus.OK)
        return make_response(
            jsonify({"preview_data": {}}), HTTPStatus.INTERNAL_SERVER_ERROR
        )