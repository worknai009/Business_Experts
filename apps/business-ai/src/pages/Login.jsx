import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LockKeyhole, Mail, ArrowRight,
  AlertCircle, Sparkles, CheckCircle2,
  BarChart3
} from "lucide-react";
import BrandMark from "../components/BrandMark";
import { formatDisplayName } from "../utils/nameFormatter";

function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem("businessai_registered_users");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveRegisteredUser(newUser) {
  const users = getRegisteredUsers();
  users.push(newUser);
  localStorage.setItem("businessai_registered_users", JSON.stringify(users));
}

export function Login() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.registeredEmail || "");
  const [password, setPassword] = useState("");
  const [successInfo, setSuccessInfo] = useState(location.state?.successMessage || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessInfo("");

    const inputEmail = email.trim();
    const inputPass = password.trim();

    if (!inputEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!inputPass) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputEmail, password: inputPass })
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError("Invalid email or password. Please verify your credentials.");
        } else {
          const errText = await res.text().catch(() => "");
          setError(errText || "Authentication failed. Please check your credentials.");
        }
        setLoading(false);
        return;
      }

      const authData = await res.json();
      const cleanFormattedName = formatDisplayName(authData.fullName || inputEmail);

      const userObj = {
        email: authData.email || inputEmail,
        fullName: cleanFormattedName,
        role: authData.role || "USER"
      };

      localStorage.setItem("token", authData.token);
      localStorage.setItem("user", JSON.stringify(userObj));
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (err) {
      setError("Cannot reach backend server. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#070d19] text-[#0f172a] dark:text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans antialiased relative overflow-hidden transition-colors duration-200">
      
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Showcase Copy */}
        <div className="space-y-6 text-left hidden md:block">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" /> AI BUSINESS INTELLIGENCE
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-[#0f172a] dark:text-white tracking-tight leading-tight">
            Turn business ideas into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700">better decisions.</span>
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Analyze demand, competition, investment, profitability and growth potential from one intelligent workspace.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <BarChart3 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#0f172a] dark:text-white">Deep Analysis</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Financial + market signals</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#0f172a] dark:text-white">Saved History</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Keep reports organized</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Auth Card Form - Clean & Smooth */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-emerald-950/10 dark:shadow-emerald-950/40 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-sm">
              <BrandMark size={36} />
            </div>
            <h2 className="text-2xl font-black text-[#0f172a] dark:text-white">Welcome Back</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">Sign in to access your saved feasibility reports.</p>
          </div>

          {successInfo && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5 text-left shadow-sm">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successInfo}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="new-password">
            {/* Dummy hidden inputs to intercept Chrome password manager autofill */}
            <input type="text" name="prevent_autofill_email" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
            <input type="password" name="prevent_autofill_pass" style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />

            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  name="login_user_email_manual"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  autoComplete="off"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0f172a] dark:text-white text-sm font-medium focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">Password</label>
              <div className="relative">
                <LockKeyhole size={16} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="password"
                  name="login_user_password_manual"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0f172a] dark:text-white text-sm font-medium focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-2 text-left">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#047857', color: '#ffffff' }}
              className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-700/30 transition cursor-pointer border-0"
            >
              {loading ? "Signing in…" : <>Sign In <ArrowRight size={16} color="#ffffff" strokeWidth={2.5} /></>}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="font-black text-emerald-700 dark:text-emerald-400 hover:underline">
              Create account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
