from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
# MongoDB connection
password = "518Oloko."
uri_production = f"mongodb+srv://clinicalx:{password}@clinicalx.aqtbwah.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri_production, server_api=ServerApi('1'))
try:
    client.admin.command('ping')
    print("You successfully connected to Clinicalx MongoDB!")
except Exception as e:  
    print(f"error in connection:{e}")

db_admin = client.admin
db = client.clinicalx
db_org_users = client.org_users
