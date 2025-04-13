import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/menu.css";

const CatalogMenuPage = () => {
  const [tabState, setTabState] = useState("drinks");
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [menuItems, setMenuItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});
  const [popupInfo, setPopupInfo] = useState(null);
  const [editingSizeIndex, setEditingSizeIndex] = useState(null);
  const cartModalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch("http://157.245.80.36:5000/menu");
        const data = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error loading menu:", error);
      }
    };
    fetchMenuItems();
  }, []);

  const isDrinkItem = (item) => item.category?.toLowerCase() === "beverages";

  const selectSize = (id, size) => {
    setSelectedSizes((prev) => ({ ...prev, [id]: size }));
  };

  const handleQuantityChange = (id, value) => {
    const qty = Math.max(Number(value), 1);
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  const addToCart = (e, item) => {
    e.stopPropagation();
    const size = selectedSizes[item.item_id];
    if (isDrinkItem(item) && !size) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const quantity = quantities[item.item_id] || 1;
    const newItem = {
      id: item.item_id,
      name: item.name,
      size,
      quantity,
      price: item.price,
    };

    setCartItems((prev) => {
      const index = prev.findIndex(
        (i) => i.name === newItem.name && i.size === newItem.size
      );
      if (index >= 0) {
        const updated = [...prev];
        updated[index].quantity += quantity;
        return updated;
      }
      return [...prev, newItem];
    });

    const rect = e.target.getBoundingClientRect();
    setPopupInfo({ x: rect.left + window.scrollX, y: rect.top + window.scrollY, message: "Added to cart!" });
    setTimeout(() => setPopupInfo(null), 2000);
  };

  const showCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const handleEditSize = (i) => setEditingSizeIndex(i === editingSizeIndex ? null : i);
  const handleSizeChangeInCart = (i, newSize) => {
    const updated = [...cartItems];
    updated[i].size = newSize;
    setCartItems(updated);
    setEditingSizeIndex(null);
  };

  const handleIncrement = (i) => {
    const updated = [...cartItems];
    updated[i].quantity += 1;
    setCartItems(updated);
  };

  const handleDecrement = (i) => {
    const updated = [...cartItems];
    if (updated[i].quantity > 1) {
      updated[i].quantity -= 1;
    } else {
      updated.splice(i, 1);
    }
    setCartItems(updated);
  };

  const handleRemove = (i) => {
    const updated = [...cartItems];
    updated.splice(i, 1);
    setCartItems(updated);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!cartItems.length) return alert("Cart is empty.");
    const userId = localStorage.getItem("user_id");
    if (!userId) return alert("User not logged in!");

    try {
      const response = await fetch("http://157.245.80.36:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, total_amount: totalPrice }),
      });

      const data = await response.json();
      localStorage.setItem("order_id", data.id);
      navigate("/order", { state: { orderId: data.id, cartItems } });
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  const drinkItems = menuItems.filter((item) =>
    item.category?.toLowerCase() === "drink"
  );
  const foodItems = menuItems.filter((item) =>
    item.category?.toLowerCase() === "food"
  );
  

  return (
    <div className="catalog">
      <div className="banner">
        <div className="bar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/order">Order</Link></li>
            <li className="dropdown">
              <Link to="/login" className="nav-link">Log In</Link>
              <ul className="dropdown-menu">
                <Link to="/admin-login">Admin Log In</Link>
              </ul>
            </li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>
      </div>

      <div className="container">
        <h1 className="menu-title">OUR MENU</h1>
        <button className="cart-button" onClick={showCart}>Cart ({cartItems.reduce((sum, i) => sum + i.quantity, 0)})</button>

        {isCartOpen && (
          <div className="cart-overlay" onClick={closeCart}>
            <div className="cart-modal-content" ref={cartModalRef} onClick={(e) => e.stopPropagation()}>
              <div className="cart-modal-header">Your Cart</div>
              <div className="cart-modal-body">
                {cartItems.length ? (
                  <ul>
                    {cartItems.map((item, i) => (
                      <li key={i} className="cart-item">
                        <div className="cart-item-left">
                          <div className="cart-item-name">{item.name}</div>
                          {item.size && (
                            <div className="cart-item-size">
                              {item.size}
                              <button className="edit-size-btn" onClick={() => handleEditSize(i)}>✎</button>
                            </div>
                          )}
                          {editingSizeIndex === i && (
                            <div className="size-edit-panel slide-in">
                              {["Small", "Medium", "Large"].map((sz) => (
                                <button key={sz} onClick={() => handleSizeChangeInCart(i, sz)}>{sz}</button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="quantity-controls">
                          <button onClick={() => handleDecrement(i)}>–</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => handleIncrement(i)}>+</button>
                        </div>
                        <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                        <button onClick={() => handleRemove(i)}>Remove</button>
                      </li>
                    ))}
                  </ul>
                ) : <p>Nothing has been added to the cart.</p>}
              </div>
              <div className="cart-modal-footer">
                <div className="cart-total">Total: ${totalPrice.toFixed(2)}</div>
                <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
                <button className="cart-modal-close" onClick={closeCart}>Close</button>
              </div>
            </div>
          </div>
        )}

        <div className="tab-buttons">
          <button className={`tab-button ${tabState === "drinks" ? "active" : ""}`} onClick={() => setTabState("drinks")}>DRINKS</button>
          <button className={`tab-button ${tabState === "food" ? "active" : ""}`} onClick={() => setTabState("food")}>FOOD</button>
        </div>

        <div className="menu-category">
          <ul className="menu-list">
            {(tabState === "drinks" ? drinkItems : foodItems).map((item, idx) => (
              <li key={idx}>
                <div className="item-left">
                  <img src={item.image_url} alt={item.name} className="item-image" />
                  <div className="item-text">
                    <span className="item-name">{item.name}</span>
                    <br />
                    <span className="item-description">{item.description}</span>
                    <div className="extra-details">Ingredients: {item.ingredients}</div>
                  </div>
                </div>
                <span className="dots"></span>
                <div className="item-right">
                  <span className="item-price">${item.price}</span>
                  <span className="item-calories">{item.calories} Calories</span>
                  {tabState === "drinks" && (
                    <div className="size-options">
                      {["Small", "Medium", "Large"].map((size) => (
                        <button key={size} className={`size-btn ${selectedSizes[item.item_id] === size ? "selected" : ""}`} onClick={() => selectSize(item.item_id, size)}>
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                  <input
                    type="number"
                    min="1"
                    className="quantity-input"
                    value={quantities[item.item_id] || 1}
                    onChange={(e) => handleQuantityChange(item.item_id, e.target.value)}
                  />
                  <button className="add-to-cart" onClick={(e) => addToCart(e, item)}>Add to Cart</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {popupInfo && (
        <div className="cart-popup" style={{ top: popupInfo.y, left: popupInfo.x, position: "absolute" }}>
          {popupInfo.message}
        </div>
      )}
    </div>
  );
};

export default CatalogMenuPage;
