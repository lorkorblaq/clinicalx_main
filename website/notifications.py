from flask import session
from .db_clinicalx import db
from .extensions import socketio
from flask_socketio import send, emit, join_room, leave_room
from flask_mail import Message
# mail = mail
ITEMS_COLLECTION = db['items']
items = ITEMS_COLLECTION.find()


@socketio.on('notifications')
def stock_alerts(data):
    emit('stock_alerts', data, broadcast=True)
    print('Client notification connected')
