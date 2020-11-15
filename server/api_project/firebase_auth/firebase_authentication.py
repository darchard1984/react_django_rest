from firebase_admin import auth

from api.models import User

from .custom_exceptions import NoAuthenticationToken, Unauthorized
from .firebase import firebase


class FirebaseAuthentication():
    def authenticate(self, request):
        authorization_header = request.META.get('HTTP_AUTHORIZATION')

        if not authorization_header:
            raise NoAuthenticationToken()

        id_token = authorization_header.split(' ').pop()
        try:
            # Verify the ID token and check if the token has been revoked by
            # passing check_revoked=True.
            decoded = auth.verify_id_token(id_token, check_revoked=True)
            firebase_uid = decoded['uid']
        except Exception:
            raise Unauthorized('Token is not valid')

        user, _ = User.objects.get_or_create(firebase_uid=firebase_uid)

        return (user, None)
