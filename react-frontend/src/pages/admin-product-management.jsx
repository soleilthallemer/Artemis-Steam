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
      const response = await fetch("http://157.245.80.36:5000/menu");
      const data = await response.json();
      const formatted = data.map((item) => ({
        id: item.item_id,
        name: item.name,
        category: item.category,
        price: parseFloat(item.price),
        stock: item.availability_status ? 20 : 0,
        status: item.availability_status ? "In Stock" : "Out of Stock",
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
        const response = await fetch(`http://157.245.80.36:5000/menu/${id}`, {
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
      description: "",
      category,
      price: parseFloat(price),
      size_options: "",
      ingredients: "",
      image_url: image,
      availability_status: parseInt(stock, 10) > 0,
      calories: 0,
      preparation_time: 0
    };

    try {
      if (editingProduct) {
        const response = await fetch(`http://157.245.80.36:5000/menu/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          setProducts((prev) =>
            prev.map((item) =>
              item.id === editingProduct.id ? { ...payload, id: editingProduct.id, stock, status: parseInt(stock, 10) > 0 ? "In Stock" : "Out of Stock" } : item
            )
          );
        } else {
          console.error("Update failed");
        }
      } else {
        const response = await fetch("http://157.245.80.36:5000/menu", {
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

  return <></>; // Keep your actual JSX from earlier implementation
};

export default AdminProductManagement;
