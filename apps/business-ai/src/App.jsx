import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BusinessFinder from "./pages/BusinessFinder";
import OpportunityDetail from "./pages/OpportunityDetail";
import Analyze from "./pages/Analyze";
import History from "./pages/History";
import FranchiseDirectory from "./pages/FranchiseDirectory";
import Notifications from "./pages/Notifications";
import Subscription from "./pages/Subscription";
import PaymentSuccess from "./pages/PaymentSuccess";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import DashboardHome from "./pages/dashboard/DashboardHome";
import Calculator from "./pages/dashboard/Calculator";
import AIMentor from "./pages/dashboard/AIMentor";
import MarketInsights from "./pages/dashboard/MarketInsights";
import Invoices from "./pages/dashboard/Invoices";
import Settings from "./pages/dashboard/Settings";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLandingPageManager from "./pages/admin/AdminLandingPageManager";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";
import SuperAdminLogin from "./pages/superadmin/SuperAdminLogin";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import SuperAdminProtectedRoute from "./pages/superadmin/SuperAdminProtectedRoute";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import DashboardLayout from "./layouts/DashboardLayout";
import ScrollToTop from "./components/ScrollToTop";
import PlanUpgradeModal from "./components/PlanUpgradeModal";

import { useEffect, useState } from "react";
import { getSubdomain } from "./utils/subdomain";
import { useActiveUserTracker } from "./hooks/useActiveUserTracker";

function App() {
  const location = useLocation();
  const [upgradeCelebration, setUpgradeCelebration] = useState({ isOpen: false, plan: '', userName: '' });

  // Track this tab as an active user (heartbeat every 30 s)
  useActiveUserTracker();

  const isDashboardOrAdminRoute =
    location.pathname.startsWith('/dashboard') ||
    location.pathname === '/history' ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/super-admin');

  // Global Session Guard & Live Plan Upgrade Detector
  useEffect(() => {
    let isChecking = false;

    const applyPlanUpdate = (newPlan, fullName) => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const currentUser = JSON.parse(userStr);
        if (!currentUser || !currentUser.email) return;

        const previousPlan = currentUser.plan || 'Free';
        if (newPlan && newPlan !== previousPlan) {
          const updatedUser = {
            ...currentUser,
            plan: newPlan,
            fullName: fullName || currentUser.fullName
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.dispatchEvent(new CustomEvent('user_plan_updated', { detail: newPlan }));

          if (newPlan !== 'Free') {
            setUpgradeCelebration({
              isOpen: true,
              plan: newPlan,
              userName: fullName || currentUser.fullName || ''
            });
          }
        }
      } catch (_) {}
    };

    const verifyActiveSession = async () => {
      if (isChecking) return;
      isChecking = true;

      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          isChecking = false;
          return;
        }
        const currentUser = JSON.parse(userStr);
        if (!currentUser || !currentUser.email) {
          isChecking = false;
          return;
        }

        const emailLower = currentUser.email.toLowerCase();

        // Skip check for Master Admin accounts
        if (emailLower === 'admin@businessai.com' || emailLower === 'superadmin@businessai.com') {
          isChecking = false;
          return;
        }

        // 1. Verify with live backend database
        if (token) {
          try {
            const res = await fetch('/api/auth/me', {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
              const data = await res.json();
              if (data.status === 'Suspended') {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                if (window.location.pathname !== '/login') {
                  window.location.href = '/login';
                }
                isChecking = false;
                return;
              }

              const currentBackendPlan = data.plan || 'Free';
              applyPlanUpdate(currentBackendPlan, data.fullName);
            }
          } catch (_) {}
        }
      } catch (e) {
        console.warn("Session verification warning:", e);
      } finally {
        isChecking = false;
      }
    };

    verifyActiveSession();

    // Cross-tab broadcast channel for 0ms instant trigger
    let bc = null;
    try {
      bc = new BroadcastChannel('businessai_plan_sync');
      bc.onmessage = (event) => {
        if (event.data?.email && event.data?.plan) {
          try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
              const u = JSON.parse(userStr);
              if (u.email?.toLowerCase() === event.data.email.toLowerCase()) {
                applyPlanUpdate(event.data.plan, u.fullName);
              }
            }
          } catch (_) {}
        }
      };
    } catch (_) {}

    // Focus & Visibility triggers for instantaneous sync on tab switch
    const handleVisibility = () => {
      if (!document.hidden) verifyActiveSession();
    };
    const handleFocus = () => verifyActiveSession();

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    // Steady 1200ms background interval (no flooding)
    const interval = setInterval(verifyActiveSession, 1200);

    return () => {
      if (bc) {
        try { bc.close(); } catch (_) {}
      }
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <PlanUpgradeModal
        isOpen={upgradeCelebration.isOpen}
        plan={upgradeCelebration.plan}
        userName={upgradeCelebration.userName}
        onClose={() => setUpgradeCelebration(prev => ({ ...prev, isOpen: false }))}
      />
      {!isDashboardOrAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Public & User Opportunity Search & Analysis */}
        <Route path="/business-finder" element={<BusinessFinder />} />
        <Route path="/business-finder/:id" element={<OpportunityDetail />} />
        <Route path="/franchise-directory" element={<FranchiseDirectory />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <DashboardLayout title="Saved & Generated Feasibility Reports">
                <History />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* User Dashboard Routes wrapped in DashboardLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout title="Founder Overview & Feasibility Hub">
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/calculator"
          element={
            <ProtectedRoute>
              <DashboardLayout title="Business ROI & Cost Calculator">
                <Calculator />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/ai-mentor"
          element={
            <ProtectedRoute>
              <DashboardLayout title="AI Business Mentor & Advisory Chat">
                <AIMentor />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/insights"
          element={
            <ProtectedRoute>
              <DashboardLayout title="City Demand Radar & Market Intelligence">
                <MarketInsights />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/market-insights"
          element={
            <ProtectedRoute>
              <DashboardLayout title="City Demand Radar & Market Intelligence">
                <MarketInsights />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/invoices"
          element={
            <ProtectedRoute>
              <DashboardLayout title="Billing History & Active Subscriptions">
                <Invoices />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout title="Account & Security Settings">
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Notifications & Subscriptions */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          }
        />

        {/* Admin Console Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/landing-page"
          element={
            <AdminProtectedRoute>
              <AdminLandingPageManager />
            </AdminProtectedRoute>
          }
        />

        {/* Super Admin Console Routes */}
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />
        <Route
          path="/super-admin"
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminDashboard />
            </SuperAdminProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;
