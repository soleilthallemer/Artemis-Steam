import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/menu.css';

function Menu() {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const showCart = () => {};
  const closeCart = () => {};
  const showTab = (tabName) => {};
  const selectSize = (element) => {};
  const addToCart = (item) => {
    console.log(item);
  };

  return (
    <>
      <title>Cafe Menu</title>
      <div className="container">
        <h1 className="menu-title">OUR MENU</h1>
        <button className="cart-button" onClick={showCart}>
          Cart (<span className="cart-count">0</span>)
        </button>
        {/* Cart Modal */}
        <div className="cart-modal hidden" id="cartModal">
          <div className="cart-modal-content">
            <div className="cart-modal-header">Your Cart</div>
            <div className="cart-modal-body">
              <div id="cartContents">Nothing has been added to the cart.</div>
            </div>
            <div className="cart-modal-footer">
              <Link to="/order" className="checkout-button">
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
        {/* Menu Items */}
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