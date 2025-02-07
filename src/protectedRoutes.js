import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useTokenValidation } from './utils/tokenValidation'

const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage

  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }
  useTokenValidation();
  return <Outlet />;
};

export default ProtectedRoute;
