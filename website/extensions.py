
from flask_mail import Mail
from flask_socketio import SocketIO
from .redis_config import redis_client

mail = Mail()
# socketio = SocketIO()
redis_connection = 'redis://default:PghQh8AjOXYkUIMBrCJare4INQ89j5xR@redis-11786.c326.us-east-1-3.ec2.redns.redis-cloud.com:11786/0'
socketio = SocketIO(message_queue=redis_connection)
print(socketio)

