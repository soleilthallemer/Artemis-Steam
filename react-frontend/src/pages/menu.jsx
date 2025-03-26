// src/components/CatalogMenuPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/menu.css";

const CatalogMenuPage = () => {
  // State for tab selection (drinks vs. food)
  const [tabState, setTabState] = useState("drinks");

  // Cart state: initialize from localStorage if available, otherwise empty array
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  // For items being added (temporary selections)
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});
  // Popup notification state
  const [popupInfo, setPopupInfo] = useState(null);
  // Track which cart item (index) is being edited for size (drinks only)
  const [editingSizeIndex, setEditingSizeIndex] = useState(null);

  const cartModalRef = useRef(null);
  const navigate = useNavigate();

  // Persist cartItems in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Check if an item is a drink
  const isDrinkItem = (itemName) =>
    drinkItems.some((drink) => drink.name === itemName);

  // For adding items: select size
  const selectSize = (itemName, size) => {
    setSelectedSizes((prev) => ({ ...prev, [itemName]: size }));
  };

  // For adding items: handle quantity input
  const handleQuantityChange = (itemName, newQty) => {
    const qty = Math.max(Number(newQty), 1);
    setQuantities((prev) => ({ ...prev, [itemName]: qty }));
  };

  // Add item to cart
  const addToCart = (e, itemName) => {
    e.stopPropagation();
    const size = selectedSizes[itemName];
    if (!size && isDrinkItem(itemName)) {
      alert("Please select a size before adding to cart.");
      return;
    }
  
    const quantity = quantities[itemName] || 1;
  
    const itemData =
      drinkItems.find((d) => d.name === itemName) ||
      foodItems.find((f) => f.name === itemName);
  
    if (!itemData) {
      alert("Item not found.");
      return;
    }
  
    const id = itemData.id;
    const price = parseFloat(itemData.price.replace("$", ""));
  
    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (cartItem) => cartItem.name === itemName && cartItem.size === size
      );
      if (existingIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { id, name: itemName, size, quantity, price }];
      }
    });
  
    const rect = e.target.getBoundingClientRect();
    setPopupInfo({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      message: "Added to cart!",
    });
    setTimeout(() => setPopupInfo(null), 2000);
  };
  
  // Toggle cart modal open/close
  const showCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Handle editing size: toggle slide-in panel for the selected cart item (drinks only)
  const handleEditSize = (index) => {
    setEditingSizeIndex((prev) => (prev === index ? null : index));
  };

  // When a new size is selected from the panel, update the cart item and close panel
  const handleSizeChangeInCart = (index, newSize) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].size = newSize;
      return updated;
    });
    setEditingSizeIndex(null);
  };

  // Increment quantity in cart
  const handleIncrement = (index) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity += 1;
      return updated;
    });
  };

  // Decrement quantity in cart
  const handleDecrement = (index) => {
    setCartItems((prev) => {
      const updated = [...prev];
      if (updated[index].quantity > 1) {
        updated[index].quantity -= 1;
      } else {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  // (Optional) Remove an item entirely from the cart
  const handleRemove = (index) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  // Close cart modal if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cartModalRef.current &&
        !cartModalRef.current.contains(event.target) &&
        isCartOpen
      ) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen]);

  // Compute total price
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Checkout function
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  
    if (totalPrice === 0) {
      alert("Cannot create an order with $0 total.");
      return;
    }
  
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("User not logged in!");
      return;
    }
  
    const existingOrderId = localStorage.getItem("order_id");
    if (existingOrderId) {
      navigate("/order", { state: { cartItems } });
      return;
    }
  
    try {
      const response = await fetch("http://157.245.80.36:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, total_amount: 0 }), // shell
      });
  
      if (!response.ok) throw new Error("Failed to create order");
  
      const orderData = await response.json();
      const orderId = orderData.id.toString();
      localStorage.setItem("order_id", orderId);
  
      navigate("/order", { state: { cartItems } });
  
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Failed to place the order. Try again.");
    }
  };
  
  

  // Sample DRINKS data (using public folder images)
  // src/components/CatalogMenuPage.jsx

