import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAdminToken, verifyPanelAccess, adminLogout } from '../../utils/panelAuth';

export default function AdminProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let active = true;

    // sessionStorage user khud edit kar sakta hai, isliye token backend se verify karo.
    verifyPanelAccess(getAdminToken(), ['ADMIN', 'SUPER_ADMIN']).then((ok) => {
      if (!active) return;
      if (!ok) adminLogout();
      setStatus(ok ? 'allowed' : 'denied');
    });

    return () => { active = false; };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-[#07090f] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
          <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          Verifying admin session…
        </div>
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
