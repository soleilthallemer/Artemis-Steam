from flask import Blueprint, request, jsonify
from app import db
from app.models import Order, OrderItem, MenuItem, User, Review
import traceback
from datetime import datetime
import json
from sqlalchemy import func
from datetime import datetime, timedelta
from app.models import ContactUs

main = Blueprint('main', __name__)

@main.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the API!"})

@main.route('/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    return jsonify([{
        "order_id": order.order_id,
        "total_amount": order.total_amount,
        "order_date": order.order_date.strftime('%Y-%m-%d %H:%M:%S'),
        "status": order.status,
        "claimed_by": order.claimed_by,
        "items": [{
            "item_id": item.item_id,
            "name": item.menu_item.name,
            "quantity": item.quantity,
            "price": float(item.price),
            "milk_option": item.milk_option,
            "syrup": item.syrup,
            "customizations": item.customizations
        } for item in order.order_items]
    } for order in orders]), 200

@main.route('/orders', methods=['POST'])
def create_order():
    data = request.json
    print("[DEBUG] Create order payload:", data)

    user_id = data.get('user_id')
    total_amount = data.get('total_amount', 0)
    items = data.get('items', [])

    if not user_id or total_amount < 0:
        return jsonify({"error": "Invalid order. User ID and total amount > 0 are required."}), 400

    order = Order(
        user_id=user_id,
        total_amount=total_amount
    )
    db.session.add(order)
    db.session.flush()  # ensures order.order_id is available

    for item_data in items:
        item_id = item_data.get('item_id')
        quantity = item_data.get('quantity')
        price = item_data.get('price')

        if item_id is None or quantity is None or price is None:
            return jsonify({"error": "Each item must include item_id, quantity, and price."}), 400

        menu_item = MenuItem.query.get(item_id)
        if not menu_item:
            return jsonify({"error": f"Menu item {item_id} not found"}), 404

        order_item = OrderItem(
            order_id=order.order_id,
            item_id=item_id,
            quantity=quantity,
            price=price,
            milk_option=item_data.get('milk_option'),
            syrup=item_data.get('syrup'),
            customizations=item_data.get('customizations')
        )
        db.session.add(order_item)

    db.session.commit()

    return jsonify({
        'message': 'Order created',
        'id': order.order_id,
        'status': order.status
    })


