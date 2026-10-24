import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Rocket, Star, Sparkles, CheckCircle2, LayoutDashboard, FileText, ShieldCheck, Zap, ArrowRight, Check } from 'lucide-react';

// Celebratory floating particles
function SuccessParticle({ index }) {
  const colors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#3b82f6'];
  const color = colors[index % colors.length];
  const randomLeft = useMemo(() => Math.random() * 90 + 5, []);
  const randomDuration = useMemo(() => 2.5 + Math.random() * 2, []);
  const randomDelay = useMemo(() => Math.random() * 1.5, []);
  const randomSize = useMemo(() => 4 + Math.random() * 5, []);

  return (
    <motion.div
      initial={{ top: '-5%', left: `${randomLeft}%`, opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        top: ['0%', '105%'],
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 0.8, 0],
        rotate: [0, 180, 360, 540]
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className="absolute pointer-events-none rounded-full"
      style={{
        width: randomSize,
        height: randomSize,
        backgroundColor: color,
        boxShadow: `0 0 6px ${color}`
      }}
    />
  );
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id') || 'cs_live_success';
  const plan = searchParams.get('plan') || 'Pro Plan';
  const amount = searchParams.get('amount') || (plan.includes('Business') ? '₹1,999' : (plan.includes('Pro') ? '₹499' : '₹0'));

  const isBusiness = plan.toLowerCase().includes('business') || plan.toLowerCase().includes('enterprise');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/60 dark:bg-[#060b17] flex items-center justify-center p-3 sm:p-5 font-sans relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-teal-500/10 dark:bg-teal-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Compact Success Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className="w-full max-w-[420px] bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-center space-y-4 relative z-10 overflow-hidden my-auto"
        style={{
          boxShadow: isBusiness
            ? '0 20px 45px -10px rgba(124, 58, 237, 0.18)'
            : '0 20px 45px -10px rgba(16, 185, 129, 0.18)'
        }}
      >
        {/* Floating Confetti */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 14 }).map((_, i) => (
            <SuccessParticle key={i} index={i} />
          ))}
        </div>

        {/* Animated VIP Tier Badge with Orbital Glow & Rotating Ray Effects */}
        <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
          {/* Outer Pulsing Aura */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.85, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute -inset-3 rounded-3xl blur-xl ${
              isBusiness
                ? 'bg-gradient-to-tr from-purple-600/50 via-pink-500/40 to-amber-500/40'
                : 'bg-gradient-to-tr from-emerald-500/50 via-teal-400/40 to-cyan-500/40'
            }`}
          />

          {/* Rotating Decorative Orbital Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-1 rounded-3xl border-2 border-dashed border-amber-400/60 dark:border-amber-300/50 pointer-events-none"
          />

          {/* Main 3D Gem Medallion Container */}
          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 20, delay: 0.05 }}
            className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl border ${
              isBusiness
                ? 'bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-500 border-purple-300/60 text-white'
                : 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 border-emerald-300/60 text-white'
            }`}
            style={{
              boxShadow: isBusiness
                ? '0 10px 25px -5px rgba(168, 85, 247, 0.5), inset 0 2px 4px rgba(255,255,255,0.4)'
                : '0 10px 25px -5px rgba(16, 185, 129, 0.5), inset 0 2px 4px rgba(255,255,255,0.4)'
            }}
          >
            {/* Center Icon: Crown for Business, Rocket for Pro */}
            {isBusiness ? (
              <motion.div
                animate={{ y: [0, -3, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Crown size={30} className="text-amber-300 drop-shadow-[0_2px_10px_rgba(251,191,36,0.7)]" strokeWidth={2.3} />
              </motion.div>
            ) : (
              <motion.div
                animate={{ y: [0, -3, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Rocket size={28} className="text-white drop-shadow-[0_2px_10px_rgba(16,185,129,0.7)]" strokeWidth={2.3} />
              </motion.div>
            )}

            {/* Bottom-right verified checkmark badge */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
              <Check size={11} strokeWidth={3.5} />
            </div>
          </motion.div>

          {/* Top-Right Floating Star Sparkle */}
          <motion.div
            animate={{ rotate: [0, 25, -25, 0], scale: [1, 1.25, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles size={18} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
          </motion.div>

          {/* Top-Left Floating Star */}
          <motion.div
            animate={{ rotate: [0, -25, 25, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            className="absolute -top-1.5 -left-1.5"
          >
            <Star size={13} className="text-amber-300 fill-amber-300 drop-shadow" />
          </motion.div>
        </div>

        {/* Header Titles */}
        <div className="space-y-1.5 px-1">
          <div>
            <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-xs ${
              isBusiness
                ? 'bg-purple-500/15 border-purple-500/35 text-purple-700 dark:text-purple-300'
                : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-700 dark:text-emerald-300'
            }`}>
              <Sparkles size={11} />
              <span>Payment Confirmed & Verified</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Welcome to <span className={isBusiness ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600 dark:text-emerald-400'}>{plan}</span>!
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-sm mx-auto">
            Your workspace has been upgraded. All premium AI models and financial intelligence are ready to use.
          </p>
        </div>

        {/* Transaction Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-50/95 dark:bg-slate-950/70 rounded-2xl p-3.5 border border-slate-200/90 dark:border-slate-800 text-left space-y-2 text-xs shadow-xs"
        >
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">Subscription Tier:</span>
            <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
              <Zap size={13} className={isBusiness ? 'text-purple-500' : 'text-emerald-500'} />
              <span>{plan}</span>
            </span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">Amount Billed:</span>
            <span className={`font-black text-xs ${isBusiness ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {amount} / month
            </span>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">Billing Cycle:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">Monthly Auto-Renewal</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">Reference ID:</span>
            <span className="font-mono font-bold text-slate-600 dark:text-slate-300 text-[10px] truncate max-w-[180px]">
              {sessionId}
            </span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/dashboard"
              className={`w-full h-11 rounded-xl text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer border-0 ${
                isBusiness
                  ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
              }`}
            >
              <LayoutDashboard size={15} />
              <span>Go to Founder Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Link
              to="/dashboard/invoices"
              className="w-full h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-200 dark:border-slate-700/60"
            >
              <FileText size={13} />
              <span>View Invoices & Receipts</span>
            </Link>
          </motion.div>
        </div>

        {/* Footer Security Notice */}
        <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-medium pt-1">
          <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Receipt logged to your billing statement history.</span>
        </div>

      </motion.div>
    </div>
  );
}
