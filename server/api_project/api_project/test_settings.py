from .settings import *  # NOQA

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
    }
}

# REST_FRAMEWORK = {
#     # Use Django's standard `django.contrib.auth` permissions,
#     # or allow read-only access for unauthenticated users.
#     'DEFAULT_PERMISSION_CLASSES': [],
#     'TEST_REQUEST_DEFAULT_FORMAT': 'json',
#     'DEFAULT_AUTHENTICATION_CLASSES': (),
# }
