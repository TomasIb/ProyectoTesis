from engineio.async_drivers import gevent
from config import Config
from flask_cors import CORS
from flask import Flask
from .events import socketio
from .routes import app as application

def create_app():
    app = Flask(__name__) 
    CORS(app)
    app.config.from_object(Config) 
    socketio.init_app(app)    
    app.register_blueprint(application)
    return app  


