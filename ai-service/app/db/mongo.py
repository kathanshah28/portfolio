# app/db/mongo.py
from pymongo import MongoClient
from app.config import settings

class MongoDBClient:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDBClient, cls).__new__(cls)
            cls._instance.client = MongoClient(settings.MONGODB_URI)
            cls._instance.db = cls._instance.client[settings.DB_NAME]
        return cls._instance

    @property
    def database(self):
        return self.db

mongodb = MongoDBClient()