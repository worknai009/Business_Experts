import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AdminProtected({ children }) {
  const adminUser = localStorage.getItem('admin_user');
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
