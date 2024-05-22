from flask_redis import FlaskRedis
from flask import Flask
# app = Flask(__name__)
import redis

# redis_client = FlaskRedis(app)
# redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)
# if b'65ebaa02968dd0cc263cda6b' in redis_client.hkeys('users'):
#     print(f"User ID present in users hash.")
# redis_connection = 'redis://localhost:6379/0'
redis_connection = 'redis://default:PghQh8AjOXYkUIMBrCJare4INQ89j5xR@redis-11786.c326.us-east-1-3.ec2.redns.redis-cloud.com:11786/0'
pool = redis.ConnectionPool.from_url(redis_connection)
redis_client = redis.Redis(connection_pool=pool)

# redis_client = redis.Redis(
#   host='redis-11786.c326.us-east-1-3.ec2.redns.redis-cloud.com',
#   port=11786,
#   password='PghQh8AjOXYkUIMBrCJare4INQ89j5xR')
# print(redis_client)