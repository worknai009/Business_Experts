import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Calculator,
  MessageSquare,
  TrendingUp,
  CreditCard,
  Settings,
  Bell,
  LogOut,
  Sparkles,
  Search,
  Zap,
  ArrowRight,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import BrandMark from '../components/BrandMark';
import ThemeToggle from '../components/ThemeToggle';
import { logout } from '../utils/auth';
import { formatDisplayName } from '../utils/nameFormatter';

const menuItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/history', label: 'Saved Reports', icon: FileText },
  { path: '/dashboard/calculator', label: 'ROI Calculator', icon: Calculator },
  { path: '/dashboard/ai-mentor', label: 'AI Mentor Chat', icon: MessageSquare },
  { path: '/dashboard/market-insights', label: 'Market Insights', icon: TrendingUp },
  { path: '/dashboard/invoices', label: 'Billing & Invoices', icon: CreditCard },
  { path: '/dashboard/settings', label: 'Account Settings', icon: Settings },
];

export default function DashboardLayout({ children, title = "Dashboard" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{"fullName": "Entrepreneur", "email": "user@example.com"}');

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Lock scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const em = user.email || '';
  const cleanName = formatDisplayName(user.fullName || user.name || em);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060b17] text-[#0f172a] dark:text-slate-100 flex flex-col md:flex-row antialiased transition-colors duration-200">

      {/* ══ Mobile backdrop ══ */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        />
      )}

      {/* ══ Sidebar ══ */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[82%] max-w-[300px] overflow-y-auto
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:w-64 md:max-w-none md:z-auto md:overflow-visible
          bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80
          flex flex-col justify-between shrink-0 shadow-sm
        `}
      >
        <div className="p-4 sm:p-5">

          {/* Brand + mobile close button */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-3 px-2 py-1 group">
              <BrandMark size={32} />
              <div>
                <span className="text-lg font-black text-[#0f172a] dark:text-white tracking-tight flex items-center gap-1">
                  Business<span className="text-emerald-600 dark:text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block -mt-1">
                  FOUNDER HUB
                </span>
              </div>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="md:hidden p-2 -mr-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Dashboard navigation">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/history' && location.pathname === '/dashboard/reports');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-3 md:py-2.5 rounded-xl text-sm md:text-xs font-bold transition duration-150 ${
                    isActive
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 shadow-md shadow-emerald-500/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#0f172a] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <Icon size={17} className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Upgrade Plan Promo & User Profile Footer */}
        <div className="p-4 space-y-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <Zap size={13} className="text-amber-500" /> PRO PLAN ACTIVE
              </span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/30">
                UNLIMITED
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Unlock multi-city comparative reports &amp; priority AI mentor response time.
            </p>
            <Link
              to="/subscription"
              style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
              className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-md transition border-0 cursor-pointer"
            >
              Manage Plan <ArrowRight size={13} color="#ffffff" />
            </Link>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800/80 px-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                {cleanName[0].toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-[#0f172a] dark:text-white truncate">{cleanName}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{em || 'user@example.com'}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-900 transition cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

      </aside>

      {/* ══ Main Content Area ══ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar - Compact & Clean */}
        <header className="h-14 sm:h-15 bg-white/95 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800/80 px-3 sm:px-6 flex items-center justify-between gap-2 backdrop-blur-md sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden p-1.5 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition shrink-0 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <h1 className="text-sm sm:text-base font-black text-[#0f172a] dark:text-white tracking-tight truncate">{title}</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <ThemeToggle />

            {/* Go Back button - leads to analysis page */}
            <Link
              to="/analyze"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 text-xs font-bold transition cursor-pointer shadow-xs"
              title="Go Back to Analysis"
            >
              <ArrowLeft size={13} className="text-slate-500 dark:text-slate-400" />
              <span>Go Back</span>
            </Link>
          </div>
        </header>

        {/* Page Body Container - Reduced Head Space */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-7xl mx-auto min-w-0">
          {children}
        </main>
      </div>

    </div>
  );
}
