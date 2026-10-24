import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { Calculator as CalcIcon, ArrowLeft, TrendingUp, IndianRupee, Percent, Clock, Sparkles } from 'lucide-react';

export default function Calculator() {
  const [initialInvestment, setInitialInvestment] = useState(500000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(120000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(70000);
  const [taxRate, setTaxRate] = useState(10.0);

  const [result, setResult] = useState(null);

  useEffect(() => {
    dashboardService.calculateROI(initialInvestment, monthlyRevenue, monthlyExpenses, taxRate)
      .then((res) => setResult(res));
  }, [initialInvestment, monthlyRevenue, monthlyExpenses, taxRate]);

  return (
    <div className="space-y-6 text-[#0f172a] dark:text-white font-sans antialiased">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1 text-left">
          <Link to="/dashboard" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1">
            <ArrowLeft size={14} /> <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center space-x-2">
            <CalcIcon className="text-emerald-600 dark:text-emerald-400" size={28} />
            <span>Interactive ROI &amp; Payback Estimator</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Simulate initial capital requirements, turnover projections, and net margins.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Controls Panel - Mint Frosted Theme */}
        <div className="bg-[#f0fdf4] dark:bg-[#0b1329] p-6 sm:p-8 rounded-3xl border border-[#bbf7d0] dark:border-slate-800 shadow-sm space-y-6 text-left transition-colors duration-200">
          <h2 className="text-base sm:text-lg font-black text-[#061c16] dark:text-white border-b border-[#bbf7d0] dark:border-slate-800 pb-3">Financial Inputs</h2>
          
          {/* Initial Investment */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black uppercase tracking-wider">
              <span className="text-[#065f46] dark:text-slate-300">Initial Startup Capital</span>
              <span className="text-[#047857] dark:text-emerald-400 font-mono text-sm">₹{Number(initialInvestment).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="5000000"
              step="50000"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full h-2.5 bg-white dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#047857] border border-[#bbf7d0]"
            />
          </div>

          {/* Estimated Monthly Revenue */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black uppercase tracking-wider">
              <span className="text-[#065f46] dark:text-slate-300">Estimated Monthly Turnover</span>
              <span className="text-[#047857] dark:text-emerald-400 font-mono text-sm">₹{Number(monthlyRevenue).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
              className="w-full h-2.5 bg-white dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#047857] border border-[#bbf7d0]"
            />
          </div>

          {/* Monthly Operating Expenses */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black uppercase tracking-wider">
              <span className="text-[#065f46] dark:text-slate-300">Monthly Operating Expenses</span>
              <span className="text-rose-600 dark:text-rose-400 font-mono text-sm">₹{Number(monthlyExpenses).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="800000"
              step="5000"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
              className="w-full h-2.5 bg-white dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500 border border-rose-200"
            />
          </div>

          {/* Tax Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black uppercase tracking-wider">
              <span className="text-[#065f46] dark:text-slate-300">Effective Tax &amp; Contingency</span>
              <span className="text-teal-700 dark:text-teal-400 font-mono text-sm">{taxRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-full h-2.5 bg-white dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600 border border-teal-200"
            />
          </div>

        </div>

        {/* Results Output Panel - Light & Dark Mode Aware */}
        {result && (
          <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white dark:from-emerald-950 dark:via-slate-900 dark:to-[#06101e] p-6 sm:p-8 rounded-3xl border border-emerald-200/90 dark:border-emerald-500/30 text-[#0f172a] dark:text-white shadow-xl shadow-emerald-950/5 dark:shadow-2xl flex flex-col justify-between space-y-6 text-left transition-colors duration-200">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400">Financial Forecast Card</span>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  {result.viabilityBadge || 'High Viability'}
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {/* Net Monthly Profit */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-800 space-y-1 shadow-xs">
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Net Monthly Profit (After Tax)</span>
                  <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                    ₹{Number(result.monthlyNetProfit || 0).toLocaleString()}
                  </div>
                </div>

                {/* ROI & Payback */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-800 space-y-1 shadow-xs">
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Annualized ROI</span>
                    <div className="text-2xl font-black text-teal-700 dark:text-teal-300 font-mono">
                      {result.annualROI || '0%'}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-800 space-y-1 shadow-xs">
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Capital Payback Period</span>
                    <div className="text-2xl font-black text-amber-700 dark:text-amber-300 font-mono">
                      {result.paybackPeriodMonths || 0} Mos
                    </div>
                  </div>
                </div>

                {/* Net Profit Margin */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/60 border border-emerald-100 dark:border-slate-800 space-y-1 shadow-xs">
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Net Profit Margin</span>
                  <div className="text-xl font-black text-[#0f172a] dark:text-white font-mono">
                    {result.netMarginPercent || '0%'}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between font-medium">
              <span>Dynamic sensitivity algorithm calibrated for Indian MSMEs.</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
