#!/bin/env python
from gevent import monkey
monkey.patch_all()
from apps import create_app, socketio

app = create_app(debug=True)

if __name__ == '__main__':
    socketio.run(app=app, host="0.0.0.0", port=None)
