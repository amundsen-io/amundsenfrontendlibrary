from typing import Optional

from flask import Flask


class PrefixMiddleware:

    def __init__(self, app: Flask, prefix: Optional[str] = ''):
        self.app = app
        self.prefix = prefix

    def __call__(self, environ, start_response):
        if environ.get('PATH_INFO', '/').startswith(self.prefix):
            environ['PATH_INFO'] = environ['PATH_INFO'][len(self.prefix):]
            environ['SCRIPT_NAME'] = self.prefix
            return self.app(environ, start_response)
        else:
            start_response('404', [('Content-Type', 'text/plain')])
            return ["This url does not belong to the app.".encode()]
