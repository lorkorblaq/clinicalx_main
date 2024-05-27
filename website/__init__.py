import os
from datetime import timedelta
from flask import Flask
from flask_mail import Mail, Message
from flask_redis import FlaskRedis

# from website.events import socketio
from .extensions import socketio
from website.auth import auth
from website.settings import settings
from website.views import views
# from website.celery_config import make_celery

def create_app():
    app = Flask(__name__)
    # Configuration settings
    app.config['SECRET_KEY'] = 'LVUC5jSkp7jjR3O-'
    app.config['MAIL_SERVER'] = 'mail.labpal.com.ng'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USERNAME'] = 'labpal@labpal.com.ng'
    app.config['MAIL_PASSWORD'] = '518Oloko.'
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True
    app.config['MAIL_DEFAULT_SENDER'] = ('Clinicalx','labpal@labpal.com.ng')
    # app.config['SESSION_TYPE'] = 'redis'
    # app.config['SESSION_REDIS'] = 'redis://localhost:6379/0'
    app.config['SESSION_PERMANENT'] = True
    app.config['SESSION_USE_SIGNER'] = True
    app.config['SESSION_KEY_PREFIX'] = 'labpal'
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=2)
    # app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0/'
    # app.config['REDIS_URL'] = "redis://localhost:6379/0"
    # app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'

    # Initialize extensions
    
    socketio.init_app(app)
    mail = Mail(app)
    # celery = make_celery(app)

    # Register blueprints
    app.register_blueprint(views, url_prefix="")
    app.register_blueprint(settings, url_prefix="/settings")
    app.register_blueprint(auth, url_prefix="")
    return app