from typing import Dict
import requests
from flask import Response

def get_query_param(args: Dict, param: str, error_msg: str = None) -> str:
    value = args.get(param)
    if value is None:
        msg = 'A {0} parameter must be provided'.format(param) if error_msg is not None else error_msg
        raise Exception(msg)
    return value


def make_request_wrapper(method: str, url: str, client: any, headers: any, timeout: int) -> Response:
    if client is not None:
        if method == 'GET':
            return client.get(url, headers=headers, raw_response=True)
        elif method == 'PUT':
            return client.put(url, headers=headers, raw_response=True)
        elif method == 'DELETE':
            return client.delete(url, headers=headers, raw_response=True)
        elif method == 'UPDATE':
            return client.update(url, headers=headers, raw_response=True)
        else:
            raise Exception('Unsupported method')
    else:
        with requests.Session() as s:
            if method == 'DELETE':
                return s.delete(url, timeout=timeout)
            elif method == 'GET':
                return s.get(url, timeout=timeout)
            elif method == 'PUT':
                return s.put(url, timeout=timeout)
            elif method == 'UPDATE':
                return s.update(url, timeout=timeout)
            else:
                raise Exception('Unsupported method')
