
from flask_mail import Mail
from flask_socketio import SocketIO
from .redis_config import redis_connection


mail = Mail()
# socketio = SocketIO()
socketio = SocketIO(message_queue=redis_connection)
print(socketio)

