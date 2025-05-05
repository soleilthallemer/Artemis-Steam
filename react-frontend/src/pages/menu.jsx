// src/pages/CatalogMenuPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Bar from "./bar";     
import "../css/bar.css";      
import "../css/menu.css";

const CatalogMenuPage = () => {
  const [tabState, setTabState] = useState("drinks");
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [menuItems, setMenuItems]   = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities,     setQuantities]   = useState({});

  const [popupInfo,         setPopupInfo]   = useState(null);

  const [customizations, setCustomizations] = useState({});
  const [customizeFor,   setCustomizeFor]   = useState(null);
  const [customQuantity, setCustomQuantity] = useState(1);
  const [editingCartIndex, setEditingCartIndex] = useState(null); 

  const cartModalRef = useRef(null);
  const navigate     = useNavigate();


  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/menu`);
        const data = await res.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error loading menu:", error);
      }
    };
    fetchMenuItems();
  }, []);

  const isDrinkItem = (obj) => {
    if (!obj) return false;
  
    if (obj.category) {
      return obj.category.toLowerCase() === "drink";
    }
  
    const cust = customizations[obj.item_id];
    return !!(cust && (cust.milk || cust.syrup));
  };

  const getCustom = (item, isDrink) => {
    const k = keyOf(item);
    if (!customizations[k]) {
      const def = isDrink
        ? { milk: "None", syrup: "None" }
        : { warmed:false, iceCream:false, chocolate:false };
        setCustomizations(p => ({ ...p, [k]: def }));
      return def;
    }
    return customizations[k];
  };

  const keyOf = (it) => `${it.item_id}-${(it.category || '').toLowerCase()}`;

  const selectSize = (item, size) => {
    const k = keyOf(item);
    setSelectedSizes(prev => ({ ...prev, [k]: size }));
  };

  const handleQuantityChange = (id, value) => {
    const qty = Math.max(Number(value), 1);
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  const openCustomize = (item) => {
    if (!customizations[keyOf(item)]) {
      setCustomizations((prev) => ({
        ...prev,
        [keyOf(item)]:  isDrinkItem(item)
        ? { milk: "Whole", syrup: "Normal" }
          : { warmed: false, iceCream: false, chocolate: false },
      }));
    }
    setCustomizeFor(item);
  };

  const saveCustomization = () => {
    setCustomizeFor(null);
  };

  const addToCart = (e, item, opts = {}) => {
    e.stopPropagation();

    if (!item.quantity || Number(item.quantity) <= 0) {
      const rect = e.target.getBoundingClientRect();
      console.log("Item is out of stock, popup at:", rect);
      setPopupInfo({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        message: "Cannot add to cart, item is out of stock."
      });
      setTimeout(() => setPopupInfo(null), 2000);
      return;
    }

    const k    = keyOf(item);
    const size = selectedSizes[k];
    if (isDrinkItem(item) && !size) {
      alert("Please select a size before adding to cart.");
      return;
    }

    const quantity      = opts.quantity ?? quantities[item.item_id] ?? 1;
    const customization = opts.cust ?? getCustom(item, isDrinkItem(item));
    const newItem = {
      id: item.item_id,
      item_id: item.item_id,
      name: item.name,
      size,
      quantity,
      price: item.price,
      custom: customization,
      category: item.category
    };

    setCartItems((prev) => {
      const sameItem = (a, b) =>
        a.name === b.name &&
        a.size === b.size &&
        JSON.stringify(a.custom) === JSON.stringify(b.custom);
        
        const index = prev.findIndex(i => sameItem(i, newItem));

      if (index >= 0) {
        const updated = [...prev];
        updated[index].quantity += quantity;
        return updated;
      }
      return [...prev, newItem];
    });

    const rect = e.target.getBoundingClientRect();
    setPopupInfo({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      message: "Added to cart!"
    });
    setTimeout(() => setPopupInfo(null), 2000);
  };

  const handleAddToCartFromModal = (e) => {
    if (editingCartIndex !== null) {
      setCartItems((prev) => {
        const updated = [...prev];
        updated[editingCartIndex] = {
          ...updated[editingCartIndex],
          size:     selectedSizes[keyOf(customizeFor)]  || updated[editingCartIndex].size,
          quantity:   customQuantity,
          custom:     customizations[keyOf(customizeFor)],
          category:   updated[editingCartIndex].category           
        };
        return updated;
      });
    } else {
      addToCart(e, customizeFor);
    }
  
    setEditingCartIndex(null);
    saveCustomization();
  };

  const openCustomizeFromCart = (index) => {
    const item = cartItems[index];
  
    const k = keyOf(item);
    setSelectedSizes({ [k]: item.size });
    setCustomQuantity(item.quantity);

    setCustomizations((prev) => ({
      ...prev,
      [k]: item.custom || prev[k] || getCustom(item, isDrinkItem(item))
    }));
  
    setEditingCartIndex(index);  
    setCustomizeFor(item);       
    setIsCartOpen(true)
  };  

  const showCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

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

      const payload = {
          user_id:      userId,
          total_amount: totalPrice,
          items: cartItems.map((it) => ({
            item_id:  it.item_id,
            quantity: it.quantity,
            price:    it.price,
      
            milk_option: it.custom?.milk  ?? null,
            syrup:       it.custom?.syrup ?? null,
      
            customizations: JSON.stringify(it.custom ?? {})
          }))
      };

    try {
      const response = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify(payload),
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

  const k = customizeFor ? keyOf(customizeFor) : null;

  return (
    <div className="catalog">

      <Bar />

        <div style={{ paddingTop: "72px" }}>
        {/* existing container / cart / menu JSX here */}
      </div>

      <div className="container">
        <h1 className="menu-title">OUR MENU</h1>
        <button className="cart-button" onClick={showCart}>
          Cart ({cartItems.reduce((sum, i) => sum + i.quantity, 0)})
        </button>

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
                          {/* customization details – only if they exist */}
                          {item.custom && (
                            <div className="cart-item-custom">
                              {item.size && <span>{item.size}</span>}
                              {/* Drinks */}
                              {item.custom.milk && (
                                <span>
                                  {item.size ? ", " : ""}{item.custom.milk} milk /
                                  {item.custom.syrup} syrup
                                </span>
                              )}
                              {/* Food (boolean flags) */}
                              {["warmed","iceCream","chocolate"]
                                .filter(k => item.custom[k])
                                .map((k,i) => (
                                    <span key={k}>
                                      {i>0 || item.size ? ", " : ""}
                                      {{
                                        warmed:   "warmed",
                                        iceCream: "with ice‑cream",
                                        chocolate:"chocolate drizzle"
                                      }[k]}
                                    </span>
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
                        <button
                            className="edit-cart-btn material-icons"
                            title="Edit item"
                            onClick={() => openCustomizeFromCart(i)}
                          >
                            edit
                          </button>
                        <button 
                          className="cart-item-remove-btn"
                          onClick={() => handleRemove(i)}
                          title="Remove from cart"
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nothing has been added to the cart.</p>
                )}
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

        <div className="menu-category">
          <ul className="menu-list">
            {(tabState === "drinks" ? drinkItems : foodItems).map((item, idx) => (
              <li 
                key={idx}
                className="menu-item-row"
                onClick={() => openCustomize(item)}
              >
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
                  <span className="item-price">${Number(item.price).toFixed(2)}</span>
                  <span className="item-calories">{item.calories} Calories</span>
                  {/* Stock Info: based on quantity from backend */}
                  {item.quantity > 0 ? (
                    <span className="stock-status in-stock">In Stock</span>
                  ) : (
                    <span className="stock-status out-of-stock">Out of Stock</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {customizeFor && (
        <div className="customize-modal-overlay"
             onClick={()=>setCustomizeFor(null)}>
          <div className="customize-modal"
               onClick={(e)=>e.stopPropagation()}>
            <h2>Customize {customizeFor.name}</h2>

            {/* DRINK options */}
            {isDrinkItem(customizeFor) ? (
              <>
                <span className="size-title">Size</span>
                <div className="size-options modal">
                  {["Small","Medium","Large"].map((sz)=>(
                    <button 
                    key={sz}
                    className={`size-btn ${selectedSizes[k] === sz ? "selected" : ""}`}
                    onClick={() => selectSize(customizeFor, sz)}
                  >
                    {sz}
                    </button>
                  ))}
                </div>
                
                {/* Milk */}
                <div className="control-block">
                  <span className="ctrl-label">Milk</span>
                  <select
                    value={getCustom(customizeFor, true).milk}
                    onChange={e =>
                      setCustomizations(prev => ({
                        ...prev,
                        [keyOf(customizeFor)]: {
                          ...prev[keyOf(customizeFor)],
                          milk: e.target.value,
                        },
                      }))
                    }
                  >
                    {["None", "Whole", "Almond", "Oat", "Skim"].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Syrup */}
                <div className="control-block">
                  <span className="ctrl-label">Syrup</span>
                  <select
                    value={getCustom(customizeFor, true).syrup}
                    onChange={e =>
                      setCustomizations(prev => ({
                        ...prev,
                        [keyOf(customizeFor)]: {
                          ...prev[keyOf(customizeFor)],
                          syrup: e.target.value,
                        },
                      }))
                    }
                  >
                    {["None", "Vanilla", "Caramel", "Hazelnut", "Lavender"].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

              </>
            ) : (
              /* FOOD options */
              <>
                {["warmed","iceCream","chocolate"].map((key)=>(
                  <label key={key}>
                    <input type="checkbox"
                      checked={getCustom(customizeFor, false)[key]}
                      onChange={(e)=>setCustomizations((p)=>({
                        ...p,
                        [keyOf(customizeFor)]:
                        {...p[keyOf(customizeFor)], [key]: e.target.checked
                        }
                      }))}/>
                    &nbsp;{{
                      warmed:   "Warm it up",
                      iceCream: "Add ice cream",
                      chocolate:"Drizzle chocolate"
                    }[key]}
                  </label>
                ))}
              </>
            )}

            {/* quantity row */}
            <div className="quantity-row">
              <button className="qty-btn"
                      onClick={()=>setCustomQuantity((q)=>Math.max(1,q-1))}>–</button>
              <span className="qty-display">{customQuantity}</span>
              <button className="qty-btn"
                      onClick={()=>setCustomQuantity((q)=>q+1)}>+</button>
            </div>

            <div className="modal-action-row">
              <button
                className="customize-modal-btn save"
                disabled={isDrinkItem(customizeFor) && !selectedSizes[keyOf(customizeFor)]}
                onClick={handleAddToCartFromModal}
              >
                Add&nbsp;to&nbsp;Cart
              </button>

              <button
                className="customize-modal-btn cancel"
                onClick={() => setCustomizeFor(null)}
              >
                Cancel
              </button>
            </div>


          </div>
        </div>
      )}

      {popupInfo && (
        <div className="stock-cart-popup" style={{ top: popupInfo.y, left: popupInfo.x, position: "absolute" }}>
          {popupInfo.message}
        </div>
      )}
    </div>
  );
};

export default CatalogMenuPage;