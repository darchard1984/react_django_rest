from django.test import TestCase
from mock import Mock, patch
from uuid import uuid4
from ..custom_exceptions import NoAuthenticationToken, Unauthorized
from ..firebase_authentication import FirebaseAuthentication
from api.models import User


def _mock_firebase_admin_auth(decoded):
    auth = Mock()
    auth.verify_id_token = Mock(return_value=decoded)

    return auth


class TestFirebaseAuthentication(TestCase):
    def test_authenticate_without_auth_header(self):
        request = Mock()
        request.META = {}

        with self.assertRaises(NoAuthenticationToken):
            FirebaseAuthentication().authenticate(request)

    def test_authenticate_raises_unauthorized_when_token_invalid(self):
        request = Mock()
        request.META = {'HTTP_AUTHORIZATION': 'Bearer invalid-token'}

        with self.assertRaises(Unauthorized):
            FirebaseAuthentication().authenticate(request)

    @patch(
        'firebase_auth.firebase_authentication.auth',
        _mock_firebase_admin_auth({})
    )
    def test_authenticate_returns_none_when_no_uid_in_decode(self):
        request = Mock()

        self.assertEqual(FirebaseAuthentication().authenticate(request), None)

    @patch(
        'firebase_auth.firebase_authentication.auth',
        _mock_firebase_admin_auth({'uid': str(uuid4())})
    )
    def test_authenticate_returns_user(self):
        request = Mock()

        user = FirebaseAuthentication().authenticate(request)

        self.assertTrue(isinstance(user, User))
