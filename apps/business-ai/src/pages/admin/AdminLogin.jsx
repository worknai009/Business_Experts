import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { adminLogin } from '../../utils/panelAuth';
import BrandMark from '../../components/BrandMark';
import ThemeToggle from '../../components/ThemeToggle';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
    const timer = setTimeout(() => {
      setEmail('');
      setPassword('');
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both Admin email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      await adminLogin(email.trim().toLowerCase(), password);

      setIsSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        navigate('/admin', { replace: true });
      }, 500);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 light:bg-slate-100 text-slate-100 light:text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans transition-colors duration-200">

      {/* Top Header Bar with Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-3">
        <ThemeToggle />
      </div>

      {/* Ambient Soft Green Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 light:bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />

      <div className="relative z-10 w-full max-w-[440px]">

        {/* Main Login Card */}
        <div className="bg-slate-900/95 light:bg-white border border-slate-800 light:border-slate-200 p-7 sm:p-8 rounded-3xl shadow-2xl space-y-6 transition-all duration-200">

          {/* Logo & Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2.5">
                <BrandMark size={30} />
                <span className="text-lg font-black tracking-tight text-white light:text-slate-900">
                  Business<span className="text-emerald-400 light:text-emerald-600">AI</span>
                </span>
              </Link>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 light:bg-emerald-50 border border-emerald-500/25 light:border-emerald-200 text-emerald-400 light:text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest">
                ADMIN PORTAL
              </span>
            </div>

            <div className="space-y-1 pt-2">
              <h1 className="text-2xl font-black tracking-tight text-white light:text-slate-900">
                Welcome back, Administrator
              </h1>
              <p className="text-xs text-slate-400 light:text-slate-600 leading-relaxed">
                Sign in to access your BusinessAI administration console.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 light:text-rose-700 text-xs font-semibold rounded-2xl flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-400 light:text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 light:text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400 light:text-emerald-600" />
              <span>Authentication successful. Redirecting to Admin Console...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4" autoComplete="new-password">
            <input type="text" name="prevent_autofill_admin_email" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
            <input type="password" name="prevent_autofill_admin_pass" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300 light:text-slate-700 block">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-emerald-400 light:text-emerald-600" size={17} />
                <input
                  type="email"
                  name="admin_login_email_manual"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 focus:border-emerald-500 light:focus:border-emerald-600 rounded-2xl pl-11 pr-4 h-11 text-xs text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-emerald-500/25"
                  placeholder="admin@businessai.com"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300 light:text-slate-700 block">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-emerald-400 light:text-emerald-600" size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="admin_login_password_manual"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 light:bg-slate-50 border border-slate-800 light:border-slate-300 focus:border-emerald-500 light:focus:border-emerald-600 rounded-2xl pl-11 pr-11 h-11 text-xs text-white light:text-slate-900 placeholder-slate-500 light:placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-emerald-500/25"
                  placeholder="••••••••••"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 light:text-slate-500 hover:text-emerald-400 light:hover:text-emerald-600 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Primary Button */}
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 !text-white font-extrabold h-12 rounded-2xl transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 text-xs disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="!text-white font-bold">Verifying Admin Credentials...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 size={16} className="!text-white" />
                  <span className="!text-white font-bold">Verified — Redirecting...</span>
                </>
              ) : (
                <>
                  <span className="!text-white font-extrabold text-sm">Sign in to Admin Console</span>
                  <ArrowRight size={16} className="!text-white" />
                </>
              )}
            </button>
          </form>



          {/* Security & Back Footer */}
          <div className="pt-2 text-center space-y-2 border-t border-slate-800 light:border-slate-200">
            <div className="text-[11px] font-bold text-slate-400 light:text-slate-600 flex items-center justify-center gap-1.5">
              <span>🔒 Protected Admin Console Environment</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-0.5">
              <Link to="/" className="text-slate-400 light:text-slate-600 hover:text-emerald-400 light:hover:text-emerald-600 transition flex items-center gap-1 font-semibold">
                <ArrowLeft size={14} /> Back to Website
              </Link>
              <Link to="/super-admin/login" className="text-emerald-400 light:text-emerald-700 hover:underline font-bold">
                Super Admin Login ↗
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
