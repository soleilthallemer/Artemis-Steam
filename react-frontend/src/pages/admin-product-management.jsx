import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/admin-product-management.css";

const AdminProductManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();


  const [products, setProducts] = useState([]);
  const [nextId, setNextId] = useState(1);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/menu`);
      const data = await response.json();
      const formatted = data.map((item) => ({
        id: item.item_id,
        name: item.name,
        category: item.category,
        price: parseFloat(item.price),
        stock: item.quantity,
        status: item.quantity > 0 ? "In Stock" : "Out of Stock",
        image: item.image_url
      }));
      setProducts(formatted);
      if (formatted.length > 0) {
        const maxId = Math.max(...formatted.map((p) => p.id));
        setNextId(maxId + 1);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [image, setImage] = useState("");
  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");


  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };



  const handleLogout = () => {
    navigate("/admin-login");
  };



  const handleAddProduct = () => {
    setEditingProduct(null);
    setName("");
    setCategory("");
    setPrice("");
    setStock("");
    setImage("");
    setNameError("");
    setImageError("");
    setShowForm(true);
  };


  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price);
    setStock(product.stock);

    setImage(product.image);
    setNameError("");
    setImageError("");
    setShowForm(true);
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/menu/${id}`, {

          method: "DELETE",
        });
        if (response.ok) {
          setProducts((prev) => prev.filter((item) => item.id !== id));
        } else {
          console.error("Delete failed");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setNameError("");
    setImageError("");


    const nameTaken = products.some(
      (p) => p.name === name && (!editingProduct || editingProduct.id !== p.id)
    );
    if (nameTaken) {
      setNameError("Product name already exists!");
      return;
    }


    if (!editingProduct && !image) {
      setImageError("An image is required for a new product!");
      return;
    }


    const payload = {
      name,
      description: "",                    // ✅ If unused, send as empty string
      category,
      price: parseFloat(price),
      size_options: "",                   // ✅ Optional: or remove from backend
      ingredients: "",                    // ✅ Optional: or remove from backend
      image_url: image,
      availability_status: parseInt(stock, 10) > 0,
      quantity: parseInt(stock, 10),
      calories: 0,                        // ✅ Optional: hardcoded for now
      preparation_time: 0                // ✅ Optional
    };
    

    try {
      if (editingProduct) {
        const response = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/menu/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),

          
        });
        if (response.ok) {
          setProducts((prev) =>
            prev.map((item) =>

              item.id === editingProduct.id
                ? {
                    ...item,             // <- preserve old values
                    ...payload,          // <- overwrite with updated values
                    id: editingProduct.id,
                    stock,
                    status: parseInt(stock, 10) > 0 ? "In Stock" : "Out of Stock",
                    image: image         // <-- make sure image is set!
                  }
                : item
            )
          );          

        } else {
          console.error("Update failed");
        }
      } else {

        const response = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/menu`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const result = await response.json();
          const newProduct = {
            ...payload,
            id: result.item_id,
            stock,
            status: parseInt(stock, 10) > 0 ? "In Stock" : "Out of Stock"
          };
          setProducts((prev) => [...prev, newProduct]);

          setNextId((prevId) => prevId + 1);
        } else {
          console.error("Add product failed");
        }
      }
    } catch (error) {
      console.error("Error submitting product:", error);
    }

    setShowForm(false);
  };


  const closeForm = () => {
    setShowForm(false);
  };

  return (
    <div className="product-management-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          {sidebarOpen && <h1>Artemis &amp; Steam</h1>}
          <button className="close-btn" onClick={toggleSidebar}>
            {sidebarOpen ? "X" : <span className="material-icons">menu</span>}
          </button>
        </div>
        <nav className="sidebar-nav">

          <Link to="/admin-dashboard" className={`nav-item ${sidebarOpen ? "label" : ""}`}>
            <span className="material-icons">dashboard</span>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link to="/admin-user-management" className={`nav-item ${sidebarOpen ? "label" : ""}`}>
            <span className="material-icons">groups</span>
            {sidebarOpen && <span>User Management</span>}
          </Link>
          <Link to="/admin-product-management" className={`nav-item ${sidebarOpen ? "label" : ""} active`}>

            <span className="material-icons">inventory_2</span>
            {sidebarOpen && <span>Product Management</span>}
          </Link>
        </nav>
        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="material-icons">logout</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? "" : "full-width"}`}>
        <div className="product-management-header">
          <h1>Product Management</h1>
          <p>Manage your product inventory and listings.</p>
          <button className="add-product-btn" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th className="small-id">ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td className="small-id">{prod.id}</td>
                <td>
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                </td>
                <td>{prod.name}</td>
                <td>{prod.category}</td>
                <td>${prod.price.toFixed(2)}</td>
                <td>{prod.stock}</td>
                <td>

                  <span className={`stock-badge ${prod.status === "In Stock" ? "in-stock" : "out-of-stock"}`}>

                    {prod.status}
                  </span>
                </td>
                <td className="actions-cell">

                  <button className="edit-btn" onClick={() => handleEdit(prod)} title="Edit">
                    <span className="material-icons">edit</span>
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(prod.id)} title="Delete">

                    <span className="material-icons">delete</span>
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>

                <td colSpan="8" style={{ textAlign: "center", color: "#777" }}>

                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* Modal Form */}

      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="name">Product Name</label>

              <input type="text" name="name" id="name" value={name} onChange={(e) => { setNameError(""); setName(e.target.value); }} required />
              {nameError && <span className="modal-error-message">{nameError}</span>}

              <label htmlFor="category">Category</label>
              <input type="text" name="category" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />

              <label htmlFor="price">Price</label>
              <input type="number" name="price" id="price" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />

              <label htmlFor="stock">Available Stock</label>
              <input type="number" name="stock" id="stock" value={stock} onChange={(e) => setStock(e.target.value)} required />

              <label htmlFor="image">Product Image</label>
              <div className="image-edit-container">
                {image && <img src={image} alt="Preview" className="image-preview" />}
                <input type="file" name="image" id="image" accept="image/*" onChange={handleImageChange} />
              </div>
              {imageError && <span className="modal-error-message">{imageError}</span>}

              <div className="modal-actions">
                <button type="submit">{editingProduct ? "Update Product" : "Add Product"}</button>
                <button type="button" onClick={closeForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;
