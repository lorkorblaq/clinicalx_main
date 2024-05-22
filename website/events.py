# import eventlet
# eventlet.monkey_patch(socket=True)
from .extensions import socketio
from flask_socketio import send, emit, join_room, leave_room, SocketIO
from flask import request, session
from .redis_config import redis_client
from datetime import datetime
import requests
from flask import Flask
import redis
from . import create_app
print('socketio:')
# socketio = socketio()
# app = create_app()
# app.app_context().push()
# eventlet.monkey_patch(socket=True)
# socketio = SocketIO(message_queue='redis://localhost:6379/0')
# socketio.init_app(app)
print(socketio)

# print(redis_client.hgetall('users'))
API_BASE = 'http://127.0.0.1:3000/api/'
print('API_BASE:', API_BASE)
def notify_clients(data):
    socketio.emit('dataUpdated', data)

    
def get_rooms_for_user(user_id):
    user_id = session.get('id') 

    USERS_POTS_URL = API_BASE + "pots/get/" + user_id + '/'
    response = requests.get(USERS_POTS_URL)
    rooms = []
    if response.status_code == 200:
        pots_data = response.json().get('pots', []) 
        for pot in pots_data:
            room_info = {'room_id': str(pot['_id']), 'name': pot['name']}
            rooms.append(room_info)   
    else:
        print("Error fetching user's pots:", response.text)
    
    return rooms

print(redis_client.hkeys('users'))
@socketio.on('connect')
def handle_connect():
    print('Client events connected')
    user_id = session.get('id') 
    print(user_id)
    session_id = request.sid  # Get the session ID from the request
    # Check if user_id is already present in the 'users' hash
    if user_id in redis_client.hkeys('users'):
        print(f"User ID '{user_id}' already present in users hash.")
    else:
        # If user_id is not present, add it to the 'users' hash
        redis_client.hset('users', user_id, session_id)
        print(f"Added User ID '{user_id}' to users hash.")
    
    # Store session ID and user ID in the 'sessions' hash
    redis_client.hset('sessions', session_id, user_id)
    print('Users:', redis_client.hgetall('users'))


    rooms = get_rooms_for_user(user_id)
    for room in rooms:
        # Join the client to each room retrieved from the database
        redis_client.hset('rooms', room['room_id'], room['name'])
        join_room(room['room_id'])
        print(f"Client connected and joined room '{room['room_id']},{room['name']}'")

    # watch_inventory_changes()
    # print(watch_inventory_changes)

@socketio.on('private_message')
def handle_private_message(data):
    payload = data['payload']
    print(payload)
    recipient_id = data['recipient_id']
    sender_session_id = request.sid
    payload = {'senderName':session.get('name'),
               'senderID':session.get('id'),
               'message':payload,
               'timestamp':datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
    # Get the recipient's session ID from the 'users' hash using their user ID
    recipient_session_id = redis_client.hget('users', recipient_id)
    print(f"Recipient ID: {recipient_id}, Recipient Session ID: {recipient_session_id}")

    if recipient_session_id:
        # Process when the recipient ID exists in the 'users' hash 
        emit('priv_chat', payload, room=[sender_session_id, recipient_session_id.decode('utf-8')])
    else:
        # Handle the case when the recipient ID does not exist in the 'users' hash
        print(f"Recipient ID '{recipient_id}' not found in users hash")

@socketio.on('public_message')
def handle_public_message(data):
    payload = data['payload']
    print(payload)
    room_id = data['recipient_id']
    # sender_session_id = request.sid
    payload = {'senderName':session.get('name'), 
               'senderID':session.get('id'),
               'message':payload, 
               'timestamp':datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
    # Get the recipient's session ID from the 'users' hash using their user ID
    # recipient_session_id = redis_client.hget('users', recipient_id)
    # print(f"Recipient ID: {recipient_id}, Recipient Session ID: {recipient_session_id}")

    if room_id:
        # Process when the recipient ID exists in the 'users' hash 
        emit('public_chat', payload, room=room_id)
    else:
        # Handle the case when the recipient ID does not exist in the 'users' hash
        print(f"Room ID '{room_id}' not found")