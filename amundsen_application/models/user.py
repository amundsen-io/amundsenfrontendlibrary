from typing import Dict

from amundsen_common.models.user import UserSchema, User
from flask import current_app as app
from marshmallow import ValidationError


def load_user(user_data: Dict) -> User:
    try:
        schema = UserSchema()
        data, errors = schema.load(user_data)
        # Add in the profile_url from the optional 'GET_PROFILE_URL' configuration method
        # This methods currently exists for the case where the 'profile_url' is not included
        # in the user metadata.
        if not data['profile_url'] and app.config['GET_PROFILE_URL']:
            data['profile_url'] = app.config['GET_PROFILE_URL'](data['user_id'])
        return data
    except ValidationError as err:
        return err.messages


def dump_user(user: User) -> Dict:
    schema = UserSchema()
    try:
        data, errors = schema.dump(user)
        return data
    except ValidationError as err:
        return err.messages
