import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import CatalogMenuPage from "./components/CatalogMenuPage";
import LoginPage from "./components/LoginPage"; // Import LoginPage if available
import RegistrationPage from "./components/RegistrationPage";
import OrderPage from "./components/OrderPage";
import AboutUsPage from "./components/AboutUsPage"; // Import AboutUs
import ProfilePage from "./components/ProfilePage";
import Jocelyn from './components/jocelyn';
import Soleil from './components/soleil';
import Bliss from './components/bliss';
import Paloma from './components/paloma';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<CatalogMenuPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />  {/* Example additional route */}
        <Route path="/order" element={<OrderPage />} />
        <Route path="/login" element={<LoginPage />} />  {/* Example additional route */}
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
