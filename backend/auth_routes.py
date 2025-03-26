from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from app import db
from app.models import User
from datetime import datetime

auth = Blueprint('auth', __name__)  # ✅ Define auth Blueprint
jwt = JWTManager()

def init_jwt(app):
    """Attach JWT to Flask app"""
    jwt.init_app(app)

# ✅ Register Endpoint
@auth.route('/register', methods=['POST'])
def register():
    """Registers a new user."""
    data = request.json

    required_fields = ["first_name", "last_name", "email", "password"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    # Check if user exists
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "User already exists"}), 409

    # Create new user
    new_user = User(
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        phone_number=data.get("phone_number"),
        role=data.get("role", "user"),  # Default role is 'user'
        hire_date=data.get("hire_date", None),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# ✅ Login Endpoint
@auth.route('/login', methods=['POST'])
def login():
    """Logs in a user and returns a JWT."""
    data = request.json

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if user is None or not user.check_password(data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    # ✅ Convert `user.user_id` to a string when generating the JWT token
    access_token = create_access_token(identity=str(user.user_id))

    return jsonify({"access_token": access_token}), 200


# ✅ Protected Route Example
@auth.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    """Example protected route that requires authentication."""
    current_user_id = get_jwt_identity()
    return jsonify({"message": "Access granted", "user_id": current_user_id})

