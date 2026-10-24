import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { isAuthenticated, logout } from "../utils/auth";
import { BarChart3, History, LogOut, Search, Bot, Menu, X, Home as HomeIcon, Store, ShieldCheck, Sparkles } from "lucide-react";
import BrandMark from "./BrandMark";
import ThemeToggle from "./ThemeToggle";

// ── Ultra High-Performance GPU-Accelerated Spring Nav Hyperlink Pill (Zero Background Boxes) ──
function AnimatedNavLink({ to, href, label, icon: Icon, isActive, onClick, className = "", isPrimary = false, isGhost = false }) {
  const content = (
    <>
      {Icon && (
        <Icon
          size={15}
          className={`transition-colors duration-150 shrink-0 ${
            isActive
              ? 'text-[#047857] dark:text-emerald-400'
              : 'text-slate-500 dark:text-slate-400 group-hover:text-[#047857] dark:group-hover:text-emerald-400'
          }`}
        />
      )}
      <span className="relative">
        {label}
        {isActive && !isPrimary && !isGhost && (
          <motion.span
            layoutId="activeNavUnderline"
            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#047857] dark:bg-emerald-400 rounded-full"
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
          />
        )}
      </span>
    </>
  );

  const baseClasses = isPrimary
    ? "px-4.5 py-2 rounded-xl bg-[#047857] hover:bg-emerald-700 text-white font-black transition shadow-sm shadow-[#047857]/20 border-0 flex items-center gap-1.5 cursor-pointer text-xs"
    : isGhost
    ? "px-3.5 py-2 text-[#061c16] dark:text-white font-bold hover:text-[#047857] dark:hover:text-emerald-400 transition border-0 flex items-center gap-1.5 cursor-pointer text-xs bg-transparent"
    : `group relative px-2.5 sm:px-3 py-2 text-xs transition-colors duration-150 flex items-center gap-1.5 border-0 outline-none cursor-pointer bg-transparent ${
        isActive
          ? 'text-[#047857] dark:text-emerald-400 font-extrabold'
          : 'text-slate-700 dark:text-slate-300 hover:text-[#047857] dark:hover:text-emerald-400 font-semibold'
      } ${className}`;

  if (href) {
    return (
      <motion.div
        whileTap={{ scale: 0.94, y: 1 }}
        whileHover={{ scale: 1.04, y: -1 }}
        transition={{ type: "spring", stiffness: 450, damping: 22 }}
        className="relative inline-flex items-center select-none transform-gpu will-change-transform"
      >
        <a href={href} onClick={onClick} className={baseClasses}>
          {content}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileTap={{ scale: 0.94, y: 1 }}
      whileHover={{ scale: 1.04, y: -1 }}
      transition={{ type: "spring", stiffness: 450, damping: 22 }}
      className="relative inline-flex items-center select-none transform-gpu will-change-transform"
    >
      <Link to={to} onClick={onClick} className={baseClasses}>
        {content}
      </Link>
    </motion.div>
  );
}

// ── Animated Wrapper (for ThemeToggle) ──
function AnimatedWrapper({ children, className = "" }) {
  return (
    <motion.div
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.04, y: -1 }}
      transition={{ type: "spring", stiffness: 450, damping: 22 }}
      className={`relative inline-flex items-center select-none transform-gpu will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  });

  const isAdmin = currentUser?.email?.toLowerCase() === 'admin@businessai.com' || currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN';

  // Real-time synchronization of user profile & plan changes
  useEffect(() => {
    const syncUser = () => {
      try {
        const userStr = localStorage.getItem("user");
        setCurrentUser(userStr ? JSON.parse(userStr) : null);
      } catch (e) {}
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("user_plan_updated", syncUser);
    const interval = setInterval(syncUser, 1000);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("user_plan_updated", syncUser);
      clearInterval(interval);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  // Hide Navbar on Admin & Super Admin routes
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin')) {
    return null;
  }

  const handleGoHome = (e) => {
    setOpen(false);
    if (location.pathname === "/") {
      if (e && e.preventDefault) e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.replaceState(null, "", " ");
    }
  };

  const handleSectionClick = (e, id) => {
    setOpen(false);
    if (location.pathname === "/") {
      if (e && e.preventDefault) e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -75;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
        window.history.replaceState(null, "", `#${id}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-white/90 dark:bg-[#060b17]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div className="w-full px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 w-full">

          {/* ══ Brand Logo Hyperlink ══ */}
          <Link
            to="/"
            onClick={handleGoHome}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 select-text"
            aria-label="BusinessAI Home"
          >
            <BrandMark />
            <div className="flex flex-col text-left select-text">
              <span className="font-heading font-black text-xl sm:text-2xl tracking-tight leading-none text-[#061c16] dark:text-white select-text">
                Business<span className="text-[#047857] dark:text-emerald-400">AI</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 -mt-0.5 select-text">
                TRUSTED GROWTH ADVISOR
              </span>
            </div>
          </Link>

          {/* ══ Desktop Navigation (md+) with Generous Spacing Between Text Links ══ */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-6 shrink-0">
            {authenticated ? (
              <nav className="flex items-center gap-2.5 lg:gap-4 xl:gap-5 text-xs font-bold" aria-label="Main navigation">
                {[
                  { to: '/', label: 'Home', icon: HomeIcon, exact: true, onClick: handleGoHome },
                  { to: '/business-finder', label: 'Find Opportunities', icon: Search },
                  { to: '/franchise-directory', label: 'Franchises', icon: Store },
                  { to: '/analyze', label: 'Analysis', icon: BarChart3 },
                  { to: '/dashboard/ai-mentor', label: 'AI Mentor', icon: Bot },
                  { to: '/history', label: 'Saved', icon: History },
                ].map((item) => {
                  const isActive = item.exact ? location.pathname === '/' : location.pathname.startsWith(item.to);
                  return (
                    <AnimatedNavLink
                      key={item.to}
                      to={item.to}
                      label={item.label}
                      icon={item.icon}
                      isActive={isActive}
                      onClick={item.onClick}
                    />
                  );
                })}

                {/* Admin Console Direct Link (for Admin Accounts) */}
                {isAdmin && (
                  <a
                    href={import.meta.env.DEV ? "http://localhost:5181" : "https://admin.businessexperts.asia"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25 font-bold text-xs transition flex items-center gap-1.5 ml-1"
                  >
                    <ShieldCheck size={14} />
                    <span>Admin Panel ↗</span>
                  </a>
                )}


                {/* Theme toggle */}
                <AnimatedWrapper className="ml-1">
                  <ThemeToggle />
                </AnimatedWrapper>

                {/* Logout Button */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94, y: 1 }}
                  whileHover={{ scale: 1.04, y: -1 }}
                  transition={{ type: "spring", stiffness: 450, damping: 22 }}
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition flex items-center gap-1.5 cursor-pointer font-bold text-xs shrink-0 bg-transparent"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </motion.button>
              </nav>
            ) : (
              <nav className="flex items-center gap-3.5 lg:gap-6 xl:gap-7 text-xs font-bold" aria-label="Public navigation">
                <AnimatedNavLink to="/" label="Home" onClick={handleGoHome} isActive={location.pathname === '/' && !location.hash} />
                <AnimatedNavLink to="/franchise-directory" label="Franchises" isActive={location.pathname.startsWith('/franchise-directory')} />
                <AnimatedNavLink href="/#how-it-works" label="How It Works" onClick={(e) => handleSectionClick(e, 'how-it-works')} />
                <AnimatedNavLink href="/#opportunities" label="Opportunities" onClick={(e) => handleSectionClick(e, 'opportunities')} />
                <AnimatedNavLink href="/#features" label="Features" onClick={(e) => handleSectionClick(e, 'features')} />
                <AnimatedNavLink href="/#report" label="AI Report" onClick={(e) => handleSectionClick(e, 'report')} />
                <AnimatedNavLink href="/#pricing" label="Pricing" onClick={(e) => handleSectionClick(e, 'pricing')} />

                {/* Theme toggle */}
                <AnimatedWrapper className="ml-2">
                  <ThemeToggle />
                </AnimatedWrapper>

                {/* Sign In & Get Started Hyperlinks */}
                <div className="flex items-center gap-3 pl-3 border-l border-slate-200/50 dark:border-slate-800/50">
                  <AnimatedNavLink to="/login" label="Sign In" isGhost={true} />
                  <AnimatedNavLink to="/register" label="Get Started" isPrimary={true} />
                </div>
              </nav>
            )}
          </div>

          {/* ══ Mobile Menu Button ══ */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition cursor-pointer border-0 bg-transparent"
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* ══ Mobile Dropdown Menu with Hyperlinks ══ */}
      {open && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-[#070d19]/98 backdrop-blur-xl px-4 py-5 space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
          {authenticated ? (
            <div className="space-y-1.5 text-sm font-bold">
              {[
                { to: '/', label: 'Home', icon: HomeIcon, exact: true, onClick: handleGoHome },
                { to: '/business-finder', label: 'Find Opportunities', icon: Search },
                { to: '/franchise-directory', label: 'Franchises & Suppliers', icon: Store },
                { to: '/analyze', label: 'Feasibility Analysis', icon: BarChart3 },
                { to: '/dashboard/ai-mentor', label: 'AI Business Mentor', icon: Bot },
                { to: '/history', label: 'Saved Reports', icon: History },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={(e) => {
                    if (item.onClick) item.onClick(e);
                    else setOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl transition ${
                    (item.exact ? location.pathname === '/' : location.pathname.startsWith(item.to))
                      ? 'bg-[#047857] text-white font-black'
                      : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-black hover:bg-rose-100 transition border-0 cursor-pointer"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 text-sm font-bold">
              <Link to="/" onClick={handleGoHome} className="block px-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition">
                Home
              </Link>
              <Link to="/franchise-directory" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition">
                Franchise Directory
              </Link>
              <a href="/#how-it-works" onClick={(e) => handleSectionClick(e, 'how-it-works')} className="block px-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition">
                How It Works
              </a>
              <a href="/#opportunities" onClick={(e) => handleSectionClick(e, 'opportunities')} className="block px-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition">
                Opportunities
              </a>
              <a href="/#features" onClick={(e) => handleSectionClick(e, 'features')} className="block px-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition">
                Features
              </a>
              <a href="/#report" onClick={(e) => handleSectionClick(e, 'report')} className="block px-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition">
                AI Report
              </a>
              <a href="/#pricing" onClick={(e) => handleSectionClick(e, 'pricing')} className="block px-4 py-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition">
                Pricing
              </a>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-center block"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#047857] text-white font-black shadow-lg shadow-[#047857]/20 border-0 text-center block"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
