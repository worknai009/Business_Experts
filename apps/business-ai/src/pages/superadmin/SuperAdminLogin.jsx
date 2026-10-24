import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { superAdminLogin } from '../../utils/panelAuth';
import BrandMark from '../../components/BrandMark';

export default function SuperAdminLogin() {
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
      setError('Please fill in both Super Admin ID and master secret.');
      return;
    }

    setIsSubmitting(true);

    try {
      await superAdminLogin(email.trim().toLowerCase(), password);

      setIsSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        navigate('/super-admin', { replace: true });
      }, 500);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Authentication failed.');
    }
  };

  return (
    <div className="super-admin-scope min-h-screen bg-[#04060c] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">

      {/* Red/Rose Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-rose-600/25 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[460px]">

        {/* Main Login Card - Permanent Dark Surface */}
        <div className="bg-[#05070d]/95 p-7 sm:p-8 rounded-3xl border border-rose-500/30 shadow-[0_20px_60px_rgba(225,29,72,0.25)] space-y-6">

          {/* Brand & Header with BrandMark Logo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2.5">
                <BrandMark size={30} />
                <span className="text-lg font-black tracking-tight text-white">
                  Business<span className="text-rose-400">AI</span>
                </span>
              </Link>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-black uppercase tracking-widest">
                MASTER ACCESS
              </span>
            </div>

            <div className="space-y-1 pt-2">
              <h1 className="text-2xl font-black tracking-tight text-white">
                Super Admin Command Center
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your Tier-0 Master Super Admin credentials manually to unlock control.
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-2xl flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
              <span>Master Token Verified. Granting Tier-0 access...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4" autoComplete="new-password">
            <input type="text" name="prevent_autofill_super_email" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
            <input type="password" name="prevent_autofill_super_pass" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-rose-300 block">
                SUPER ADMIN EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-rose-400" size={17} />
                <input
                  type="email"
                  name="superadmin_login_email_manual"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#03050a] border border-rose-950 focus:border-rose-500 rounded-2xl pl-11 pr-4 h-11 text-xs text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-rose-500/25 font-semibold"
                  placeholder="e.g. AdminAI@gmail.com"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-rose-300 block">
                MASTER SECRET PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-rose-400" size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="superadmin_login_password_manual"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#03050a] border border-rose-950 focus:border-rose-500 rounded-2xl pl-11 pr-11 h-11 text-xs text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-rose-500/25 font-semibold"
                  placeholder="••••••••••"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-rose-400 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Primary Crimson Button */}
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full bg-gradient-to-r from-rose-600 via-red-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-extrabold h-12 rounded-2xl transition-all shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 flex items-center justify-center gap-2 text-xs disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-white font-bold">Verifying Master Credentials...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 size={16} className="text-white" />
                  <span className="text-white font-bold">Access Granted — Redirecting...</span>
                </>
              ) : (
                <>
                  <span className="text-white font-extrabold text-sm">Sign in to Super Admin Portal</span>
                  <ArrowRight size={16} className="text-white" />
                </>
              )}
            </button>
          </form>

          {/* Security & Back Footer */}
          <div className="pt-2 text-center space-y-2 border-t border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1.5">
              <span>🔒 Encrypted Tier-0 Access Control</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-0.5">
              <Link to="/" className="text-slate-400 hover:text-rose-400 transition flex items-center gap-1 font-semibold">
                <ArrowLeft size={14} /> Back to Website
              </Link>
              <Link to="/admin/login" className="text-rose-400 hover:underline font-bold">
                Admin Console ↗
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
