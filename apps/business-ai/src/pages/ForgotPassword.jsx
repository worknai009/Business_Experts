import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, Sparkles } from "lucide-react";
import api from "../services/api";
import BrandMark from "../components/BrandMark";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.message || "If that email is registered, a password reset link has been sent.");
      setEmail("");
    } catch (err) {
      setMessage("If that email is registered, a password reset link has been sent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#070d19] text-[#0f172a] dark:text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans antialiased relative overflow-hidden transition-colors duration-200">
      
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-emerald-950/10 dark:shadow-emerald-950/40 space-y-6 relative z-10 text-left">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-sm mb-4">
            <BrandMark size={36} />
          </div>
          <h2 className="text-2xl font-black text-[#0f172a] dark:text-white">Reset Password</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">Enter your email to receive a password reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0f172a] dark:text-white text-sm font-medium focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                required
              />
            </div>
          </div>

          {message && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs text-center font-bold">
              {message}
            </div>
          )}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs text-center font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            style={{ backgroundColor: '#047857', color: '#ffffff' }}
            className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-700/30 transition cursor-pointer border-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending link…" : <>Send Reset Link <ArrowRight size={16} color="#ffffff" strokeWidth={2.5} /></>}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
          Remember your password?{" "}
          <Link to="/login" className="font-black text-emerald-700 dark:text-emerald-400 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
