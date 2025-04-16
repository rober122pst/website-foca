# Database connection with MongoDB
from dotenv import load_dotenv
from pymongo import MongoClient
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client.foca_db

collection_name = db["todo_collection"]