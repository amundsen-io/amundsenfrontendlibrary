# Overview

Amundsen's data preview feature requires that developers create a custom implementation of `base_preview_client` to make a request for the data to be shown in the preview. This feature was designed to assist with data discovery by providing the end user the option to view a sample of the actual resource data so that they can verify whether or not they want to transition into exploring that data, or continue their search.

[Superset](https://github.com/apache/incubator-superset) is an open-source business intelligence tool that can be used for data exploration. Amundsen's data preview feature was created with Superset in mind, and it is what we leverage internally at Lyft to support the feature. This document provides some insight into how to configure Amundsen's frontend application to leverage Superset for data previews.

## Implementation

This section gives more insight into how to implement the `base_superset_preview_client` to make a request to an instance of Superset for table data that will be shown in Amudsen's data preview.

TBD

## Configuration

After implementing your custom Superset preview client class, point the `[preview_client]` entry point in your local `setup.py` to this class.

```
entry_points="""
    ...

    [preview_client]
    table_preview_client_class = amundsen_application.path.to.preview_client:PreviewClientClassName
"""
```
