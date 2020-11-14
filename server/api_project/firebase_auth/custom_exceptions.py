from rest_framework import status
from rest_framework.exceptions import APIException


class NoAuthenticationToken(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = 'No auth token provided'
    default_code = 'no_auth_token'


class Unauthorized(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = 'Token not valid'
    default_code = 'token_not_valid'
