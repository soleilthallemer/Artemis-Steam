// src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute
 * Wrap any route that should require authentication.
 * Redirects to /login if no user is logged in.
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Check if user is authenticated via localStorage
  const email = localStorage.getItem("user_email");
  const userId = localStorage.getItem("user_id");

  const isAuthenticated = email && userId;

  // If not authenticated, redirect to login, preserving the attempted path
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Otherwise, allow access to the protected content
  return children;
};

export default ProtectedRoute;
