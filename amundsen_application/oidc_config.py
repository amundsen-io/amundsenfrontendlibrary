from amundsen_application.config import LocalConfig


def get_access_headers(app):
    """
    Function to retrieve and format the Authorization Headers
    that can be passed to various microservices who are expecting that.
    :param oidc: OIDC object having authorization information
    :return: A formatted dictionary containing access token
    as Authorization header.
    """
    try:
        access_token = app.oidc.get_access_token()
        return {'Authorization': 'Bearer {}'.format(access_token)}
    except Exception:
        return None


def get_auth_user(app):
    """
    Retrieves the user information from oidc token, and then makes
    a dictionary 'UserInfo' from the token information dictionary.
    We need to convert it to a class in order to use the information
    in the rest of the Amundsen application.
    :param app: The instance of the current app.
    :return: A class UserInfo
    """
    from flask import g
    user_info = type('UserInfo', (object,), g.oidc_id_token)
    # noinspection PyUnresolvedReferences
    user_info.user_id = user_info.preferred_username
    return user_info


class OidcConfig(LocalConfig):
    AUTH_USER_METHOD = get_auth_user
    REQUEST_HEADERS_METHOD = get_access_headers
