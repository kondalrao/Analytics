from flask import Flask
from flask.ext.socketio import SocketIO

socketio = SocketIO()


def create_app(debug=False):
    """Create an application."""
    app = Flask(__name__)
    app.debug = debug
    app.config['SECRET_KEY'] = 'secret!!'

    from .analytics import analytics as analytics_blueprint
    app.register_blueprint(analytics_blueprint)

    socketio.init_app(app)
    return app
