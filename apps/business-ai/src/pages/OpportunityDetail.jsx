import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Bookmark, Share2, Sparkles, TrendingUp,
  ShieldCheck, AlertTriangle, Building2, CheckCircle2, FileText,
  DollarSign, PieChart, Users, Award, ChevronRight
} from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { exportBankProjectReport } from '../utils/ReportPdfExporter';

export default function OpportunityDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for opportunity report
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const rawOpp = (location.state && location.state.opportunity) ? location.state.opportunity : {};
    const businessTitle = rawOpp.title || (id ? id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Cloud Kitchen');
    
    const formattedData = {
      id: rawOpp.id || id || 'cloud-kitchen-1',
      title: businessTitle,
      category: rawOpp.category || 'Business Opportunity',
      location: rawOpp.location || location.state?.location || 'Mumbai, Maharashtra',
      investment: rawOpp.investment || 500000,
      score: rawOpp.score || 88,
      demand: rawOpp.demand || 'High',
      competition: rawOpp.competition || 'Medium',
      risk: rawOpp.risk || 'Low',
      monthly_revenue: rawOpp.monthly_revenue || (rawOpp.investment ? Math.round(rawOpp.investment * 0.5) : 280000),
      monthly_profit: rawOpp.monthly_profit || (rawOpp.investment ? Math.round(rawOpp.investment * 0.15) : 84000),
      roi_percent: rawOpp.roi_percent || 140,
      payback_months: rawOpp.payback_months || 6.0,
      summary: rawOpp.summary || `A high-viability business opportunity model tailored for ${location.state?.location || 'your target city'} with strong market demand and attractive return on investment.`,
      swot: rawOpp.swot || {
        strengths: ['Low initial capital requirement', 'High gross profit margin potential', 'Scalable operating model'],
        weaknesses: ['Requires initial local marketing push', 'Working capital management needed in early months'],
        opportunities: ['Corporate B2B supply contracts', 'Multi-location branch expansion in tier-1/2 cities'],
        threats: ['Local input cost inflation', 'Competitor promotional pricing']
      },
      financials: rawOpp.financials || [
        { month: 'M1', revenue: '₹1,20,000', expenses: '₹95,000', net: '₹25,000' },
        { month: 'M3', revenue: '₹2,10,000', expenses: '₹1,40,000', net: '₹70,000' },
        { month: 'M6', revenue: '₹2,80,000', expenses: '₹1,96,000', net: '₹84,000' },
        { month: 'M12', revenue: '₹3,50,000', expenses: '₹2,30,000', net: '₹1,20,000' }
      ],
      schemes: rawOpp.schemes || [
        { name: 'PMEGP (Prime Minister Employment Generation Programme)', subsidy: '15% - 35% Govt Subsidy', maxLoan: '₹50 Lakhs' },
        { name: 'MUDRA Scheme (Kishore Category)', subsidy: 'Collateral-free business loan', maxLoan: '₹5 Lakhs' }
      ],
      action_plan: rawOpp.action_plan || [
        'Register business entity & required local licenses',
        'Finalize 200–300 sq.ft commercial workspace in target city',
        'Procure core equipment & inventory supplies',
        'Launch targeted local digital marketing & social campaign',
        'Evaluate initial 30-day performance & optimize operating margin'
      ]
    };

    setData(formattedData);
    setLoading(false);
  }, [id, location.state]);

  const handleDownloadPDF = () => {
    setDownloading(true);
    try {
      exportBankProjectReport({
        business: data?.title || 'Business Opportunity',
        location: data?.location || 'Target City',
        budget: data?.investment || 500000,
        estimated_investment: data?.investment || 450000,
        estimated_profit: data?.monthly_profit || 75000,
        estimated_revenue: data?.monthly_revenue || 220000,
        roi: `${data?.roi_percent || 120}%`,
        break_even: `${data?.payback_months || 6.0} Months`,
        score: data?.score || 88,
        rating: data?.rating || 'Excellent',
        demand: data?.demand || 'High',
        risk: data?.risk || 'Low',
        summary: data?.summary,
        swot: data?.swot,
        action_plan: data?.action_plan,
        financials: data?.financials,
        schemes: data?.schemes
      });
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  const handleSaveReport = () => {
    setSaved(!saved);
  };

  if (loading) {
    return (
      <DashboardLayout title="Opportunity Analysis">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Feasibility Report — ${data.title}`}>
      <div className="space-y-6">
        
        {/* Top Action & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate('/analyze')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <ArrowLeft size={16} /> Go Back to Analysis
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveReport}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                saved
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600'
              }`}
            >
              <Bookmark size={15} className={saved ? 'fill-emerald-600 dark:fill-emerald-400' : ''} />
              {saved ? 'Saved to Reports' : 'Save Report'}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              style={{ backgroundColor: '#047857', color: '#ffffff' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition shadow-md shadow-emerald-700/20 cursor-pointer border-0"
            >
              <Download size={15} color="#ffffff" />
              {downloading ? 'Generating PDF...' : 'Download PDF Report'}
            </button>
          </div>
        </div>

        {/* Hero Score Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900/90 to-teal-950/60 border border-emerald-500/30 shadow-2xl relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            
            <div className="lg:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-black uppercase tracking-wider">
                  {data.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                  📍 {data.location}
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {data.title}
              </h1>
              
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                {data.summary}
              </p>
            </div>

            {/* Score Ring / Card */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-center space-y-2 backdrop-blur-xl">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                FEASIBILITY SCORE
              </div>
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                {data.score} <span className="text-lg font-bold text-slate-500">/ 100</span>
              </div>
              <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                <ShieldCheck size={14} /> Highly Viable Business Opportunity
              </div>
            </div>

          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 backdrop-blur-xl">
            <div className="text-slate-400 text-xs font-bold flex items-center justify-between">
              <span>Required Capital</span>
              <DollarSign size={16} className="text-indigo-400" />
            </div>
            <div className="text-xl font-black text-white">₹{data.investment.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400">Setup &amp; 3-mo operating buffer</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 backdrop-blur-xl">
            <div className="text-slate-400 text-xs font-bold flex items-center justify-between">
              <span>Est. Monthly Profit</span>
              <TrendingUp size={16} className="text-emerald-400" />
            </div>
            <div className="text-xl font-black text-emerald-400">₹{data.monthly_profit.toLocaleString()}</div>
            <div className="text-[11px] text-slate-400">Net after expenses &amp; platform fees</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 backdrop-blur-xl">
            <div className="text-slate-400 text-xs font-bold flex items-center justify-between">
              <span>Annualized ROI</span>
              <PieChart size={16} className="text-cyan-400" />
            </div>
            <div className="text-xl font-black text-cyan-400">{data.roi_percent}%</div>
            <div className="text-[11px] text-slate-400">Derived from 12-month projections</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5 backdrop-blur-xl">
            <div className="text-slate-400 text-xs font-bold flex items-center justify-between">
              <span>Payback Period</span>
              <Award size={16} className="text-amber-400" />
            </div>
            <div className="text-xl font-black text-amber-400">{data.payback_months} Months</div>
            <div className="text-[11px] text-slate-400">Full capital recovery target</div>
          </div>
        </div>

        {/* SWOT Matrix Grid */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-400" />
            <h2 className="text-lg font-black text-white">SWOT Feasibility Matrix</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Strengths */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20 space-y-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">
                STRENGTHS (ADVANTAGES)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {data.swot.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-amber-500/20 space-y-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest block">
                WEAKNESSES (CHALLENGES)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {data.swot.weaknesses.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-500/20 space-y-2">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-widest block">
                OPPORTUNITIES (GROWTH)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {data.swot.opportunities.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <TrendingUp size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-rose-500/20 space-y-2">
              <span className="text-xs font-black text-rose-400 uppercase tracking-widest block">
                THREATS (RISK FACTORS)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {data.swot.threats.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ShieldCheck size={14} className="text-rose-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* 12-Month Projections & Action Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Financial Projections Table */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <FileText size={18} className="text-indigo-400" />
              12-Month Revenue &amp; Expense Projections
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="pb-3">Timeline</th>
                    <th className="pb-3">Est. Revenue</th>
                    <th className="pb-3">Operating Expense</th>
                    <th className="pb-3 text-right">Net Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.financials.map((row, i) => (
                    <tr key={i} className="text-slate-300 hover:bg-slate-950/40">
                      <td className="py-3 font-bold text-white">{row.month}</td>
                      <td className="py-3 text-slate-300">{row.revenue}</td>
                      <td className="py-3 text-slate-400">{row.expenses}</td>
                      <td className="py-3 text-right font-extrabold text-emerald-400">{row.net}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Checklist */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              Starter 5-Step Execution Plan
            </h3>

            <div className="space-y-3">
              {data.action_plan.map((step, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-300 font-medium leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
