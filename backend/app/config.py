import os
from dotenv import load_dotenv
from urllib.parse import quote
from urllib.parse import quote_plus

# Determine the environment
ENVIRONMENT = os.getenv("FLASK_ENV", "production")
print(f"Running in {ENVIRONMENT} mode")  # Debugging info

# Load the appropriate .env file
dotenv_path = ".env.local" if ENVIRONMENT == "development" else "/root/ArtemisAndSteamDir/backend/.env"
if not load_dotenv(dotenv_path):
    print(f"⚠️  Warning: {dotenv_path} not found. Using default values.")

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwtsecretkey")

    # Load database credentials (For MySQL in Production)
    MYSQL_USER = os.getenv("MYSQL_USER", "default_user")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "default_password")
    MYSQL_DB = os.getenv("MYSQL_DB", "default_db")
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))

    # ✅ Ensure SQLite Database is in the Correct Location
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))  # Get backend folder
    SQLITE_DB_PATH = os.path.join(BASE_DIR, "instance", "test.db")  # Store SQLite inside `backend/instance/`

    # ✅ Convert Windows backslashes (\) to forward slashes (/)
    SQLITE_DB_PATH = SQLITE_DB_PATH.replace("\\", "/")

    # ✅ Use SQLite in Development, MySQL in Production
    if ENVIRONMENT == "development":
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{SQLITE_DB_PATH}"
    else:
        SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{MYSQL_USER}:{quote(MYSQL_PASSWORD)}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1")
