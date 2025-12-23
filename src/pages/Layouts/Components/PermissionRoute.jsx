/*
SCREENSHOT: Report 2 — Role & Permission
File: src/pages/Layouts/Components/PermissionRoute.jsx
Purpose: Route enforcement logic. Capture this snippet to show how
permissions are enforced at the routing layer.
*/

import React from 'react';
import { Navigate } from 'react-router-dom';
import { hasPermission, isAdmin } from '../../../Utils/Helpers/AuthHelpers';

/**
 * PermissionRoute - protects routes based on user permissions
 * @param {string} requiredPermission - permission key to check (e.g., 'manage_users')
 * @param {JSX.Element} children - component to render if authorized
 */
const PermissionRoute = ({ requiredPermission, children }) => {
  if (!requiredPermission || isAdmin()) {
    // If no permission required or user is admin, allow access
    return children;
  }

  if (hasPermission(requiredPermission)) {
    return children;
  }

  // If not authorized, redirect to admin dashboard
  return <Navigate to="/admin/dashboard" />;
};

export default PermissionRoute;
