from pymongo import MongoClient

client = MongoClient(
    "mongodb+srv://hemilp19_db_user:<HFXFzoSo6B9oHDZM>@toka.9qhuhkr.mongodb.net/",
    serverSelectionTimeoutMS=5000
)

db = client["toka_fitness"]

users = db["users"]
chats = db["chats"]

users.create_index("email", unique=True)
