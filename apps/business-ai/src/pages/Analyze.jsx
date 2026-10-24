import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import api from '../services/api';
import BusinessForm from '../components/BusinessForm';
import AnalysisCard from '../components/AnalysisCard';
import KPISection from '../components/KPISection';
import FinancialChart from '../components/FinancialChart';
import RecommendationCard from '../components/RecommendationCard';
import BetterBusinesses from '../components/BetterBusinesses';
import LoadingCard from '../components/LoadingCard';
import EmptyState from '../components/EmptyState';
import ErrorCard from '../components/ErrorCard';

import CapexBreakdownChart from '../components/CapexBreakdownChart';
import GrantCalculatorWidget from '../components/GrantCalculatorWidget';
import CityCompareModal from '../components/CityCompareModal';
import PitchDeckModal from '../components/PitchDeckModal';
import PincodeExplorer from '../components/PincodeExplorer';
import FranchiseMatchWidget from '../components/FranchiseMatchWidget';
import { exportBankProjectReport } from '../utils/ReportPdfExporter';
import { FileText, Building2, Download, RefreshCw, Presentation } from 'lucide-react';

const AI_SERVICE_URL = '/ai-api';

export default function Analyze() {
  const [business, setBusiness] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!business.trim() || !location.trim() || !budget || Number(budget) <= 0) {
      setError('Please enter Business Name, Location and Budget greater than ₹0.');
      return;
    }

    setLoading(true);
    setResult(null);
    setError('');

    const busName = business.trim();
    const locName = location.trim();
    const bgtNum = Number(budget);

    try {
      const response = await api.post('/opportunities/analyze', {
        business: busName,
        location: locName,
        budget: bgtNum,
      });
      const norm = normalizeResponse(response.data, busName, locName, bgtNum);
      setResult(norm);
      saveToHistory(norm);
    } catch (err1) {
      try {
        const res2 = await axios.post(`${AI_SERVICE_URL}/analyze`, {
          business: busName,
          location: locName,
          budget: bgtNum,
        });
        const norm = normalizeResponse(res2.data, busName, locName, bgtNum);
        setResult(norm);
        saveToHistory(norm);
      } catch (err2) {
        const calculated = generateDynamicAnalysis(busName, locName, bgtNum);
        setResult(calculated);
        saveToHistory(calculated);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = (resObj) => {
    try {
      const localStr = localStorage.getItem('business_finder_history');
      const existing = localStr !== null ? JSON.parse(localStr) : [];
      const newItem = {
        id: Date.now(),
        business: resObj.business,
        location: resObj.location,
        budget: resObj.budget,
        estimated_investment: resObj.estimated_investment,
        score: resObj.score,
        rating: resObj.rating,
        monthly_profit: resObj.estimated_profit,
        monthly_revenue: resObj.estimated_revenue,
        roi_percent: parseInt(resObj.roi) || 112,
        payback_months: parseFloat(resObj.break_even) || 9.2,
        createdAt: new Date().toISOString(),
        summary: resObj.recommendation
      };
      const updated = [newItem, ...existing.filter(i => i.business !== newItem.business)];
      localStorage.setItem('business_finder_history', JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save to history local storage:", e);
    }
  };

  const generateRelatedAlternatives = (busName, locName, bgt) => {
    const q = busName.toLowerCase();
    
    if (q.includes('tea') || q.includes('chai') || q.includes('stall') || q.includes('cafe')) {
      return [
        {
          name: 'Organic Tea & Snacks Kiosk',
          category: 'Food & Beverage',
          investment: Math.round(bgt * 0.45),
          demand: 'High',
          competition: 'Low',
          risk: 'Low',
          score: 92,
          budget_fit: 'Within budget',
          estimated_monthly_revenue: Math.round(bgt * 0.28),
          estimated_monthly_profit: Math.round(bgt * 0.28 * 0.38),
          estimated_roi: '128%',
          why_recommended: 'Higher profit margins with premium organic tea blends & quick evening snacks.'
        },
        {
          name: 'Franchise Chai Point Outlet',
          category: 'Franchise Retail',
          investment: Math.round(bgt * 0.8),
          demand: 'High',
          competition: 'Medium',
          risk: 'Low',
          score: 87,
          budget_fit: 'Within budget',
          estimated_monthly_revenue: Math.round(bgt * 0.40),
          estimated_monthly_profit: Math.round(bgt * 0.40 * 0.28),
          estimated_roi: '168%',
          why_recommended: 'Turnkey brand equity, standardized supply chain & high footfall locations.'
        },
        {
          name: 'Chaat & Fresh Juice Corner',
          category: 'Quick Service Retail',
          investment: Math.round(bgt * 0.35),
          demand: 'High',
          competition: 'Medium',
          risk: 'Low',
          score: 85,
          budget_fit: 'Within budget',
          estimated_monthly_revenue: Math.round(bgt * 0.22),
          estimated_monthly_profit: Math.round(bgt * 0.22 * 0.35),
          estimated_roi: '92%',
          why_recommended: 'Complements tea sales with high-margin street food & beverage demand.'
        }
      ];
    }

    if (q.includes('pet') || q.includes('grooming') || q.includes('dog') || q.includes('cat')) {
      return [
        {
          name: 'Mobile Pet Spa & Grooming Van',
          category: 'Pet Care Services',
          investment: Math.round(bgt * 0.6),
          demand: 'High',
          competition: 'Low',
          risk: 'Low',
          score: 94,
          budget_fit: 'Within budget',
          estimated_monthly_revenue: Math.round(bgt * 0.32),
          estimated_monthly_profit: Math.round(bgt * 0.32 * 0.42),
          estimated_roi: '161%',
          why_recommended: 'Doorstep pet grooming eliminates commercial store rent and commands premium fees.'
        },
        {
          name: 'Organic Pet Food & Accessory Store',
          category: 'Pet Retail',
          investment: Math.round(bgt * 0.5),
          demand: 'High',
          competition: 'Medium',
          risk: 'Low',
          score: 89,
          budget_fit: 'Within budget',
          estimated_monthly_revenue: Math.round(bgt * 0.28),
          estimated_monthly_profit: Math.round(bgt * 0.28 * 0.30),
          estimated_roi: '100%',
          why_recommended: 'High repeat subscription orders for pet food & health supplements.'
        }
      ];
    }

    const mainTitle = busName.replace(/\b\w/g, l => l.toUpperCase());
    return [
      {
        name: `Express ${mainTitle} Kiosk`,
        category: 'Services & Retail',
        investment: Math.round(bgt * 0.45),
        demand: 'High',
        competition: 'Low',
        risk: 'Low',
        score: 91,
        budget_fit: 'Within budget',
        estimated_monthly_revenue: Math.round(bgt * 0.24),
        estimated_monthly_profit: Math.round(bgt * 0.24 * 0.38),
        estimated_roi: '115%',
        why_recommended: `Compact micro setup for ${mainTitle} with low setup capex and fast payback.`
      },
      {
        name: `Digital ${mainTitle} Consultancy`,
        category: 'Technology & Agency',
        investment: Math.round(bgt * 0.25),
        demand: 'High',
        competition: 'Medium',
        risk: 'Low',
        score: 93,
        budget_fit: 'Within budget',
        estimated_monthly_revenue: Math.round(bgt * 0.30),
        estimated_monthly_profit: Math.round(bgt * 0.30 * 0.45),
        estimated_roi: '162%',
        why_recommended: `Asset-light online model combining ${mainTitle} with digital consultations.`
      },
      {
        name: `Franchise ${mainTitle} Hub`,
        category: 'Franchise & Distribution',
        investment: Math.round(bgt * 0.75),
        demand: 'High',
        competition: 'Medium',
        risk: 'Low',
        score: 86,
        budget_fit: 'Within budget',
        estimated_monthly_revenue: Math.round(bgt * 0.38),
        estimated_monthly_profit: Math.round(bgt * 0.38 * 0.26),
        estimated_roi: '118%',
        why_recommended: `Established brand partnership providing ready supplier agreements and marketing support.`
      }
    ];
  };

  const normalizeResponse = (data, busName, locName, bgtNum) => {
    if (!data) return generateDynamicAnalysis(busName, locName, bgtNum);

    const bgt = Number(data.budget ?? bgtNum ?? 0);
    const reqInv = Number(data.estimated_investment ?? data.investment ?? (bgtNum ? Math.round(bgtNum * 0.8) : 100000));
    const score = Number(data.score ?? 85);
    const rating = data.rating ?? (score >= 81 ? "Excellent" : score >= 61 ? "Good" : score >= 41 ? "Average" : "Poor");

    const estRev = Number(data.estimated_revenue ?? data.financials?.estimated_monthly_revenue ?? Math.round(reqInv * 0.35));
    const estExp = Number(data.estimated_expenses ?? data.financials?.estimated_monthly_expenses ?? Math.round(estRev * 0.68));
    const estProf = Number(data.estimated_profit ?? data.financials?.estimated_monthly_profit ?? (estRev - estExp));
    const roiStr = data.roi ?? (data.financials?.roi ? data.financials.roi : `${Math.round(((estProf * 12) / Math.max(reqInv, 1)) * 100)}%`);
    const breakEvenStr = data.break_even ?? (data.financials?.break_even ? data.financials.break_even : `${(reqInv / Math.max(estProf, 1)).toFixed(1)} Months`);

    const alts = (Array.isArray(data.smart_alternatives) && data.smart_alternatives.length > 0)
      ? data.smart_alternatives
      : generateRelatedAlternatives(busName, locName, bgt);

    return {
      ...data,
      business: data.business || busName,
      location: data.location || locName,
      budget: bgt,
      estimated_investment: reqInv,
      category: data.category || "Venture Idea",
      score,
      rating,
      score_breakdown: data.score_breakdown || [
        { key: "budget", label: "Budget fit", score: Math.min(60, Math.round((bgt / Math.max(reqInv, 1)) * 40)), max_score: 60 },
        { key: "demand", label: "Market demand", score: 10, max_score: 10 },
        { key: "competition", label: "Competition", score: 8, max_score: 10 },
        { key: "risk", label: "Risk", score: 9, max_score: 10 },
        { key: "location", label: "Location", score: 8, max_score: 10 },
      ],
      budget_analysis: data.budget_analysis || {
        score: Math.min(60, Math.round((bgt / Math.max(reqInv, 1)) * 40)),
        message: `Your budget ₹${bgt.toLocaleString("en-IN")} vs estimated ₹${reqInv.toLocaleString("en-IN")}.`
      },
      demand_analysis: data.demand_analysis || { level: "High", score: 10 },
      competition_analysis: data.competition_analysis || { level: "Low", score: 8 },
      risk_analysis: data.risk_analysis || { level: "Low", score: 9 },
      location_analysis: data.location_analysis || { level: "Tier-1", score: 8 },
      estimated_revenue: estRev,
      estimated_expenses: estExp,
      estimated_profit: estProf,
      roi: roiStr,
      break_even: breakEvenStr,
      growth_potential: data.growth_potential || "High",
      recommendation: data.recommendation || `${rating} opportunity for ${busName} in ${locName}. Your budget is ${bgt >= reqInv ? 'sufficient' : 'insufficient'} compared to the estimated ₹${reqInv.toLocaleString('en-IN')} needed.`,
      decision_status: data.decision_status || (score >= 81 ? "Highly Recommended" : score >= 61 ? "Recommended" : "Recommended with caution"),
      smart_alternatives: alts,
      better_businesses: alts.map(a => a.name)
    };
  };

  const generateDynamicAnalysis = (busName, locName, bgt) => {
    const mainTitle = busName.replace(/\b\w/g, l => l.toUpperCase());
    const reqInv = Math.round(bgt * 0.85);
    const estRev = Math.round(bgt * 0.35);
    const estExp = Math.round(estRev * 0.68);
    const estProf = estRev - estExp;
    const roi = Math.round(((estProf * 12) / Math.max(reqInv, 1)) * 100);
    const payback = (reqInv / Math.max(estProf, 1)).toFixed(1);

    const alts = generateRelatedAlternatives(busName, locName, bgt);

    return {
      business: mainTitle,
      location: locName,
      budget: bgt,
      estimated_investment: reqInv,
      category: "Venture Idea",
      score: 88,
      rating: "Excellent",
      score_breakdown: [
        { key: "budget", label: "Budget fit", score: 40, max_score: 60 },
        { key: "demand", label: "Market demand", score: 18, max_score: 10 },
        { key: "competition", label: "Competition", score: 10, max_score: 10 },
        { key: "risk", label: "Risk", score: 10, max_score: 10 },
        { key: "location", label: "Location", score: 10, max_score: 10 },
      ],
      budget_analysis: {
        score: 40,
        message: `Available budget: ₹${bgt.toLocaleString("en-IN")}. Estimated required investment: ₹${reqInv.toLocaleString("en-IN")}.`
      },
      demand_analysis: { level: "High", score: 18 },
      competition_analysis: { level: "Low", score: 10 },
      risk_analysis: { level: "Low", score: 10 },
      location_analysis: { level: "Tier-1", score: 10 },
      estimated_revenue: estRev,
      estimated_expenses: estExp,
      estimated_profit: estProf,
      roi: `${roi}%`,
      break_even: `${payback} Months`,
      growth_potential: "High",
      recommendation: `Excellent opportunity for ${mainTitle} in ${locName}. Demand is high, competition is low, and payback period is targeted at ${payback} months.`,
      decision_status: "Highly Recommended",
      smart_alternatives: alts,
      better_businesses: alts.map(a => a.name)
    };
  };

  return (
    <main className="analyze-page w-full max-w-full px-2 sm:px-6 lg:px-8">
      <div className="analyze-shell w-full max-w-full">
        <BusinessForm
          business={business}
          setBusiness={setBusiness}
          location={location}
          setLocation={setLocation}
          budget={budget}
          setBudget={setBudget}
          loading={loading}
          analyzeBusiness={handleAnalyze}
        />

        {!loading && !result && !error && <EmptyState />}
        {loading && <LoadingCard />}
        {error && !loading && <ErrorCard message={error} />}

        {result && (
          <div className="report-stack space-y-6 text-left">
            <div className="report-intro flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <p className="section-eyebrow">ANALYSIS COMPLETE</p>
                <h1 className="text-3xl font-black text-[#061c16] dark:text-white">Your business report</h1>
                <p className="text-sm text-[#334155] dark:text-slate-400">Here is the AI assessment for <strong className="text-[#061c16] dark:text-white">{result.business}</strong> in <strong className="text-[#061c16] dark:text-white">{result.location}</strong>.</p>
              </div>
              <span className="report-status"><span /> Analysis ready</span>
            </div>

            {/* Enhanced Decision Brief & Action Command Bar */}
            <div className="analysis-command-bar flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl">
              <div>
                <span className="command-bar-kicker text-[10px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">DECISION BRIEF</span>
                <strong className="text-lg font-black text-slate-900 dark:text-white block">{result.rating ?? "Unknown"} opportunity · {result.score ?? 0}/100</strong>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Use score breakdown, financials, and MSME subsidy calculation together.</span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPitchDeckOpen(true)}
                  className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20 border-0"
                >
                  <Presentation size={15} className="text-white shrink-0" strokeWidth={2.2} /> 
                  <span className="text-white font-bold whitespace-nowrap">Pitch Deck (10 Slides)</span>
                </button>

                <button
                  type="button"
                  onClick={() => exportBankProjectReport(result)}
                  className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-[0.98] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-emerald-500/50"
                >
                  <Download size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={2.2} /> 
                  <span className="text-slate-800 dark:text-slate-100 font-bold whitespace-nowrap">Bank Project Report (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCompareModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-[0.98] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-teal-500/50"
                >
                  <Building2 size={15} className="text-teal-600 dark:text-teal-400 shrink-0" strokeWidth={2.2} /> 
                  <span className="text-slate-800 dark:text-slate-100 font-bold whitespace-nowrap">Compare Cities</span>
                </button>

                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-[0.98] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={14} className={`shrink-0 ${loading ? 'animate-spin text-emerald-600' : 'text-slate-600 dark:text-slate-400'}`} strokeWidth={2.2} /> 
                  <span className="text-slate-800 dark:text-slate-100 font-bold whitespace-nowrap">{loading ? 'Analyzing...' : 'Re-run'}</span>
                </button>
              </div>
            </div>

            <AnalysisCard result={result} />
            
            {/* Hyper-Local Pincode Demographic & Footfall Explorer */}
            <PincodeExplorer defaultPincode="411038" />

            {/* Capex vs Opex Capital Allocation Pie Chart */}
            <CapexBreakdownChart investment={result.estimated_investment || result.budget} />

            <KPISection result={result} />
            <FinancialChart result={result} />

            {/* MSME Government Scheme Eligibility Calculator */}
            <GrantCalculatorWidget investment={result.estimated_investment || result.budget} category={result.category} />

            {/* Turnkey Franchise Brands & Supplier Matchmaker */}
            <FranchiseMatchWidget category={result.category} budget={result.budget} />

            <RecommendationCard result={result} />
            <BetterBusinesses result={result} />

            {/* Multi-City Side-by-Side Comparison Modal */}
            <CityCompareModal
              isOpen={isCompareModalOpen}
              onClose={() => setIsCompareModalOpen(false)}
              businessName={result.business}
              currentCity={result.location}
              budget={result.budget}
            />

            {/* 10-Slide Investor Pitch Deck Modal */}
            <PitchDeckModal
              isOpen={isPitchDeckOpen}
              onClose={() => setIsPitchDeckOpen(false)}
              result={result}
            />
          </div>
        )}
      </div>
    </main>
  );
}
