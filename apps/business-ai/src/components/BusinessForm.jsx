import React from "react";
import {
  BriefcaseBusiness, MapPin, IndianRupee, Rocket, Sparkles,
  BarChart3, ShieldCheck, TrendingUp, Loader2
} from "lucide-react";

function BusinessForm({ business, setBusiness, location, setLocation, budget, setBudget, loading, analyzeBusiness }) {
  return (
    <div className="space-y-6 max-w-full">
      
      {/* Top Hero Banner - Matching Exact Light Mode Mint Frosted Theme */}
      <section className="relative overflow-hidden rounded-3xl bg-[#f0fdf4] dark:bg-[#06101e] border border-[#bbf7d0] dark:border-emerald-500/30 p-6 sm:p-8 shadow-lg shadow-emerald-900/5 dark:shadow-emerald-950/30 text-[#061c16] dark:text-white transition-colors duration-200">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          <div className="lg:col-span-2 space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dcfce7] dark:bg-emerald-500/20 border border-[#86efac] dark:border-emerald-400/30 text-[#065f46] dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
              <Sparkles size={14} className="text-[#059669] dark:text-emerald-400" /> AI BUSINESS INTELLIGENCE
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#061c16] dark:text-white tracking-tight leading-tight">
              Validate your business idea <span className="text-[#047857] dark:text-emerald-400 font-black">before you invest.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#334155] dark:text-slate-300 max-w-xl leading-relaxed font-medium">
              Enter your business, location and available budget. BusinessAI calculates a transparent opportunity score, financial projection and practical next steps.
            </p>
          </div>

          {/* Right Stats Chips - Light & Dark Aware */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-[#bbf7d0] dark:border-slate-700/80 text-center shadow-xs">
            <div className="space-y-1">
              <BarChart3 size={20} className="mx-auto text-emerald-600 dark:text-emerald-400" />
              <div className="text-xl font-black text-[#0f172a] dark:text-white">5</div>
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Scoring signals</div>
            </div>

            <div className="space-y-1 border-x border-slate-200 dark:border-slate-700">
              <ShieldCheck size={20} className="mx-auto text-emerald-600 dark:text-emerald-400" />
              <div className="text-xl font-black text-[#0f172a] dark:text-white">100</div>
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Score points</div>
            </div>

            <div className="space-y-1">
              <TrendingUp size={20} className="mx-auto text-emerald-600 dark:text-emerald-400" />
              <div className="text-xl font-black text-[#0f172a] dark:text-white">24/7</div>
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">AI insights</div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Input Panel - Mint Frosted Theme */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#f0fdf4] dark:bg-[#0b1329] border border-[#bbf7d0] dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-200">
        <div className="flex items-center gap-3 text-left">
          <div className="w-11 h-11 rounded-2xl bg-[#047857] shadow-md shadow-[#047857]/20 flex items-center justify-center text-white shrink-0">
            <Sparkles size={20} color="#ffffff" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#065f46] dark:text-emerald-400 block">START HERE</span>
            <h2 className="text-xl font-black text-[#061c16] dark:text-white">Analyze your business idea</h2>
            <p className="text-xs text-[#334155] dark:text-slate-300 font-medium">Use your real available budget. The score will reflect affordability.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field
            label="Business idea"
            icon={<BriefcaseBusiness size={18} className="text-[#047857]" />}
            value={business}
            onChange={setBusiness}
            placeholder="e.g. Pet Salon, Tea Stall"
          />

          <Field
            label="Location"
            icon={<MapPin size={18} className="text-[#047857]" />}
            value={location}
            onChange={setLocation}
            placeholder="e.g. Pune, Mumbai"
          />

          <Field
            label="Available budget"
            icon={<IndianRupee size={18} className="text-[#047857]" />}
            value={budget}
            onChange={setBudget}
            placeholder="e.g. 500000"
            type="number"
          />
        </div>

        <button
          onClick={analyzeBusiness}
          disabled={loading}
          style={{ backgroundColor: '#047857', color: '#ffffff' }}
          className="w-full h-12 rounded-2xl bg-[#047857] hover:bg-[#065f46] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-[#047857]/20 transition cursor-pointer border-0"
        >
          {loading ? (
            <><Loader2 size={19} className="animate-spin" color="#ffffff" /> Analyzing Opportunity...</>
          ) : (
            <><Rocket size={19} color="#ffffff" /> Analyze Opportunity</>
          )}
        </button>
      </section>

    </div>
  );
}

function Field({ label, icon, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-1.5 text-left">
      <span className="text-[11px] font-black uppercase tracking-wider text-[#065f46] dark:text-slate-200 block">{label}</span>
      <div className="relative flex items-center">
        <span className="absolute left-3.5 pointer-events-none">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 pl-10 pr-4 rounded-2xl bg-white dark:bg-slate-950 border border-[#bbf7d0] dark:border-slate-700 text-[#061c16] dark:text-white text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition font-semibold placeholder:text-slate-400 shadow-xs"
          min={type === "number" ? "1" : undefined}
        />
      </div>
    </div>
  );
}

export default BusinessForm;
