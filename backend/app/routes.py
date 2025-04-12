from flask import Blueprint, request, jsonify
from app import db
from app.models import Order, OrderItem, MenuItem, User
import traceback

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
            "price": float(item.price)
        } for item in order.order_items]
    } for order in orders]), 200

@main.route('/orders', methods=['POST'])
def create_order():
    data = request.json
    print("[DEBUG] Create order payload:", data)

    user_id = data.get('user_id')
    total_amount = data.get('total_amount', 0)

    if not user_id or total_amount <= 0:
        return jsonify({"error": "Invalid order. User ID and total amount > 0 are required."}), 400

    order = Order(
        user_id=user_id,
        total_amount=total_amount
    )
    db.session.add(order)
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
                price=price
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
        'created_at': m.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'updated_at': m.updated_at.strftime('%Y-%m-%d %H:%M:%S') if m.updated_at else None
    } for m in menu_items])

@main.route('/menu', methods=['POST'])
def create_menu_item():
    data = request.json
    menu_item = MenuItem(
        name=data['name'],
        description=data.get('description'),
        category=data.get('category'),
        price=data['price'],
        size_options=data.get('size_options'),
        ingredients=data.get('ingredients'),
        image_url=data.get('image_url'),
        availability_status=data.get('availability_status', True),
        calories=data.get('calories'),
        preparation_time=data.get('preparation_time')
    )
    db.session.add(menu_item)
    db.session.commit()
    return jsonify({'message': 'Menu item created', 'item_id': menu_item.item_id})

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
        "price": float(item.price)
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
        price=data["price"]
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


