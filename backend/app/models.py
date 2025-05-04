from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'  # Avoid reserved keyword 'user'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    hire_date = db.Column(db.Date, nullable=True)

    orders = db.relationship('Order', foreign_keys='Order.user_id', backref='customer', lazy=True)
    claimed_orders = db.relationship('Order', foreign_keys='Order.claimed_by', backref='claimer_user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.first_name} {self.last_name} ({self.role})>'


class Order(db.Model):
    __tablename__ = 'orders'  # Avoid reserved keyword 'order'

    order_id = db.Column(db.Integer, primary_key=True)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    total_amount = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id', name='fk_order_user_id'), nullable=False)
    claimed_by = db.Column(db.Integer, db.ForeignKey('users.user_id', name='fk_order_claimed_by'), nullable=True)
    status = db.Column(db.String(50), default="submitted")

    order_items = db.relationship('OrderItem', backref='order', lazy=True)

    def __repr__(self):
        return f'<Order {self.order_id}, claimed_by: {self.claimed_by}>'


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('menu_items.item_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    milk_option = db.Column(db.String(50), nullable=True)
    syrup = db.Column(db.String(50), nullable=True)
    customizations = db.Column(db.Text, nullable=True)


    menu_item = db.relationship("MenuItem", backref="order_items", lazy="joined")

    def __repr__(self):
        return f'<OrderItem {self.id}>'


class MenuItem(db.Model):
    __tablename__ = 'menu_items'

    item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, default="")
    category = db.Column(db.String(255), default="Uncategorized")
    price = db.Column(db.Float, nullable=False)
    size_options = db.Column(db.Text, default="")
    ingredients = db.Column(db.Text, default="")
    image_url = db.Column(db.String(255), default="")
    availability_status = db.Column(db.Boolean, default=True)
    quantity = db.Column(db.Integer, default=0)
    calories = db.Column(db.Integer, default=0)
    preparation_time = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def __repr__(self):
        return f'<MenuItem {self.name}>'
    
class Review(db.Model):
    __tablename__ = 'reviews'

    review_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class ContactUs(db.Model):
    __tablename__ = 'contact_us'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    subject = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<ContactUs {self.email} | {self.subject}>'
