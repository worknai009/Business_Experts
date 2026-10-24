import React, { useState } from 'react';
import { Landmark, Award, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function GrantCalculatorWidget({ investment = 500000, category = "Food & Beverage" }) {
  const inv = Number(investment || 500000);
  
  const [applicantCategory, setApplicantCategory] = useState('Women'); // General, Special (SC/ST/OBC/Women/Minority)
  const [locationType, setLocationType] = useState('Urban'); // Urban, Rural

  // PMEGP Subsidy Rate Calculation
  const isSpecial = applicantCategory !== 'General';
  const isRural = locationType === 'Rural';
  
  let subsidyPercent = 15;
  if (!isSpecial && isRural) subsidyPercent = 25;
  if (isSpecial && !isRural) subsidyPercent = 25;
  if (isSpecial && isRural) subsidyPercent = 35;

  const maxPmegpCost = 5000000; // max 50 Lakhs for manufacturing / 20 Lakhs for service
  const eligibleCost = Math.min(inv, maxPmegpCost);
  const pmegpGrantAmount = Math.round(eligibleCost * (subsidyPercent / 100));
  const ownContributionPercent = isSpecial ? 5 : 10;
  const ownContributionAmount = Math.round(eligibleCost * (ownContributionPercent / 100));
  const bankLoanAmount = eligibleCost - pmegpGrantAmount - ownContributionAmount;

  return (
    <section className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 space-y-6 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Landmark size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block">MSME SUBSIDY CALCULATOR</span>
            <h3 className="text-lg font-black text-[#0f172a] dark:text-white">PMEGP &amp; Govt. Scheme Grant Eligibility</h3>
          </div>
        </div>
        <span className="text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-500/20">
          {subsidyPercent}% Govt Subsidy
        </span>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
        
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">Applicant Demographic Category</label>
          <select
            value={applicantCategory}
            onChange={e => setApplicantCategory(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-[#0f172a] dark:text-white text-xs font-bold outline-none focus:border-amber-500 transition"
          >
            <option value="Women">Women Entrepreneur (Special - 25-35%)</option>
            <option value="SC_ST">SC / ST Applicant (Special - 25-35%)</option>
            <option value="OBC_Minority">OBC / Minority / Ex-Serviceman (Special - 25-35%)</option>
            <option value="General">General Category (15-25%)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">Location Classification</label>
          <select
            value={locationType}
            onChange={e => setLocationType(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-[#0f172a] dark:text-white text-xs font-bold outline-none focus:border-amber-500 transition"
          >
            <option value="Urban">Urban City / Municipal Limits</option>
            <option value="Rural">Rural / Semi-Urban Panchayat Limits</option>
          </select>
        </div>

      </div>

      {/* Calculation Results Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 space-y-1">
          <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">Estimated Govt. Subsidy Grant</span>
          <span className="text-xl font-black text-amber-600 dark:text-amber-400">₹{pmegpGrantAmount.toLocaleString('en-IN')}</span>
          <span className="text-[11px] text-amber-700/80 dark:text-amber-300/80 block">Non-refundable KVIC PMEGP Margin Money</span>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 space-y-1">
          <span className="text-[10px] font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider block">Required Bank Loan</span>
          <span className="text-xl font-black text-indigo-600 dark:text-indigo-300">₹{bankLoanAmount.toLocaleString('en-IN')}</span>
          <span className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 block">Sanctioned by Public Sector Banks</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 space-y-1">
          <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">Promoter Contribution ({ownContributionPercent}%)</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{ownContributionAmount.toLocaleString('en-IN')}</span>
          <span className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 block">Your personal equity input</span>
        </div>

      </div>

      {/* Additional Scheme Highlights */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
        <span className="font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
          <Award size={15} className="text-amber-500" /> Additional Matching Central Schemes:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>MUDRA Tarun Loan: Up to ₹10 Lakhs Collateral-Free</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>CGTMSE Credit Guarantee Coverage (85%)</span>
          </div>
        </div>
      </div>

    </section>
  );
}
