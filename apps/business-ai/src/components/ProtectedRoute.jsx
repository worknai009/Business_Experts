import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if active user was suspended or deleted by Admin
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const activeUser = JSON.parse(userStr);
      const regUsersStr = localStorage.getItem('registered_users');
      if (regUsersStr && activeUser.email) {
        const regUsers = JSON.parse(regUsersStr);
        const match = regUsers.find(u => u.email.toLowerCase() === activeUser.email.toLowerCase());
        if (match && match.status === 'Suspended') {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          return <Navigate to="/login" replace />;
        }
      }
    }
  } catch (e) {
    console.warn(e);
  }

  return children;
}

export default ProtectedRoute;