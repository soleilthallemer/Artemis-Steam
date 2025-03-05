// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import CatalogMenuPage from "./pages/menu";
import AboutUsPage from "./pages/about-us";
import OrderPage from "./pages/order";
import LoginPage from "./pages/login";
import RegistrationPage from "./pages/registration";
import ProfilePage from "./pages/profile";
import Jocelyn from "./pages/jocelyn";
import Soleil from "./pages/soleil";
import Bliss from "./pages/bliss";
import Paloma from "./pages/paloma";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<CatalogMenuPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/jocelyn" element={<Jocelyn />} />
          <Route path="/soleil" element={<Soleil />} />
          <Route path="/bliss" element={<Bliss />} />
          <Route path="/paloma" element={<Paloma />} />
        </Routes>
    </Router>
  );
}

export default App;
