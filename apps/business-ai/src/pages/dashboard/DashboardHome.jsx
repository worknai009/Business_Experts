import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { Rocket, Sparkles, Calculator, Bot, TrendingUp, CreditCard, Settings, ShieldCheck, ArrowRight } from 'lucide-react';

export default function DashboardHome() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getDashboardSummary().then((data) => {
      setSummary(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#0f172a] dark:text-white font-sans antialiased">
      
      {/* Header Hero Banner - Matching Exact Light Mode Mint Frosted Theme */}
      <div className="bg-[#f0fdf4] dark:bg-gradient-to-br dark:from-emerald-950 dark:via-slate-900 dark:to-[#06101e] rounded-3xl p-6 sm:p-8 text-[#061c16] dark:text-white shadow-lg shadow-emerald-900/5 dark:shadow-2xl border border-[#bbf7d0] dark:border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden text-left transition-colors duration-200">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-1.5 bg-[#dcfce7] dark:bg-emerald-500/20 text-[#065f46] dark:text-emerald-300 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider border border-[#86efac] dark:border-emerald-400/30">
            <Sparkles size={13} className="text-[#059669] dark:text-emerald-400" /> <span>{summary.subscriptionPlan} Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-[#061c16] dark:text-white">Welcome to your Founder Dashboard</h1>
          <p className="text-xs sm:text-sm text-[#334155] dark:text-slate-200 max-w-xl leading-relaxed font-medium">
            Track feasibility scores, query your AI business mentor, and calculate project payback.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <Link
            to="/business-finder"
            style={{ backgroundColor: '#047857', color: '#ffffff' }}
            className="px-5 py-2.5 rounded-2xl font-black text-white text-xs flex items-center space-x-2 shadow-md shadow-[#047857]/20 hover:bg-[#065f46] transition cursor-pointer border-0"
          >
            <Rocket size={15} color="#ffffff" />
            <span>Find New Opportunity</span>
          </Link>
          <Link
            to="/dashboard/ai-mentor"
            className="bg-white hover:bg-slate-50 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 border border-slate-300 dark:border-emerald-400/30 text-[#0f172a] dark:text-white px-5 py-2.5 rounded-2xl font-bold transition flex items-center space-x-2 text-xs cursor-pointer shadow-xs"
          >
            <Bot size={15} className="text-[#0f172a] dark:text-emerald-400" />
            <span>Ask AI Mentor</span>
          </Link>
        </div>
      </div>

      {/* Snapshot KPI Cards - Light & Dark Aware */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Searches Used */}
        <div className="bg-white dark:bg-[#0b1329] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/40 transition text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Searches Used</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Rocket size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white">
            {summary.searchesThisMonth} <span className="text-xs font-semibold text-slate-500">/ {summary.searchLimit}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (summary.searchesThisMonth / summary.searchLimit) * 100)}%` }}
            />
          </div>
        </div>

        {/* Saved Reports */}
        <div className="bg-white dark:bg-[#0b1329] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-teal-500/40 transition text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Saved Reports</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-700 dark:text-teal-400">
            {summary.savedReportsCount}
          </div>
          <Link to="/history" className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline flex items-center space-x-1">
            <span>View saved reports</span> <ArrowRight size={12} />
          </Link>
        </div>

        {/* Financial Tools */}
        <div className="bg-white dark:bg-[#0b1329] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-500/40 transition text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Financial Tools</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Calculator size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">ROI Estimator</div>
          <Link to="/dashboard/calculator" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1">
            <span>Launch Calculator</span> <ArrowRight size={12} />
          </Link>
        </div>

        {/* Current Membership */}
        <div className="bg-white dark:bg-[#0b1329] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-amber-500/40 transition text-left">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Current Membership</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">{summary.subscriptionPlan}</div>
          <Link to="/subscription" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center space-x-1">
            <span>Upgrade Plan</span> <ArrowRight size={12} />
          </Link>
        </div>

      </div>

      {/* Dashboard Tools & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Shortcuts Navigation */}
        <div className="lg:col-span-1 bg-white dark:bg-[#0b1329] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left">
          <h2 className="text-base sm:text-lg font-black text-[#0f172a] dark:text-white">Dashboard Navigation</h2>
          <nav className="space-y-2">
            <Link to="/dashboard/calculator" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group border border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <Calculator size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0f172a] dark:text-white group-hover:text-emerald-600 transition">ROI Calculator</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Estimate payback &amp; net margins</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-emerald-600 transition" />
            </Link>

            <Link to="/dashboard/ai-mentor" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group border border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-xl">
                  <Bot size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0f172a] dark:text-white group-hover:text-teal-600 transition">AI Mentor Chat</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Ask questions on reports</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-teal-600 transition" />
            </Link>

            <Link to="/dashboard/market-insights" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group border border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0f172a] dark:text-white group-hover:text-blue-600 transition">Market Insights</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">City demand trends feed</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600 transition" />
            </Link>

            <Link to="/dashboard/invoices" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group border border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
                  <CreditCard size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0f172a] dark:text-white group-hover:text-amber-600 transition">Billing &amp; Invoices</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Payment receipts &amp; plans</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-amber-600 transition" />
            </Link>

            <Link to="/dashboard/settings" className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group border border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl">
                  <Settings size={18} />
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0f172a] dark:text-white group-hover:text-emerald-600 transition">Account Settings</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Profile &amp; alert preferences</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-400 group-hover:text-emerald-600 transition" />
            </Link>
          </nav>
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0b1329] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-[#0f172a] dark:text-white">Recent Feasibility Activity</h2>
            <Link to="/history" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline">View All</Link>
          </div>

          {summary.recentActivity.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <p className="text-sm">No reports generated yet this month.</p>
              <Link
                to="/business-finder"
                style={{ backgroundColor: '#047857', color: '#ffffff' }}
                className="inline-block px-5 py-2.5 rounded-xl text-white text-xs font-black transition cursor-pointer shadow-md shadow-emerald-700/20 border-0"
              >
                Run First Opportunity Search
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {summary.recentActivity.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 px-3 rounded-xl transition">
                  <div className="space-y-0.5">
                    <div className="font-bold text-sm text-[#0f172a] dark:text-white">{item.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.date}</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      Score: {item.score}/100
                    </span>
                    <Link to="/history" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
