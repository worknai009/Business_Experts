import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  Crown,
  Zap,
  Star,
  ArrowRight,
  X,
  FileText,
  Bot,
  TrendingUp,
  ShieldCheck,
  Building2,
  Award
} from "lucide-react";

const PLAN_CONFIGS = {
  "Pro Plan": {
    badge: "PRO PLAN ACTIVATED",
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    bgGlow: "rgba(16, 185, 129, 0.22)",
    borderLight: "rgba(16, 185, 129, 0.45)",
    icon: Zap,
    color: "#059669",
    darkColor: "#34d399",
    features: [
      { icon: Zap, title: "Unlimited AI Feasibility Scans" },
      { icon: Bot, title: "24/7 AI Business Mentor" },
      { icon: FileText, title: "Bank-Ready PDF Pitch Decks" },
      { icon: TrendingUp, title: "Multi-Opportunity Comparison" }
    ]
  },
  "Business Plan": {
    badge: "BUSINESS PLAN ACTIVATED",
    gradient: "from-indigo-600 via-purple-600 to-pink-600",
    bgGlow: "rgba(124, 58, 237, 0.22)",
    borderLight: "rgba(124, 58, 237, 0.45)",
    icon: Crown,
    color: "#7c3aed",
    darkColor: "#a78bfa",
    features: [
      { icon: Crown, title: "Everything in Pro Suite" },
      { icon: Bot, title: "Up to 10 Team Seats" },
      { icon: FileText, title: "White-Labelled PDF Reports" },
      { icon: TrendingUp, title: "Direct API & Priority Compute" }
    ]
  }
};

// Compact celebratory confetti generator
function ConfettiParticle({ index }) {
  const colors = ["#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"];
  const randomColor = colors[index % colors.length];
  const randomLeft = useMemo(() => Math.random() * 92 + 4, []);
  const randomDuration = useMemo(() => 2.2 + Math.random() * 1.8, []);
  const randomDelay = useMemo(() => Math.random() * 1.2, []);
  const randomSize = useMemo(() => 4 + Math.random() * 5, []);

  return (
    <motion.div
      initial={{
        top: "-10%",
        left: `${randomLeft}%`,
        opacity: 0,
        scale: 0,
        rotate: 0
      }}
      animate={{
        top: ["0%", "105%"],
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 0.8, 0],
        rotate: [0, 180, 360, 540]
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute pointer-events-none rounded-full"
      style={{
        width: randomSize,
        height: randomSize,
        backgroundColor: randomColor,
        boxShadow: `0 0 6px ${randomColor}`
      }}
    />
  );
}

export default function PlanUpgradeModal({ isOpen, plan, userName, onClose }) {
  if (!isOpen || !plan) return null;

  const normalizedPlan =
    plan.toLowerCase().includes("business") || plan.toLowerCase().includes("enterprise")
      ? "Business Plan"
      : "Pro Plan";

  const config = PLAN_CONFIGS[normalizedPlan] || PLAN_CONFIGS["Pro Plan"];
  const PlanIcon = config.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-sm transition-opacity"
        />

        {/* Compact Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="relative w-full max-w-[390px] rounded-2xl bg-white dark:bg-[#0b1329] border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden z-10 text-left my-auto"
          style={{
            boxShadow: `0 20px 45px -10px ${config.bgGlow}, 0 0 0 1px rgba(255,255,255,0.08)`
          }}
        >
          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <ConfettiParticle key={i} index={i} />
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition cursor-pointer border border-slate-200 dark:border-slate-700/60"
            aria-label="Close"
          >
            <X size={14} />
          </button>

          <div className="p-4 sm:p-5 space-y-3.5 relative z-10 text-center">
            {/* Animated Celebration Badge Icon with Pulsing Rings */}
            <div className="relative inline-flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.75, 0.35] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-2 rounded-2xl blur-md"
                style={{ background: config.bgGlow }}
              />

              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 22, delay: 0.05 }}
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border bg-gradient-to-tr ${config.gradient} border-white/20 text-white`}
              >
                <CheckCircle2 size={26} className="text-white drop-shadow" />
              </motion.div>

              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-1.5 -right-1.5"
              >
                <Sparkles size={18} className="text-amber-400 drop-shadow" />
              </motion.div>
            </div>

            {/* Badge */}
            <div>
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-xs"
                style={{
                  background: config.bgGlow,
                  color: config.color,
                  borderColor: config.borderLight
                }}
              >
                <Award size={10} />
                <span>{config.badge}</span>
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                🎉 Congratulations{userName ? `, ${userName}` : ""}!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-tight">
                Your workspace is upgraded to{" "}
                <strong className="text-slate-900 dark:text-white font-extrabold underline decoration-2 underline-offset-2" style={{ textDecorationColor: config.color }}>
                  {plan}
                </strong>
              </p>
            </div>

            {/* Compact Features List */}
            <div className="p-2.5 rounded-xl bg-slate-50/95 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800 text-left space-y-1.5">
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <CheckCircle2 size={11} style={{ color: config.color }} />
                <span>Unlocked Features</span>
              </div>

              <div className="space-y-1">
                {config.features.map((feat, idx) => {
                  const FeatIcon = feat.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + idx * 0.05 }}
                      className="flex items-center gap-2 py-0.5"
                    >
                      <div
                        className="w-4 h-4 rounded-md flex items-center justify-center shrink-0 border"
                        style={{
                          background: config.bgGlow,
                          borderColor: config.borderLight
                        }}
                      >
                        <FeatIcon size={9} style={{ color: config.color }} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                        {feat.title}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className={`w-full h-9 sm:h-10 rounded-xl font-black text-xs text-white flex items-center justify-center gap-1.5 bg-gradient-to-r ${config.gradient} hover:opacity-95 shadow-md transition-all cursor-pointer border-0`}
              style={{
                boxShadow: `0 8px 18px -4px ${config.bgGlow}`
              }}
            >
              <span>Explore My Workspace</span>
              <ArrowRight size={13} strokeWidth={2.5} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
