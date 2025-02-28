import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/catalog_menu_page.css";


// Import images
import dripCoffee from "../assets/images/drip_coffee.webp";
import espresso from "../assets/images/espresso.webp";
import latte from "../assets/images/latte.webp";
import americano from "../assets/images/americano.webp";
import mocha from "../assets/images/mocha.webp";
import matcha from "../assets/images/matcha.webp";
import butterCroissant from "../assets/images/butter_croissant.webp";
import blueberryMuffin from "../assets/images/blueberry_muffin.webp";

const CatalogMenuPage = () => {
  const [activeTab, setActiveTab] = useState("drinks");

  // Instead of storing strings, store objects: { name, size, quantity }
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // We'll track the selected size for each item name
  const [selectedSizes, setSelectedSizes] = useState({});

  // We'll track the quantity input for each item name
  const [quantities, setQuantities] = useState({});

  // Utility to handle size selection
  const selectSize = (itemName, size) => {
    setSelectedSizes((prev) => ({ ...prev, [itemName]: size }));
  };

  // Utility to handle quantity input
  const handleQuantityChange = (itemName, newQty) => {
    // Ensure it's at least 1
    const qty = Math.max(Number(newQty), 1);
    setQuantities((prev) => ({ ...prev, [itemName]: qty }));
  };

  // Add an item to cart with quantity
  const addToCart = (itemName) => {
    const size = selectedSizes[itemName];
    if (!size) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const quantity = quantities[itemName] || 1; // fallback to 1 if undefined

    setCartItems((prevCart) => {
      // Check if we already have an item with the same name + size
      const existingIndex = prevCart.findIndex(
        (cartItem) => cartItem.name === itemName && cartItem.size === size
      );

      if (existingIndex >= 0) {
        // If so, increment its quantity
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + quantity,
        };
        return updatedCart;
      } else {
        // Otherwise, add a new line
        return [...prevCart, { name: itemName, size, quantity }];
      }
    });
  };

  // Toggle cart open/close
  const showCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Sample data for DRINKS
  const drinkItems = [
    {
      name: "Drip Coffee",
      desc: "Classic brewed coffee",
      ingredients: "Coffee, Water",
      img: dripCoffee,
      price: "$2.50",
      calories: "5 Calories",
    },
    {
      name: "Espresso",
      desc: "Strong and bold shot of coffee",
      ingredients: "Espresso",
      img: espresso,
      price: "$3.00",
      calories: "10 Calories",
    },
    {
      name: "Latte",
      desc: "Espresso with steamed milk",
      ingredients: "Espresso, Milk",
      img: latte,
      price: "$4.00",
      calories: "150 Calories",
    },
    {
      name: "Americano",
      desc: "Espresso diluted with hot water",
      ingredients: "Espresso, Water",
      img: americano,
      price: "$3.50",
      calories: "15 Calories",
    },
    {
      name: "Mocha",
      desc: "Chocolate-flavored espresso drink",
      ingredients: "Espresso, Milk, Chocolate",
      img: mocha,
      price: "$4.50",
      calories: "250 Calories",
    },
    {
      name: "Matcha",
      desc: "Green tea latte with steamed milk",
      ingredients: "Matcha, Milk",
      img: matcha,
      price: "$4.50",
      calories: "180 Calories",
    },
  ];

  // Sample data for FOOD
  const foodItems = [
    {
      name: "Butter Croissant",
      desc: "Flaky, buttery French pastry",
      ingredients: "Flour, Butter, Sugar, Yeast",
      img: butterCroissant,
      price: "$3.00",
      calories: "300 Calories",
    },
    {
      name: "Blueberry Muffin",
      desc: "Soft muffin with fresh blueberries",
      ingredients: "Flour, Blueberries, Sugar",
      img: blueberryMuffin,
      price: "$3.50",
      calories: "350 Calories",
    },
  ];

  return (
    <div className="catalog">
      {/* Banner */}
      <div className="banner">
        <div className="bar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/order" className="active">Order</Link></li>
          </ul>
        </div>

        {/* Example: If you have additional nav-right content */}
        <div className="nav-right">
          <Link to="/login">Log In</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>

      {/* Container */}
      <div className="container">
        <h1 className="menu-title">OUR MENU</h1>

        {/* Cart Button */}
        <button className="cart-button" onClick={showCart}>
          Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
        </button>

        {/* Cart Modal (always in DOM, toggles show class) */}
        <div className={`cart-modal ${isCartOpen ? "show" : ""}`}>
          <div className="cart-modal-content">
            <div className="cart-modal-header">Your Cart</div>
            <div className="cart-modal-body">
              {cartItems.length > 0 ? (
                <ul>
                  {cartItems.map((item, index) => (
                    <li key={index}>
                      {/* e.g. "4x Drip Coffee (Large)" */}
                      {item.quantity}x {item.name} ({item.size})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nothing has been added to the cart.</p>
              )}
            </div>
            <div className="cart-modal-footer">
              <Link to="/order" className="checkout-button">
                Checkout
              </Link>
              <button className="cart-modal-close" onClick={closeCart}>
                Close
              </button>
            </div>
          </div>
        </div>

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

        {/* Drinks Section */}
        {activeTab === "drinks" && (
          <div className="menu-category">
            <ul className="menu-list">
              {drinkItems.map((drink, index) => {
                const { name, desc, ingredients, img, price, calories } = drink;
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
                              selectedSizes[name] === sizeOption
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => selectSize(name, sizeOption)}
                          >
                            {sizeOption}
                          </button>
                        ))}
                      </div>

                      {/* Quantity input */}
                      <input
                        type="number"
                        className="quantity-input"
                        min="1"
                        value={quantities[name] || 1}
                        onChange={(e) => handleQuantityChange(name, e.target.value)}
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

        {/* Food Section */}
        {activeTab === "food" && (
          <div className="menu-category">
            <ul className="menu-list">
              {foodItems.map((food, index) => {
                const { name, desc, ingredients, img, price, calories } = food;
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

                      {/* No size for food, but we can set a "Default" size internally */}
                      <input
                        type="number"
                        className="quantity-input"
                        min="1"
                        value={quantities[name] || 1}
                        onChange={(e) => handleQuantityChange(name, e.target.value)}
                      />

                      <button
                        className="add-to-cart"
                        onClick={() => {
                          // For food, we can store a "Default" size or skip it
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
