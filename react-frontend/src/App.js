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
import EmployeeDashboard from './pages/employee-dashboard';
import EmployeeProfile from './pages/employee-profile';
import AdminLogin from './pages/admin-login';
import AdminDashboard from './pages/admin-dashboard';
import AdminProductManagement from './pages/admin-product-management';
import AdminUserManagement from './pages/admin-user-management';
import ReviewPage from './pages/review-page';
import AdminAnalytics from './pages/admin-analytics';
import AdminMessageCenter from './pages/admin-message-center';
import ContactUs from './pages/contact-us';
import ProtectedRoute from './components/ProtectedRoute';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/login" element={<Login/>} />
        <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
        <Route path="/registration-page" element={<Registration/>} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<Order />} />
        <Route path="/soleil" element={<Soleil />} />
        <Route path="/bliss" element={<Bliss />} />
        <Route path="/jocelyn" element={<Jocelyn />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee-profile" element={<EmployeeProfile />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-product-management" element={<AdminProductManagement />} />
        <Route path="/admin-user-management" element={<AdminUserManagement />} />
        <Route
  path="/review-page"
  element={
    <ProtectedRoute>
      <ReviewPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/contact"
  element={
    <ProtectedRoute>
      <ContactUs />
    </ProtectedRoute>
  }
/>
        <Route path="/admin-analytics" element={<AdminAnalytics />} />
        <Route path="/admin-message-center" element={<AdminMessageCenter />} />
        <Route path='*' element={<div>404 - Page Not Found</div>} />
      </Routes> 
  );
  console.log('API IP: ', process.env.REACT_APP_API_IP);
}

export default App;