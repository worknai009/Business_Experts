import { TrendingUp, ShieldCheck, CircleDollarSign, MapPin, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { exportFeasibilityPdfReport } from "../utils/ReportPdfExporter";

export default function ReportPreview() {
  return (
    <section className="py-16 sm:py-20 page-container" id="report">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Left Side Copy */}
        <div className="space-y-6 text-left">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">AI REPORT PREVIEW</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-xl text-balance">
              See Exactly What Your <span className="text-emerald-600 dark:text-emerald-400">AI Report</span> Looks Like
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed max-w-xl font-medium">
              Get a comprehensive business opportunity report with market demand signals, competition density, financial investment forecasts, monthly profit, payback timelines, and actionable AI recommendations.
            </p>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            {[
              "100-Point Feasibility Score with complete breakdown",
              "Real-World Demand Signals & Competitor Density",
              "Upfront Capital Requirements & Working Capital Buffer",
              "Net Monthly Profit Margin & Tax Impact Forecast",
              "Annual ROI % and Break-Even Payback Period",
              "Actionable Next Steps & Local Location Multipliers",
            ].map((x) => (
              <li key={x} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{x}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/business-finder"
              style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition inline-flex items-center gap-2 cursor-pointer border-0"
            >
              <span>Explore Opportunities</span>
              <ArrowRight size={18} color="#ffffff" strokeWidth={2.5} />
            </Link>
            <button
              onClick={() => {
                exportFeasibilityPdfReport({
                  business: 'Cloud Kitchen & Tiffin Delivery',
                  location: 'Mumbai, Maharashtra',
                  budget: 500000,
                  estimated_investment: 400000,
                  estimated_profit: 45000,
                  estimated_revenue: 160000,
                  roi: '85% ROI',
                  break_even: '10.5 Months',
                  score: 86,
                  rating: 'Excellent Opportunity',
                  demand: 'High Demand (+28% YoY)',
                  risk: 'Low Risk'
                });
              }}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#0f172a] dark:text-white font-bold text-sm border border-slate-300 dark:border-slate-700 shadow-sm transition inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Download Sample PDF</span>
            </button>
          </div>
        </div>

        {/* Right Side Realistic Bounded Report Mockup Card */}
        <div className="w-full max-w-lg mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950/60 border border-slate-200 dark:border-emerald-500/30 shadow-2xl space-y-5 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <small className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">BUSINESS OPPORTUNITY REPORT</small>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">Cloud Kitchen</h3>
            </div>
            <div className="text-right shrink-0">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">86<span className="text-xs text-slate-500 font-normal">/100</span></span>
              <div className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/20 mt-1">
                Excellent Opportunity
              </div>
            </div>
          </div>

          {/* Score Track */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>Feasibility Index</span>
              <span className="text-emerald-600 dark:text-emerald-400">86% Fit</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
              <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {[
              { label: "Market Demand", val: "High", sub: "+28% YoY growth", color: "#10b981", icon: TrendingUp },
              { label: "Competition Density", val: "Medium", sub: "12 local competitors", color: "#22c55e", icon: ShieldCheck },
              { label: "Est. Investment", val: "₹4,00,000", sub: "Capex + working capital", color: "#f59e0b", icon: CircleDollarSign },
              { label: "Est. Monthly Profit", val: "₹45,000 / mo", sub: "Net after operating cost", color: "#10b981", icon: Zap },
              { label: "Annual ROI / Payback", val: "85% ROI", sub: "Payback in 10.5 months", color: "#16a34a", icon: TrendingUp },
              { label: "Risk Level & Location", val: "Low Risk", sub: "Mumbai (Tier-1 Metro)", color: "#06b6d4", icon: MapPin },
            ].map((m, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  <m.icon size={13} style={{ color: m.color }} />
                  <span>{m.label}</span>
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white">{m.val}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{m.sub}</div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">AI Decision Brief:</span>
            <span className="font-extrabold text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-500/20">
              🎯 Highly Recommended
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
