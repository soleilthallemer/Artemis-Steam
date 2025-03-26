from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate  # ✅ Import Flask-Migrate
from app.config import Config
from app.models import db  # ✅ Ensure SQLAlchemy is imported
from app.routes import main
from app.auth_routes import auth, init_jwt

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    migrate = Migrate(app, db)  # ✅ Enable Flask-Migrate
    init_jwt(app)  # ✅ Initialize JWT

    app.register_blueprint(main)  # ✅ Register API routes
    app.register_blueprint(auth, url_prefix="/auth")  # ✅ Register auth routes

    CORS(app)  # ✅ Enable CORS

    return app
