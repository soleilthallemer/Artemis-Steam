import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/menu.css";

// Import images (update paths if needed)
import dripCoffee from "../assets/images/drip_coffee.webp";
import espresso from "../assets/images/espresso.webp";
import latte from "../assets/images/latte.webp";
import americano from "../assets/images/americano.webp";
import mocha from "../assets/images/mocha.webp";
import matcha from "../assets/images/matcha.webp";
import butterCroissant from "../assets/images/butter_croissant.webp";
import blueberryMuffin from "../assets/images/blueberry_muffin.webp";

const CatalogMenuPage = () => {
  // Which tab is active: 'drinks' or 'food'
  const [activeTab, setActiveTab] = useState("drinks");

  // Cart items: { name, size, quantity, price }
  const [cartItems, setCartItems] = useState([]);

  // Whether the cart modal is open
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Track selected size per item name, e.g. { "Latte": "Medium", ... }
  const [selectedSizes, setSelectedSizes] = useState({});

  // Track quantity input per item name, e.g. { "Latte": 2, ... }
  const [quantities, setQuantities] = useState({});

  // Utility to handle size selection
  const selectSize = (itemName, size) => {
    setSelectedSizes((prev) => ({ ...prev, [itemName]: size }));
  };

  // Utility to handle quantity input
  const handleQuantityChange = (itemName, newQty) => {
    const qty = Math.max(Number(newQty), 1); // at least 1
    setQuantities((prev) => ({ ...prev, [itemName]: qty }));
  };

  // Add item to cart
  const addToCart = (itemName) => {
    // If it's a drink, ensure a size is selected
    const size = selectedSizes[itemName];
    if (!size && isDrinkItem(itemName)) {
      alert("Please select a size before adding to cart.");
      return;
    }

    // Quantity from the input, default to 1 if none
    const quantity = quantities[itemName] || 1;

    // Get price from sample data for use later in order page.
    const itemData =
      drinkItems.find((drink) => drink.name === itemName) ||
      foodItems.find((food) => food.name === itemName);
    const price = itemData ? itemData.price : "$0.00";

    setCartItems((prevCart) => {
      // Check if an item with same name+size is already in cart
      const existingIndex = prevCart.findIndex(
        (cartItem) => cartItem.name === itemName && cartItem.size === size
      );

      if (existingIndex >= 0) {
        // If found, increment quantity by 1 per click
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + quantity,
        };
        return updatedCart;
      } else {
        // Otherwise, add new item
        return [...prevCart, { name: itemName, size, quantity, price }];
      }
    });
  };

  // Helper to check if an item name is in the drinkItems array
  const isDrinkItem = (itemName) => {
    return drinkItems.some((drink) => drink.name === itemName);
  };

  // Toggle cart open/close
  const showCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Increment quantity of an item in the cart by 1 per click
  const handleIncrement = (index) => {
    setCartItems((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart[index].quantity += 1;
      return updatedCart;
    });
  };

  // Decrement quantity of an item in the cart by 1 per click
  const handleDecrement = (index) => {
    setCartItems((prevCart) => {
      const updatedCart = [...prevCart];
      if (updatedCart[index].quantity > 1) {
        updatedCart[index].quantity -= 1;
      } else {
        // Remove the item if quantity is 1
        updatedCart.splice(index, 1);
      }
      return updatedCart;
    });
  };

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

      {/* Main container */}
      <div className="container">
        <h1 className="menu-title">OUR MENU</h1>

        {/* Cart button */}
        <button className="cart-button" onClick={showCart}>
          Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
        </button>

        {/* Cart Overlay Modal */}
        {isCartOpen && (
          <div className="cart-overlay" onClick={closeCart}>
            <div
              className="cart-modal-content"
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