@main.route('/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    try:
        data = request.json
        print(f"[DEBUG] Update payload for order {order_id}:", data)

        order = Order.query.get(order_id)
        if not order:
            return jsonify({"error": "Order not found"}), 404

        order.user_id = data.get('user_id', order.user_id)
        order.total_amount = data.get('total_amount', order.total_amount)
        order.order_date = data.get('order_date', order.order_date)
        order.status = data.get('status', order.status)

        OrderItem.query.filter_by(order_id=order.order_id).delete()

        items = data.get('items', [])
        if not items:
            return jsonify({"error": "No items provided"}), 400

        for item_data in items:
            print("[DEBUG] Processing item:", item_data)
            item_id = item_data.get('item_id')
            quantity = item_data.get('quantity')
            price = item_data.get('price')

            if item_id is None or quantity is None or price is None:
                return jsonify({"error": "Invalid item data: item_id, quantity, and price are required"}), 400

            menu_item = MenuItem.query.get(item_id)
            if not menu_item:
                return jsonify({"error": f"Menu item {item_id} not found"}), 404

            order_item = OrderItem(
                order_id=order.order_id,
                item_id=item_id,
                quantity=quantity,
                price=price,
                milk_option=item_data.get('milk_option'),
                syrup=item_data.get('syrup'),
                customizations=item_data.get('customizations')
            )
            db.session.add(order_item)

        db.session.commit()

        updated_items = OrderItem.query.filter_by(order_id=order.order_id).all()
        return jsonify({
            "message": "Order updated successfully",
            "order_id": order.order_id,
            "order_items": [{
                "item_id": item.item_id,
                "quantity": item.quantity,
                "price": float(item.price)
            } for item in updated_items],
            "status": order.status
        }), 200

    except Exception as e:
        print(f"[ERROR] Failed to update order {order_id}: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500

@main.route('/orders/<int:order_id>/claimed_by', methods=['GET'])
def get_claimed_by(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    if not order.claimed_by:
        return jsonify({"message": "Order has not been claimed yet"}), 200

    user = User.query.get(order.claimed_by)
    if not user:
        return jsonify({"message": "Claimer not found"}), 404

    return jsonify({
        "claimed_by": user.user_id,
        "claimer_name": f"{user.first_name} {user.last_name}"
    }), 200

@main.route('/orders/<int:order_id>/claim', methods=['POST'])
def claim_order(order_id):
    data = request.json
    user_id = data.get("user_id")
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    order.claimed_by = user_id
    db.session.commit()
    return jsonify({
        "message": "Order successfully claimed",
        "order_id": order.order_id,
        "claimed_by": order.claimed_by,
        "status": order.status
    }), 200

@main.route('/menu', methods=['GET'])
def get_menu_items():
    menu_items = MenuItem.query.all()
    return jsonify([{
        'item_id': m.item_id,
        'name': m.name,
        'description': m.description,
        'category': m.category,
        'price': m.price,
        'size_options': m.size_options,
        'ingredients': m.ingredients,
        'image_url': m.image_url,
        'availability_status': m.availability_status,
        'calories': m.calories,
        'preparation_time': m.preparation_time,
        'quantity': m.quantity,  # ✅ NEW FIELD
        'created_at': m.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'updated_at': m.updated_at.strftime('%Y-%m-%d %H:%M:%S') if m.updated_at else None
    } for m in menu_items])


@main.route('/menu', methods=['POST'])
def create_menu_item():
    try:
        data = request.get_json()
        print("📦 Incoming data:", data)

        # Validate required fields
        required = ['name', 'price', 'calories', 'preparation_time']
        missing = [field for field in required if field not in data]
        if missing:
            return jsonify({'error': f"Missing required fields: {', '.join(missing)}"}), 400

        menu_item = MenuItem(
            name=data['name'],
            description=data.get('description', ""),
            category=data.get('category', "Uncategorized"),
            price=data['price'],
            size_options=json.dumps(data.get('size_options', [])),
            ingredients=json.dumps(data.get('ingredients', [])),
            image_url=data.get('image_url', ""),
            availability_status=data.get('availability_status', True),
            calories=data['calories'],
            preparation_time=data['preparation_time'],
            quantity=data.get('quantity', 0)
        )
        db.session.add(menu_item)
        db.session.commit()

        return jsonify({'message': 'Menu item created', 'item_id': menu_item.item_id})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@main.route('/orders/<int:order_id>/items', methods=['GET'])
def get_order_items(order_id):
    order_items = OrderItem.query.filter_by(order_id=order_id).all()
    if not order_items:
        return jsonify({"message": "No items found for this order"}), 404

    return jsonify([{
        "id": item.id,
        "order_id": item.order_id,
        "item_id": item.item_id,
        "quantity": item.quantity,
        "price": float(item.price),
        "milk_option": item.milk_option,    
        "syrup": item.syrup,            
        "customizations": item.customizations
    } for item in order_items])

@main.route('/order_items', methods=['POST'])
def add_order_item():
    data = request.json
    if not all(key in data for key in ["order_id", "item_id", "quantity", "price"]):
        return jsonify({"error": "Missing required fields"}), 400

    order = Order.query.get(data["order_id"])
    if not order:
        return jsonify({"error": "Order not found"}), 404

    menu_item = MenuItem.query.get(data["item_id"])
    if not menu_item:
        return jsonify({"error": "Menu item not found"}), 404

    order_item = OrderItem(
        order_id=data["order_id"],
        item_id=data["item_id"],
        quantity=data["quantity"],
        price=data["price"],
        milk_option=data.get('milk_option'),
        syrup=data.get('syrup'),
        customizations=data.get('customizations')
    )

    db.session.add(order_item)
    db.session.commit()

    return jsonify({"message": "Order item added", "id": order_item.id}), 201

@main.route("/users/<string:email>", methods=["GET"])
def get_user_by_email(email):
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "user_id": user.user_id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "phone_number": user.phone_number,
        "role": user.role,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
        "hire_date": user.hire_date
    }), 200

@main.route('/orders/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.role in ['employee', 'administrator']:
        orders = Order.query.filter_by(claimed_by=user_id).all()
    else:
        orders = Order.query.filter_by(user_id=user_id).all()

    if not orders:
        return jsonify({"message": "No orders found for this user"}), 404

    return jsonify([{
        "order_id": order.order_id,
        "total_amount": order.total_amount,
        "order_date": order.order_date.strftime('%Y-%m-%d %H:%M:%S'),
        "status": order.status,
        "claimed_by": order.claimed_by,
        "items": [{
            "item_id": item.item_id,
            "name": item.menu_item.name,
            "quantity": item.quantity,
            "price": float(item.price)
        } for item in order.order_items]
    } for order in orders]), 200

# Route to unclaim an order by employee
@main.route('/orders/<int:order_id>/remove-claim', methods=['PUT'])
def remove_order_claim(order_id):
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({"error": "Order not found"}), 404

        order.claimed_by = None
        db.session.commit()

        return jsonify({
            "message": "Order claim removed successfully",
            "order_id": order.order_id
        }), 200

    except Exception as e:
        print(f"[ERROR] Failed to unclaim order {order_id}: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
    
# Route to PATCH order status
@main.route('/orders/<int:order_id>/status', methods=['PATCH'])
def update_order_status(order_id):
    try:
        data = request.json
        new_status = data.get("status")
        if not new_status:
            return jsonify({"error": "Missing status"}), 400

        order = Order.query.get(order_id)
        if not order:
            return jsonify({"error": "Order not found"}), 404

        order.status = new_status
        db.session.commit()

        return jsonify({
            "message": "Order status updated",
            "order_id": order.order_id,
            "status": order.status
        }), 200

    except Exception as e:
        print(f"[ERROR] Failed to update order status: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
    

    # Get all reviews
@main.route('/reviews', methods=['GET'])
def get_reviews():
    reviews = Review.query.order_by(Review.created_at.desc()).all()
    return jsonify([
        {
            "review_id": r.review_id,
            "name": r.name,
            "rating": r.rating,
            "comment": r.comment,
            "created_at": r.created_at.strftime('%Y-%m-%d %H:%M:%S')
        } for r in reviews
    ]), 200
#extra comment
# Create a new review
@main.route('/reviews', methods=['POST'])
def create_review():
    try:
        data = request.get_json()
        required = ['name', 'rating', 'comment']
        if not all(data.get(f) for f in required):
            return jsonify({"error": "All fields are required."}), 400

        review = Review(
            name=data['name'],
            rating=data['rating'],
            comment=data['comment']
        )
        db.session.add(review)
        db.session.commit()

        return jsonify({"message": "Review submitted successfully"}), 201

    except Exception as e:
        print(f"[ERROR] Failed to submit review: {e}")
        return jsonify({"error": "Internal server error"}), 500
      
# Dashboard summary endpoint
@main.route('/dashboard/summary', methods=['GET'])
def get_dashboard_summary():
    try:
        # Totals
        total_users = User.query.count()
        total_products = MenuItem.query.count()
        total_orders = Order.query.count()
        total_revenue = db.session.query(db.func.sum(Order.total_amount)).scalar() or 0

        # 3 most recently registered users
        recent_users = User.query.order_by(User.created_at.desc()).limit(3).all()
        recent_users_data = [{
            "id": u.user_id,
            "name": f"{u.first_name} {u.last_name}",
            "email": u.email,
            "registered": u.created_at.strftime('%Y-%m-%d %H:%M:%S')
        } for u in recent_users]

        # 2 most recently active employees (using updated_at)
        recent_employees = User.query.filter_by(role='employee') \
            .order_by(User.updated_at.desc()) \
            .limit(2).all()
        recent_employees_data = [{
            "id": e.user_id,
            "name": f"{e.first_name} {e.last_name}",
            "lastActive": e.updated_at.strftime('%Y-%m-%d %H:%M:%S') if e.updated_at else "N/A"
        } for e in recent_employees]

        # 5 most recent orders
        recent_orders = Order.query.order_by(Order.order_date.desc()).limit(5).all()
        recent_orders_data = [{
            "id": o.order_id,
            "orderNumber": o.order_id,
            "status": o.status,
            "claimedBy": o.claimed_by  # optionally join User for name
        } for o in recent_orders]

        return jsonify({
            "totalUsers": total_users,
            "totalProducts": total_products,
            "totalOrders": total_orders,
            "revenue": round(total_revenue, 2),
            "recentUsers": recent_users_data,
            "recentEmployees": recent_employees_data,
            "recentOrders": recent_orders_data
        }), 200

    except Exception as e:
        print("[ERROR] Failed to load dashboard summary:", e)
        traceback.print_exc()  # <- this is critical for debugging
        return jsonify({"error": "Failed to load dashboard summary"}), 500
    
# endpoint to update an existing product
@main.route('/menu/<int:item_id>', methods=['PUT'])
def update_menu_item(item_id):
    try:
        data = request.json
        item = MenuItem.query.get(item_id)
        if not item:
            return jsonify({"error": "Menu item not found"}), 404

        item.name = data.get('name', item.name)
        item.description = data.get('description', item.description)
        item.category = data.get('category', item.category)
        item.price = data.get('price', item.price)
        item.size_options = data.get('size_options', item.size_options)
        item.ingredients = data.get('ingredients', item.ingredients)
        item.image_url = data.get('image_url', item.image_url)
        item.availability_status = data.get('availability_status', item.availability_status)
        item.quantity = data.get('quantity', item.quantity)
        item.calories = data.get('calories', item.calories)
        item.preparation_time = data.get('preparation_time', item.preparation_time)

        db.session.commit()

        return jsonify({"message": "Menu item updated successfully"}), 200

    except Exception as e:
        print(f"[ERROR] Failed to update menu item {item_id}: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500

# endpoint to delete an existing product
@main.route('/menu/<int:item_id>', methods=['DELETE'])
def delete_menu_item(item_id):
    try:
        item = MenuItem.query.get(item_id)
        if not item:
            return jsonify({"error": "Menu item not found"}), 404

        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Menu item deleted successfully"}), 200

    except Exception as e:
        print(f"[ERROR] Failed to delete menu item {item_id}: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
    
# endpoint to fetch 3 recent users
@main.route('/users/recent', methods=['GET'])
def get_recent_users():
    users = User.query.order_by(User.created_at.desc()).limit(3).all()
    return jsonify([
        {
            "id": u.user_id,
            "name": f"{u.first_name} {u.last_name}",
            "email": u.email,
            "registered": u.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        for u in users
    ])

# endpoint to fetch last 2 active employees
@main.route('/employees/active', methods=['GET'])
def get_recent_employees():
    employees = User.query.filter_by(role="employee").order_by(User.updated_at.desc()).limit(2).all()
    return jsonify([
        {
            "id": e.user_id,
            "name": f"{e.first_name} {e.last_name}",
            "lastActive": e.updated_at.strftime('%Y-%m-%d %H:%M:%S') if e.updated_at else "N/A"
        }
        for e in employees
    ])

# endpoint to fetch 5 recent uncompleted orders
@main.route('/orders/recent', methods=['GET'])
def get_recent_uncompleted_orders():
    try:
        orders = (
            Order.query
            .filter(Order.status != "Completed")
            .order_by(Order.order_date.desc())
            .limit(5)
            .all()
        )

        return jsonify([
            {
                "id": o.order_id,
                "orderNumber": o.order_id,
                "status": o.status,
                "claimedBy": f"{o.claimer_user.first_name} {o.claimer_user.last_name}" if o.claimer_user else None
            }
            for o in orders
        ]), 200

    except Exception as e:
        print(f"[ERROR] Failed to fetch recent uncompleted orders: {e}")
        return jsonify({"error": "Failed to retrieve recent orders"}), 500
    
# endpoint to get all users
@main.route('/users', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        return jsonify([
            {
                "user_id": user.user_id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                 "phone_number": user.phone_number,
                "role": user.role,
                "created_at": user.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                "updated_at": user.updated_at.strftime('%Y-%m-%d %H:%M:%S') if user.updated_at else None
            }
            for user in users
        ]), 200
    except Exception as e:
        print("[ERROR] Failed to fetch users:", e)
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch users"}), 500

#endpoint to delete a user
@main.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": f"User {user_id} deleted successfully"}), 200
    except Exception as e:
        print(f"[ERROR] Failed to delete user {user_id}:", e)
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
    
# endpoint for an admin to manually create a new user
@main.route('/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()

        # 🔄 Removed 'phone_number' from required fields
        required_fields = ['first_name', 'last_name', 'email', 'role', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400

        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"error": "A user with this email already exists."}), 409

        user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone_number=data.get('phone_number'),  # ✅ Optional
            role=data['role']
        )
        user.set_password(data['password'])

        db.session.add(user)
        db.session.commit()

        return jsonify({
            "message": "User created successfully",
            "user_id": user.user_id
        }), 201

    except Exception as e:
        print(f"[ERROR] Failed to create user: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500


# endpoint to edit an existing users profile
@main.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.json
        user = User.query.get(user_id)


        if not user:
            return jsonify({"error": "User not found"}), 404

        # Update only the provided fields
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.email = data.get("email", user.email)
        user.phone_number = data.get("phone_number", user.phone_number)
        user.role = data.get("role", user.role)
        user.hire_date = data.get("hire_date", user.hire_date)

        # Optional: if password is provided, hash it
        if data.get("password"):
            user.set_password(data["password"])

        user.updated_at = datetime.utcnow()
        db.session.commit()

        return jsonify({"message": "User updated successfully"}), 200

    except Exception as e:
        print(f"[ERROR] Failed to update user {user_id}: {e}")
        return jsonify({"error": "Internal server error"}), 500

# analytics route
@main.route('/admin/analytics', methods=['GET'])
def admin_analytics():
    try:
        # --- Parse query param for time range ---
        range_param = request.args.get('range', 'all')  # options: '1d', '7d', '30d', 'all'
        now = datetime.utcnow()

        if range_param.endswith('d'):
            days = int(range_param[:-1])
            since = now - timedelta(days=days)
            order_filter = Order.order_date >= since
        else:
            order_filter = True  # all-time

        # --- Get orders in range ---
        orders = db.session.query(Order).filter(order_filter).all()
        order_ids = [o.order_id for o in orders]

        # --- 1. Top 3 most active users (by order count) ---
        active_users = (
            db.session.query(User.user_id, User.first_name, User.last_name, func.count(Order.order_id).label("orders"))
            .join(Order, Order.user_id == User.user_id)
            .filter(order_filter)
            .group_by(User.user_id)
            .order_by(func.count(Order.order_id).desc())
            .limit(3)
            .all()
        )

        # --- 2. Top 3 most productive employees (claimed orders) ---
        top_employees = (
            db.session.query(User.user_id, User.first_name, User.last_name, func.count(Order.order_id).label("claims"))
            .join(Order, Order.claimed_by == User.user_id)
            .filter(order_filter, User.role == 'employee')
            .group_by(User.user_id)
            .order_by(func.count(Order.order_id).desc())
            .limit(3)
            .all()
        )

        # --- 3. Top 5 most popular items (from OrderItem) ---
        popular_items = (
            db.session.query(
                MenuItem.item_id,
                MenuItem.name,
                func.sum(OrderItem.quantity).label("total_ordered"),
                MenuItem.availability_status
            )
            .join(MenuItem, MenuItem.item_id == OrderItem.item_id)
            .filter(OrderItem.order_id.in_(order_ids))
            .group_by(MenuItem.item_id)
            .order_by(func.sum(OrderItem.quantity).desc())
            .limit(5)
            .all()
        )

        return jsonify({
            "range": range_param,
            "top_active_users": [
                {"user_id": u.user_id, "name": f"{u.first_name} {u.last_name}", "orders": u.orders}
                for u in active_users
            ],
            "top_employees": [
                {"user_id": e.user_id, "name": f"{e.first_name} {e.last_name}", "claims": e.claims}
                for e in top_employees
            ],
            "popular_items": [
                {
                    "item_id": item.item_id,
                    "name": item.name,
                    "total_ordered": int(item.total_ordered),
                    "currently_available": item.availability_status
                } for item in popular_items
            ]
        })

    except Exception as e:
        print(f"[ERROR] Failed to generate analytics: {e}")
        return jsonify({"error": "Failed to fetch analytics"}), 500


@main.route('/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()
        required = ['name', 'email', 'subject', 'message']
        missing = [field for field in required if not data.get(field)]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

        contact = ContactUs(
            name=data['name'],
            email=data['email'],
            subject=data['subject'],
            message=data['message']
        )
        db.session.add(contact)
        db.session.commit()

        return jsonify({"message": "Contact message submitted successfully"}), 201

    except Exception as e:
        print(f"[ERROR] Failed to submit contact message: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500


@main.route('/admin/contact-submissions', methods=['GET'])
def get_contact_submissions():
    try:
        contacts = ContactUs.query.order_by(ContactUs.created_at.desc()).all()
        return jsonify([{
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "subject": c.subject,
            "message": c.message,
            "created_at": c.created_at.strftime('%Y-%m-%d %H:%M:%S')
        } for c in contacts]), 200

    except Exception as e:
        print(f"[ERROR] Failed to retrieve contact messages: {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500