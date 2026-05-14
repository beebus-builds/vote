from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os

BASE_DIR = Path(__file__).resolve().parents[3]
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set. Create a .env file with DATABASE_URL and other required variables.")

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is not set. Create a .env file with a strong SECRET_KEY.")

ALGORITHM = os.getenv("ALGORITHM") or "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
ACCESS_TOKEN_EXPIRE_DELTA = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

CLOUDINARY_URL = os.getenv("CLOUDINARY_URL")
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")
CLOUDINARY_ENABLED = bool(
    CLOUDINARY_URL
    or (CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET)
)
if not CLOUDINARY_ENABLED:
    raise RuntimeError(
        "Cloudinary must be configured for uploads. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    )

UPLOAD_DIR = BASE_DIR / "uploads"
ID_CARD_DIR = UPLOAD_DIR / "id_cards"
ID_CARD_DIR.mkdir(parents=True, exist_ok=True)
CANDIDATE_PHOTO_DIR = UPLOAD_DIR / "candidates_photo"
CANDIDATE_PHOTO_DIR.mkdir(parents=True, exist_ok=True)

_ALLOWED_PHOTO_TYPES = {"image/jpeg", "image/png", "image/jpg"}
_MAX_PHOTO_BYTES     = 5 * 1024 * 1024   # 5 MB

_EXT_MAP = {
    "image/jpeg": ".jpg",
    "image/jpg":  ".jpg",
    "image/png":  ".png",
    "application/pdf": ".pdf",
}
