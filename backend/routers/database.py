import motor.motor_asyncio
from bson.codec_options import CodecOptions
import os
import asyncio
import pytz

MONGO_URL = "mongodb://localhost:27017"
MONGO_DB = "BUHO"
MONGO_COLLECTION = "windowsServer"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
timezone = pytz.timezone("Europe/Madrid")
db = client.BUHO.with_options(
    codec_options=CodecOptions(tz_aware=True, tzinfo=timezone)
)
