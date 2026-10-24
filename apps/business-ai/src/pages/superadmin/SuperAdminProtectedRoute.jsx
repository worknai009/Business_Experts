import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSuperAdminToken, verifyPanelAccess, superAdminLogout } from '../../utils/panelAuth';

export default function SuperAdminProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let active = true;

    // Sirf SUPER_ADMIN — plain ADMIN yahan se bhi bahar hi rahega.
    verifyPanelAccess(getSuperAdminToken(), ['SUPER_ADMIN']).then((ok) => {
      if (!active) return;
      if (!ok) superAdminLogout();
      setStatus(ok ? 'allowed' : 'denied');
    });

    return () => { active = false; };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center gap-3 text-rose-300/70 text-sm font-bold">
          <div className="w-4 h-4 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
          Verifying super admin session…
        </div>
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/super-admin/login" replace />;
  }

  return children;
}
