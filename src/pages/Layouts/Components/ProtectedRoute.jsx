/*
SCREENSHOT: Report 2 — Role & Permission
File: src/pages/Layouts/Components/ProtectedRoute.jsx
Purpose: Simple auth gate used alongside PermissionRoute. Capture to
show redirect behavior for unauthenticated users.
*/

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Simple authentication check 
  const user = localStorage.getItem('user');

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
