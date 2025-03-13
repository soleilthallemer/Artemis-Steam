// src/components/CatalogMenuPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/menu.css";

const CatalogMenuPage = () => {
  const [activeTab, setActiveTab] = useState("drinks");
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});
  const cartModalRef = useRef(null);

  // Utility to handle size selection
  const selectSize = (itemName, size) => {
    setSelectedSizes((prev) => ({ ...prev, [itemName]: size }));
  };

  // Utility to handle quantity input
  const handleQuantityChange = (itemName, newQty) => {
    const qty = Math.max(Number(newQty), 1);
    setQuantities((prev) => ({ ...prev, [itemName]: qty }));
  };

  // Helper to check if an item is a drink
  const isDrinkItem = (itemName) => {
    return drinkItems.some((drink) => drink.name === itemName);
  };

  // Add item to cart
  const addToCart = (itemName) => {
    const size = selectedSizes[itemName];
    if (!size && isDrinkItem(itemName)) {
      alert("Please select a size before adding to cart.");
      return;
    }
    const quantity = quantities[itemName] || 1;
    // Get price from sample data (convert string price to number)
    const itemData =
      drinkItems.find((drink) => drink.name === itemName) ||
      foodItems.find((food) => food.name === itemName);
    const price = itemData ? parseFloat(itemData.price.replace("$", "")) : 0;
    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (cartItem) => cartItem.name === itemName && cartItem.size === size
      );
      if (existingIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + quantity,
        };
        return updatedCart;
      } else {
        return [...prevCart, { name: itemName, size, quantity, price }];
      }
    });
  };

  // Toggle cart open/close
  const showCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    // ✅ Retrieve user ID (Assuming it's stored in localStorage or Context)
    const userId = localStorage.getItem("user_id"); // Modify based on auth handling
    console.log(userId);
    if (!userId) {
      alert("User not logged in!");
      return;
    }
  
    try {
      // ✅ Create a new order with the current user and total_amount = 0
      const response = await fetch("http://157.245.80.36:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, total_amount: 0 }),
      });
  
      if (!response.ok) throw new Error("Failed to create order");
  
      const orderData = await response.json();
      const orderId = orderData.id.toString();
      localStorage.setItem("order_id", orderId);
      console.log(localStorage.getItem("order_id"));
  
      // ✅ Redirect to the Order Page and pass the cart items
      //navigate("/order", { state: { orderId, cartItems } });
  
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Failed to place the order. Try again.");
    }
  };
  


  // Increment quantity
  const handleIncrement = (index) => {
    setCartItems((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity += 1;
      return updatedCart;
    });
  };

  // Decrement quantity
  const handleDecrement = (index) => {
    setCartItems((prevCart) => {
      const updatedCart = [...prevCart];
      if (updatedCart[index].quantity > 1) {
        updatedCart[index].quantity -= 1;
      } else {
        updatedCart.splice(index, 1);
      }
      return updatedCart;
    });
  };

  // Close cart modal on outside click
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

  // Sample data for DRINKS using images from the public folder
  const drinkItems = [
    {
      name: "Drip Coffee",
      desc: "Classic brewed coffee",
      ingredients: "Coffee, Water",
      img: "/images/drip_coffee.webp",
      price: "$2.50",
      calories: "5 Calories",
    },
    {
      name: "Espresso",
      desc: "Strong and bold shot of coffee",
      ingredients: "Espresso",
      img: "/images/espresso.webp",
      price: "$3.00",
      calories: "10 Calories",
    },
    {
      name: "Latte",
      desc: "Espresso with steamed milk",
      ingredients: "Espresso, Milk",
      img: "/images/latte.webp",
      price: "$4.00",
      calories: "150 Calories",
    },
    {
      name: "Americano",
      desc: "Espresso diluted with hot water",
      ingredients: "Espresso, Water",
      img: "/images/americano.webp",
      price: "$3.50",
      calories: "15 Calories",
    },
    {
      name: "Mocha",
      desc: "Chocolate-flavored espresso drink",
      ingredients: "Espresso, Milk, Chocolate",
      img: "/images/mocha.webp",
      price: "$4.50",
      calories: "250 Calories",
    },
    {
      name: "Matcha",
      desc: "Green tea latte with steamed milk",
      ingredients: "Matcha, Milk",
      img: "/images/matcha.webp",
      price: "$4.50",
      calories: "180 Calories",
    },
  ];

  // Sample data for FOOD using images from the public folder
  const foodItems = [
    {
      name: "Butter Croissant",
      desc: "Flaky, buttery French pastry",
      ingredients: "Flour, Butter, Sugar, Yeast",
      img: "/images/butter_croissant.webp",
      price: "$3.00",
      calories: "300 Calories",
    },
    {
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
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link to="/order">Order</Link>
            </li>
            <li>
              <Link to="/login">Log In</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Container */}
      <div className="container">
        <h1 className="menu-title">OUR MENU</h1>
        <button className="cart-button" onClick={showCart}>
          Cart (
          <span className="cart-count">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
          )
        </button>

        {/* Cart Overlay Modal */}
        {isCartOpen && (
          <div className="cart-overlay" onClick={closeCart}>
            <div
              className="cart-modal-content"
              ref={cartModalRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cart-modal-header">Your Cart</div>
              <div className="cart-modal-body">
                {cartItems.length > 0 ? (
                  <ul>
                    {cartItems.map((item, index) => (
                      <li key={index} className="cart-item">
                        <span>
                          {item.name} {item.size ? `(${item.size})` : ""}
                        </span>
                        <div className="quantity-controls">
                          <button onClick={() => handleDecrement(index)}>
                            –
                          </button>
                          <span className="item-quantity">{item.quantity}</span>
                          <button onClick={() => handleIncrement(index)}>
                            +
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nothing has been added to the cart.</p>
                )}
              </div>
              <div className="cart-modal-footer">
                <Link
                  to="/order"
                  className="checkout-button"
                  state={{ cartItems: cartItems }}
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
            className={`tab-button ${activeTab === "drinks" ? "active" : ""}`}
            onClick={() => setActiveTab("drinks")}
          >
            DRINKS
          </button>
          <button
            className={`tab-button ${activeTab === "food" ? "active" : ""}`}
            onClick={() => setActiveTab("food")}
          >
            FOOD
          </button>
        </div>

        {/* DRINKS Section */}
        {activeTab === "drinks" && (
          <div className="menu-category">
            <ul className="menu-list">
              {drinkItems.map((drink, index) => {
                const { name, desc, ingredients, img, price, calories } =
                  drink;
                return (
                  <li key={index}>
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
                            className={`size-btn ${
                              selectedSizes[name] === sizeOption ? "selected" : ""
                            }`}
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
                        onChange={(e) =>
                          handleQuantityChange(name, e.target.value)
                        }
                      />
                      <button
                        className="add-to-cart"
                        onClick={() => addToCart(name)}
                      >
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
        {activeTab === "food" && (
          <div className="menu-category">
            <ul className="menu-list">
              {foodItems.map((food, index) => {
                const { name, desc, ingredients, img, price, calories } =
                  food;
                return (
                  <li key={index}>
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
                        onChange={(e) =>
                          handleQuantityChange(name, e.target.value)
                        }
                      />
                      <button
                        className="add-to-cart"
                        onClick={() => {
                          selectSize(name, "Default");
                          addToCart(name);
                        }}
                      >
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
    </div>
  );
};

export default CatalogMenuPage;
