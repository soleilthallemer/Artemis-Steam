import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/index'; // Adjust import paths
import AboutUs from './pages/about-us';
import Menu from './pages/menu';
import Order from './pages/order';
import Login from './pages/login';
import Registration from './pages/registration';
import Profile from './pages/profile';
import Soleil from './pages/soleil';
import Bliss from './pages/bliss';
import Jocelyn from './pages/jocelyn';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/registration-page" element={<Registration/>} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<Order />} />
        <Route path="/soleil" element={<Soleil />} />
        <Route path="/bliss" element={<Bliss />} />
        <Route path="/jocelyn" element={<Jocelyn />} />
        <Route path='*' element={<div>404 - Page Not Found</div>} />
      </Routes> 
  );
}

export default App;