// ... (existing imports and component setup)

  // Sample DRINKS data (with item IDs)
  const drinkItems = [
    {
      id: 1,
      name: "Drip Coffee",
      desc: "Classic brewed coffee",
      ingredients: "Coffee, Water",
      img: "/images/drip_coffee.webp",
      price: "$2.50",
      calories: "5 Calories",
    },
    {
      id: 2,
      name: "Espresso",
      desc: "Strong and bold shot of coffee",
      ingredients: "Espresso",
      img: "/images/espresso.webp",
      price: "$3.00",
      calories: "10 Calories",
    },
    {
      id: 3,
      name: "Latte",
      desc: "Espresso with steamed milk",
      ingredients: "Espresso, Milk",
      img: "/images/latte.webp",
      price: "$4.00",
      calories: "150 Calories",
    },
    {
      id: 4,
      name: "Americano",
      desc: "Espresso diluted with hot water",
      ingredients: "Espresso, Water",
      img: "/images/americano.webp",
      price: "$3.50",
      calories: "15 Calories",
    },
    {
      id: 5,
      name: "Mocha",
      desc: "Chocolate-flavored espresso drink",
      ingredients: "Espresso, Milk, Chocolate",
      img: "/images/mocha.webp",
      price: "$4.50",
      calories: "250 Calories",
    },
    {
      id: 6,
      name: "Matcha",
      desc: "Green tea latte with steamed milk",
      ingredients: "Matcha, Milk",
      img: "/images/matcha.webp",
      price: "$4.50",
      calories: "180 Calories",
    },
  ];

  // Sample FOOD data (with item IDs)
  const foodItems = [
    {
      id: 7,
      name: "Butter Croissant",
      desc: "Flaky, buttery French pastry",
      ingredients: "Flour, Butter, Sugar, Yeast",
      img: "/images/butter_croissant.webp",
      price: "$3.00",
      calories: "300 Calories",
    },
    {
      id: 8,
      name: "Blueberry Muffin",
      desc: "Soft muffin with fresh blueberries",
      ingredients: "Flour, Blueberries, Sugar",
      img: "/images/blueberry_muffin.webp",
      price: "$3.50",
      calories: "350 Calories",
    },
  ];

  return (
    <div className="catalog">
      {/* Banner / Navigation */}
      <div className="banner">
        <div className="bar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/order">Order</Link></li>
            <li><Link to="/login">Log In</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>
      </div>

      {/* Main Container */}
      <div className="container">
        <h1 className="menu-title">OUR MENU</h1>
        <button className="cart-button" onClick={showCart}>
          Cart (<span className="cart-count">{cartItems.reduce((sum, i) => sum + i.quantity, 0)}</span>)
        </button>

        {/* Cart Overlay */}
        {isCartOpen && (
          <div className="cart-overlay" onClick={closeCart}>
            <div className="cart-modal-content" ref={cartModalRef} onClick={(e) => e.stopPropagation()}>
              <div className="cart-modal-header">Your Cart</div>
              <div className="cart-modal-body">
                {cartItems.length > 0 ? (
                  <ul>
                    {cartItems.map((item, index) => {
                      const isDrink = isDrinkItem(item.name);
                      return (
                        <li key={index} className="cart-item">
                          {/* Left Section: Product name and, if drink, size with edit */}
                          <div className="cart-item-left">
                            <div className="cart-item-name">{item.name}</div>
                            {isDrink && (
                              <div className="cart-item-size">
                                {item.size}
                                <button
                                  className="edit-size-btn"
                                  onClick={() => handleEditSize(index)}
                                  title="Edit size"
                                >
                                  ✎
                                </button>
                              </div>
                            )}
                            {isDrink && editingSizeIndex === index && (
                              <div className="size-edit-panel slide-in">
                                {["Small", "Medium", "Large"].map((sz) => (
                                  <button key={sz} onClick={() => handleSizeChangeInCart(index, sz)}>
                                    {sz}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          {/* Middle Section: Quantity Controls */}
                          <div className="quantity-controls">
                            <button className="quantity-btn" onClick={() => handleDecrement(index)}>
                              –
                            </button>
                            <span className="item-quantity">{item.quantity}</span>
                            <button className="quantity-btn" onClick={() => handleIncrement(index)}>
                              +
                            </button>
                          </div>
                          {/* Right Section: Price */}
                          <div className="item-price">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          {/* Remove Button (if needed) */}
                          <button className="remove-button" onClick={() => handleRemove(index)}>
                            Remove
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>Nothing has been added to the cart.</p>
                )}
              </div>
              <div className="cart-modal-footer">
                <div className="cart-total">Total: ${totalPrice.toFixed(2)}</div>
                <Link
                  to="/order"
                  className="checkout-button"
                  state={{ cartItems }}
                  onClick={handleCheckout}
                >
                  Checkout
                </Link>
                <button className="cart-modal-close" onClick={closeCart}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="tab-buttons">
          <button
            className={`tab-button ${tabState === "drinks" ? "active" : ""}`}
            onClick={() => setTabState("drinks")}
          >
            DRINKS
          </button>
          <button
            className={`tab-button ${tabState === "food" ? "active" : ""}`}
            onClick={() => setTabState("food")}
          >
            FOOD
          </button>
        </div>

        {/* DRINKS Section */}
        {tabState === "drinks" && (
          <div className="menu-category">
            <ul className="menu-list">
              {drinkItems.map((drink, idx) => {
                const { name, desc, ingredients, img, price, calories } = drink;
                return (
                  <li key={idx}>
                    <div className="item-left">
                      <img src={img} alt={name} className="item-image" />
                      <div className="item-text">
                        <span className="item-name">{name}</span>
                        <br />
                        <span className="item-description">{desc}</span>
                        <div className="extra-details">
                          Ingredients: {ingredients}
                        </div>
                      </div>
                    </div>
                    <span className="dots"></span>
                    <div className="item-right">
                      <span className="item-price">{price}</span>
                      <span className="item-calories">{calories}</span>
                      <div className="size-options">
                        {["Small", "Medium", "Large"].map((sizeOption) => (
                          <button
                            key={sizeOption}
                            className={`size-btn ${selectedSizes[name] === sizeOption ? "selected" : ""}`}
                            onClick={() => selectSize(name, sizeOption)}
                          >
                            {sizeOption}
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        className="quantity-input"
                        min="1"
                        value={quantities[name] || 1}
                        onChange={(e) => handleQuantityChange(name, e.target.value)}
                      />
                      <button className="add-to-cart" onClick={(e) => addToCart(e, name)}>
                        Add to Cart
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* FOOD Section */}
        {tabState === "food" && (
          <div className="menu-category">
            <ul className="menu-list">
              {foodItems.map((food, idx) => {
                const { name, desc, ingredients, img, price, calories } = food;
                return (
                  <li key={idx}>
                    <div className="item-left">
                      <img src={img} alt={name} className="item-image" />
                      <div className="item-text">
                        <span className="item-name">{name}</span>
                        <br />
                        <span className="item-description">{desc}</span>
                        <div className="extra-details">
                          Ingredients: {ingredients}
                        </div>
                      </div>
                    </div>
                    <span className="dots"></span>
                    <div className="item-right">
                      <span className="item-price">{price}</span>
                      <span className="item-calories">{calories}</span>
                      <input
                        type="number"
                        className="quantity-input"
                        min="1"
                        value={quantities[name] || 1}
                        onChange={(e) => handleQuantityChange(name, e.target.value)}
                      />
                      <button className="add-to-cart" onClick={(e) => addToCart(e, name)}>
                        Add to Cart
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Pop-Up Notification */}
      {popupInfo && (
        <div
          className="cart-popup"
          style={{
            position: "absolute",
            top: popupInfo.y,
            left: popupInfo.x,
          }}
        >
          {popupInfo.message}
        </div>
      )}
    </div>
  );
};

export default CatalogMenuPage;
