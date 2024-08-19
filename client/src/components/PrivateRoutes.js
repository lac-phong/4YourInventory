import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (currentUser.emailVerified === false) {
    // Redirect to the verify-email page if email is not verified
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  // If authenticated and email verified, render the protected route
  return <Outlet />;
};

export default PrivateRoute;