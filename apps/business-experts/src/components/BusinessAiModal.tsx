import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Sparkles,
  TrendingUp,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  BarChart3
} from "lucide-react";

export default function BusinessAiModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [industry, setIndustry] = useState("Fintech & SaaS");
  const [targetRevenue, setTargetRevenue] = useState(25); // in Lakhs/yr
  const [stage, setStage] = useState("Growth Stage");

  // Dynamic calculation for the interactive teaser dial
  const score = Math.min(
    98,
    Math.max(
      65,
      Math.round(
        70 +
          (stage === "Growth Stage" ? 14 : stage === "Early Revenue" ? 8 : 4) +
          (industry.includes("SaaS") ? 10 : 6) -
          (targetRevenue > 50 ? 5 : 0)
      )
    )
  );

  const aiAppUrl =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "http://localhost:5173"
      : "https://analytics.businessexperts.asia";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-500/30 bg-white dark:bg-[#090f1d] shadow-2xl z-10 text-slate-800 dark:text-slate-100"
          >
            {/* Ambient Header Glow */}
            <div className="absolute -top-20 -left-20 size-60 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 size-60 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-tr from-brand to-emerald-400 text-white shadow-glow">
                  <Bot className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold tracking-tight">BusinessAI Intelligence Engine</h3>
                    <span className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black uppercase">
                      Live Engine
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Instant AI feasibility score, market benchmarks & autonomous mentoring
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid size-8 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body: Interactive Live Simulator */}
            <div className="relative p-6 space-y-6">
              {/* Interactive Inputs */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                    Sector / Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="input !py-2.5 !text-xs font-semibold dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    <option>Fintech & SaaS</option>
                    <option>E-Commerce & D2C</option>
                    <option>HealthTech & Bio</option>
                    <option>Professional Services</option>
                    <option>Retail & Franchising</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                    Startup Growth Stage
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="input !py-2.5 !text-xs font-semibold dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  >
                    <option>Idea / Prototype</option>
                    <option>Early Revenue</option>
                    <option>Growth Stage</option>
                    <option>Scaling & Series A</option>
                  </select>
                </div>
              </div>

              {/* Target Revenue Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Target Annual Revenue
                  </label>
                  <span className="text-xs font-extrabold text-brand dark:text-emerald-400">
                    ₹{targetRevenue} Lakhs / year
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={targetRevenue}
                  onChange={(e) => setTargetRevenue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Live Feasibility Output Card */}
              <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-500/8 to-indigo-500/8 dark:from-emerald-950/30 dark:to-indigo-950/30 p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative grid size-16 place-items-center rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/30 shadow-soft">
                    <span className="text-2xl font-black gradient-text">{score}%</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold flex items-center gap-1.5">
                      <Sparkles className="size-4 text-emerald-500" />
                      High Feasibility Benchmark
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Projected {score >= 85 ? "top tier" : "healthy"} market viability score for {industry}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="size-3.5 text-emerald-500" /> AI Verified
                </div>
              </div>

              {/* Ecosystem AI Pillars */}
              <div className="grid grid-cols-3 gap-3 pt-1 text-center">
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-2.5">
                  <Zap className="size-4 text-amber-500 mx-auto mb-1" />
                  <p className="text-[11px] font-bold">RAG Knowledge</p>
                  <p className="text-[10px] text-slate-400">Trained on Asian markets</p>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-2.5">
                  <BarChart3 className="size-4 text-indigo-500 mx-auto mb-1" />
                  <p className="text-[11px] font-bold">Finance Model</p>
                  <p className="text-[10px] text-slate-400">P&L & Breakeven math</p>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-2.5">
                  <ShieldCheck className="size-4 text-emerald-500 mx-auto mb-1" />
                  <p className="text-[11px] font-bold">24/7 AI Mentor</p>
                  <p className="text-[10px] text-slate-400">Real-time answers</p>
                </div>
              </div>
            </div>

            {/* Modal Footer with External Bridge CTA */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 px-6 py-4">
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                Run deep diagnostics in the full workspace
              </span>
              <a
                href={aiAppUrl}
                onClick={onClose}
                className="btn-primary !py-2.5 !px-5 !rounded-xl !text-xs flex items-center gap-2 font-bold ml-auto"
              >
                <span>Launch BusinessAI App</span>
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
