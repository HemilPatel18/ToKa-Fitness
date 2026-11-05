from pymongo import MongoClient

client = MongoClient(
    "mongodb://localhost:27017",
    serverSelectionTimeoutMS=5000
)

db = client["toka_fitness"]

users = db["users"]
chats = db["chats"]

users.create_index("email", unique=True)