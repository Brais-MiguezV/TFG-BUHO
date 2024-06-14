import motor.motor_asyncio
from bson.codec_options import CodecOptions
import pytz

MONGO_URL = "mongodb://mongodb:27017"
MONGO_DB = "BUHO"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
timezone = pytz.timezone("Europe/Madrid")
db = client.BUHO.with_options(
    codec_options=CodecOptions(tz_aware=True, tzinfo=timezone)
)
