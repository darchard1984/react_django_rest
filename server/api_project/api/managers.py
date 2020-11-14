from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    """
        Custom User model manager that uses firebase_uid as the unique
        identifier. Password is not required as this project uses
        anonymous firebase authentication
    """
    def create_user(self, firebase_uid, **kwargs):
        if not firebase_uid:
            raise ValueError(_('firebase_uid not provided'))

        user = self.model(firebase_uid=firebase_uid)
        user.save()

        return user

    def create_superuser(self, firebase_uid, **kwargs):
        'Creating super users is not required for this project'
        pass
