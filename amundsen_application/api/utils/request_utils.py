from typing import Dict
import requests


def get_query_param(args: Dict, param: str, error_msg: str = None) -> str:
    value = args.get(param)
    if value is None:
        msg = 'A {0} parameter must be provided'.format(param) if error_msg is not None else error_msg
        raise Exception(msg)
    return value


# TODO: Define an interface for envoy_client
def make_request_wrapper(method: str, url: str, client, headers, timeout: int):  # type: ignore
    if client is not None:
        if method == 'DELETE':
            return client.delete(url, headers=headers, raw_response=True)
        elif method == 'GET':
            return client.get(url, headers=headers, raw_response=True)
        elif method == 'POST':
            return client.post(url, headers=headers, raw_response=True)
        elif method == 'PUT':
            return client.put(url, headers=headers, raw_response=True)
        else:
            raise Exception('Unsupported method')
    else:
        with requests.Session() as s:
            if method == 'DELETE':
                return s.delete(url, timeout=timeout)
            elif method == 'GET':
                return s.get(url, timeout=timeout)
            elif method == 'POST':
                return s.post(url, timeout=timeout)
            elif method == 'PUT':
                return s.put(url, timeout=timeout)
            else:
                raise Exception('Unsupported method')
