from flask import session
from flask.ext.socketio import emit, join_room, leave_room
from .. import socketio
from random import randint
from threading import Timer
import psutil


def sendRandomStats():
    per_cpu_percentages = psutil.cpu_percent(interval=1, percpu=True)
    
    socketio.emit('stats', {
        # 'bar_data': randint(0, 1000),
        'cpu1': per_cpu_percentages[0],
        'cpu2': per_cpu_percentages[1],
        'cpu3': per_cpu_percentages[2],
        'cpu4': per_cpu_percentages[3]
    })
    Timer(1.0, sendRandomStats).start()


@socketio.on('ready')
def left(message):
    print message
    sendRandomStats()


@socketio.on('disconnect')
def handle_disconnect():
    print "Disconnected: "
    
    
@socketio.on_error_default
def handle_error(e):
    print "Error: ", e
    

