import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'database/app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    STRIPE_SECRET_KEY='sk_test_51KKRQFCRWNkVadnHRvI9eGONfxDccbSoB6fb4h0eqnOln10EsWDWV7eUNZch1c5dvelV5ymsZHR8XxCUkK8dXPSD00xYZGXO1J'
    STRIPE_WEBHOOK_SECRET = 'whsec_raFX9lgorz2eb4ni08qLNWbgZim5NM18'
    SESSION_PERMANENT = False
    SESSION_TYPE = "filesystem"