import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/menu.css';

function Menu() {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://157.245.80.36:5000/menu');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMenuData(data);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>Error loading menu: {error.message}</p>;
  if (!menuData) return <p>No menu data available.</p>;

  const showCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.item_id === item.item_id);
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.item_id === item.item_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };
  const adjustQuantity = (itemId, change) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.item_id === itemId) {
          const newQuantity = item.quantity + change;
          if (newQuantity > 0) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };
  
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.item_id !== itemId));
  };

  return (
    <>
      <title>Cafe Menu</title>
      <div className="container">
        <h1 className="menu-title">OUR MENU</h1>
        <button className="cart-button" onClick={showCart}>
          Cart (<span className="cart-count">{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>)
        </button>
        <div className={`cart-modal ${isCartOpen ? 'open' : 'hidden'}`} id="cartModal">
          <div className="cart-modal-content">
            <div className="cart-modal-header">Your Cart</div>
            <div className="cart-modal-body">
              <div id="cartContents">
                {cartItems.length === 0 ? (
                  <p>Nothing has been added to the cart.</p>
                ) : (
                  <ul>
                    {cartItems.map((cartItem) => (
                      <li key={cartItem.item_id} className="cart-item">
                        <div className="cart-item-details">
                          <span>{cartItem.name}</span>
                          <span>Quantity: {cartItem.quantity}</span>
                          <span>${cartItem.price * cartItem.quantity}</span>
                        </div>
                        <div>
                          <button className="quantity-btn" onClick={() => adjustQuantity(cartItem.item_id, -1)}>-</button>
                          <button className="quantity-btn" onClick={() => adjustQuantity(cartItem.item_id, 1)}>+</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="cart-total">
                Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
              </div>
            </div>
            <div className="cart-modal-footer">
              <Link to="/order" state={{ cartItems: cartItems }} className="checkout-button">
                Checkout
              </Link>
            </div>
            <div className="cart-modal-footer">
              <button className="cart-modal-close" onClick={closeCart}>
                Close
              </button>
            </div>
          </div>
        </div>
        <div className="menu-category">
          <ul className="menu-list">
            {menuData.map((item) => (
              <li key={item.item_id} className="menu-item">
                <div className="item-left">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-text">
                    <span className="item-name">{item.name}</span>
                    <br />
                    <span className="item-price">${item.price}</span>
                    <br />
                    <span className="item-description">{item.description}</span>
                  </div>
                </div>
                <div className="item-right">
                  <button className="add-to-cart" onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Menu;