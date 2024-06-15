import motor.motor_asyncio
from bson.codec_options import CodecOptions
import pytz

MONGO_URL = "mongodb://mongodb:27017"
MONGO_DB = "BUHO"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)  # Conexión a la base de datos
timezone = pytz.timezone("Europe/Madrid")  # Zona horaria
db = client.BUHO.with_options(
    codec_options=CodecOptions(tz_aware=True, tzinfo=timezone)
)  # Base de datos
