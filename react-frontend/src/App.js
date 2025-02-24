import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/index'; // Adjust import paths
import AboutUs from './pages/about-us';
import Menu from './pages/menu';
import Order from './pages/order';
import Paloma from './pages/paloma';
import Soleil from './pages/soleil';
import Bliss from './pages/bliss';
import Jocelyn from './pages/jocelyn';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <div> {/* Or <React.Fragment> */}
      <nav>
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
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<Order />} />
        <Route path="/paloma" element={<Paloma />} />
        <Route path="/soleil" element={<Soleil />} />
        <Route path="/bliss" element={<Bliss />} />
        <Route path="/jocelyn" element={<Jocelyn />} />
        <Route path='*' element={<div>404 - Page Not Found</div>} />
      </Routes> 
    </div>
  );
}

export default App;