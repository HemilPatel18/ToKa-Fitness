import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv(Path(__file__).resolve().parent / ".env")

mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    raise RuntimeError("MONGO_URI is not configured")

client = MongoClient(
    mongo_uri,
    serverSelectionTimeoutMS=int(os.getenv("MONGO_SERVER_SELECTION_TIMEOUT_MS", "5000")),
)

db = client[os.getenv("MONGO_DB_NAME", "toka_fitness")]

users = db["users"]
chats = db["chats"]

users.create_index("email", unique=True)
