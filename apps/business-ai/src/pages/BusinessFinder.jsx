import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Search, Sparkles, Building2, Bookmark,
  RefreshCw, AlertCircle, MapPin, Award, Lightbulb,
  ChevronRight, ChevronDown, DollarSign, Check
} from 'lucide-react';
import CityCompareModal from '../components/CityCompareModal';
import { generateSmartOpportunities } from '../services/opportunityIntelligence';

const AI_SERVICE_URL = '/ai-api';

const ALL_INDIAN_STATES = [
  'Maharashtra', 'Karnataka', 'Delhi NCR', 'Telangana', 'Tamil Nadu', 'Gujarat',
  'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Punjab', 'Kerala', 'Madhya Pradesh',
  'Haryana', 'Bihar', 'Odisha', 'Assam', 'Goa', 'Chhattisgarh', 'Jharkhand', 'Uttarakhand'
];

const STATE_CITIES = {
  'Maharashtra': ['Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Navi Mumbai', 'Kolhapur', 'Solapur', 'Amravati'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli-Dharwad', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Shimoga', 'Manipal'],
  'Delhi NCR': ['Delhi NCR', 'Connaught Place', 'South Delhi', 'Gurgaon', 'Noida', 'Greater Noida', 'Faridabad', 'Ghaziabad', 'Dwarka'],
  'Telangana': ['Hyderabad', 'HITEC City', 'Secunderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Erode', 'Vellore'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Junagadh'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Noida', 'Varanasi', 'Agra', 'Prayagraj (Allahabad)', 'Ghaziabad', 'Meerut', 'Bareilly'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Kharagpur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 'Alwar'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Palakkad'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Rohtak', 'Sonipat'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rishikesh']
};

const STATE_CAPITALS = {
  'Maharashtra': 'Pune',
  'Karnataka': 'Bangalore',
  'Delhi NCR': 'Delhi NCR',
  'Telangana': 'Hyderabad',
  'Tamil Nadu': 'Chennai',
  'Gujarat': 'Ahmedabad',
  'Uttar Pradesh': 'Lucknow',
  'West Bengal': 'Kolkata',
  'Rajasthan': 'Jaipur',
  'Punjab': 'Chandigarh',
  'Kerala': 'Kochi',
  'Madhya Pradesh': 'Indore',
  'Haryana': 'Gurgaon',
  'Bihar': 'Patna',
  'Odisha': 'Bhubaneswar'
};

export default function BusinessFinder() {
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const initialParams = routeLocation.state || {};

  // Form Fields in Sequential Logical Order: Business Idea -> Experience -> Budget -> State -> City
  const [interest, setInterest] = useState(initialParams.interest || '');
  const [experience, setExperience] = useState(initialParams.experience || '');
  const [budget, setBudget] = useState(initialParams.budget || '');
  const [selectedState, setSelectedState] = useState(initialParams.state || '');
  const [location, setLocation] = useState(initialParams.location || '');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const cityDropdownRef = useRef(null);

  const [riskLevel, setRiskLevel] = useState('All');
  const [sortBy, setSortBy] = useState('score');

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedIds, setSavedIds] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Available cities computed based on selected state
  const availableCities = useMemo(() => {
    if (selectedState && STATE_CITIES[selectedState]) {
      return STATE_CITIES[selectedState];
    }
    return [
      'Pune', 'Mumbai', 'Bangalore', 'Delhi NCR', 'Hyderabad', 'Chennai', 
      'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Gurgaon', 'Noida', 
      'Chandigarh', 'Indore', 'Kochi', 'Nagpur', 'Surat', 'Bhopal'
    ];
  }, [selectedState]);

  // Click outside to close city dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Trigger search on mount ONLY IF initialParams were passed from another page
  useEffect(() => {
    if (initialParams.interest || initialParams.budget || initialParams.location) {
      executeSearch(
        initialParams.interest || '',
        initialParams.experience || 'Beginner',
        initialParams.budget || '500000',
        initialParams.location || 'Pune'
      );
    }
  }, []);

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    // User can select city manually via dropdown or typing
  };

  const handleSearch = (e) => {
    e.preventDefault();
    executeSearch(interest, experience, budget, location);
  };

  const executeSearch = async (sInterest, sExperience, sBudget, sLocation) => {
    setLoading(true);
    setError('');

    const queryBudget = Number(sBudget) || 500000;
    const queryLocation = sLocation.trim() || 'Bangalore';
    const queryBusiness = sInterest.trim() || 'Business Venture';

    try {
      // 1. Try smart local opportunity intelligence model first
      const smartOpps = generateSmartOpportunities(queryBusiness, queryLocation, queryBudget);

      if (smartOpps && smartOpps.length > 0) {
        const formatted = smartOpps.map((op, idx) => ({
          id: `opp-intel-${idx}-${Date.now()}`,
          title: op.name,
          category: op.category || 'Commerce & Services',
          location: queryLocation,
          investment: op.investment,
          demand: op.demand || 'High',
          competition: op.competition || 'Medium',
          risk: op.risk || 'Low',
          score: op.score || 92,
          monthly_revenue: op.estimated_monthly_revenue,
          monthly_profit: op.estimated_monthly_profit,
          roi_percent: parseInt(op.estimated_roi) || 140,
          payback_months: Math.round((op.investment / (op.estimated_monthly_profit || 40000)) * 10) / 10 || 6.5,
          summary: op.why_recommended || `High ROI opportunity tailored for ${queryLocation}.`
        }));
        setOpportunities(formatted);
      } else {
        // Fallback generator
        setOpportunities(buildFallbackOpportunities(queryBusiness, queryLocation, queryBudget, sExperience));
      }
    } catch (err) {
      console.warn("Using offline generator fallback:", err);
      setOpportunities(buildFallbackOpportunities(queryBusiness, queryLocation, queryBudget, sExperience));
    } finally {
      setLoading(false);
    }
  };

  const buildFallbackOpportunities = (biz, loc, bgt, exp) => {
    const isBeginner = exp === 'Beginner' || !exp;
    const mainTitle = biz || 'Commercial Enterprise';

    const opp1 = {
      id: `opp-1-${Date.now()}`,
      title: `Specialty ${mainTitle} Studio`,
      category: 'Retail & Experience',
      location: loc,
      investment: Math.round(bgt * 0.70),
      demand: 'High',
      competition: 'Low',
      risk: 'Low',
      score: 95,
      monthly_revenue: Math.round(bgt * 0.40),
      monthly_profit: Math.round(bgt * 0.40 * 0.38),
      roi_percent: Math.round(((bgt * 0.40 * 0.38 * 12) / (bgt * 0.70)) * 100),
      payback_months: 5.5,
      summary: `High-margin direct consumer model in ${loc} with rapid customer payback and prime unit economics.`
    };

    const opp2 = {
      id: `opp-2-${Date.now()}`,
      title: `Micro-Franchise ${mainTitle} Express`,
      category: 'Franchise & QSR',
      location: loc,
      investment: Math.round(bgt * 0.45),
      demand: 'High',
      competition: 'Medium',
      risk: 'Low',
      score: 88,
      monthly_revenue: Math.round(bgt * 0.28),
      monthly_profit: Math.round(bgt * 0.28 * 0.35),
      roi_percent: Math.round(((bgt * 0.28 * 0.35 * 12) / (bgt * 0.45)) * 100),
      payback_months: 4.8,
      summary: `Compact capex option fitting your ₹${bgt.toLocaleString()} budget with minimal overhead in ${loc}.`
    };

    const opp3 = {
      id: `opp-3-${Date.now()}`,
      title: isBeginner ? `Digital & Delivery ${mainTitle}` : `B2B ${mainTitle} Network`,
      category: 'Technology & Managed Services',
      location: loc,
      investment: Math.round(bgt * 0.30),
      demand: 'Very High',
      competition: 'Low',
      risk: 'Low',
      score: 94,
      monthly_revenue: Math.round(bgt * 0.32),
      monthly_profit: Math.round(bgt * 0.32 * 0.48),
      roi_percent: Math.round(((bgt * 0.32 * 0.48 * 12) / (bgt * 0.30)) * 100),
      payback_months: 3.5,
      summary: `Asset-light venture maximizing profit margin via digital client acquisition and online workflows.`
    };

    return [opp1, opp2, opp3];
  };

  const filteredOpportunities = useMemo(() => {
    let result = [...opportunities];
    if (riskLevel !== 'All') {
      result = result.filter(o => o.risk.toLowerCase() === riskLevel.toLowerCase());
    }
    if (sortBy === 'score') {
      result.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'roi') {
      result.sort((a, b) => b.roi_percent - a.roi_percent);
    } else if (sortBy === 'investment') {
      result.sort((a, b) => a.investment - b.investment);
    }
    return result;
  }, [opportunities, riskLevel, sortBy]);

  const toggleSave = (item) => {
    const id = typeof item === 'object' ? item.id : item;
    let newSaved;
    if (savedIds.includes(id)) {
      newSaved = savedIds.filter(i => i !== id);
    } else {
      newSaved = [...savedIds, id];
      if (typeof item === 'object') {
        try {
          const localStr = localStorage.getItem('business_finder_history');
          const existing = localStr !== null ? JSON.parse(localStr) : [];
          const newItem = {
            id: Date.now(),
            business: item.title || item.name || 'Business Opportunity',
            location: item.location || location || 'Target City',
            budget: Number(budget || item.investment || 500000),
            estimated_investment: item.investment || Math.round((budget || 500000) * 0.85),
            score: item.score || 88,
            rating: item.rating || (item.score >= 81 ? 'Excellent' : 'Good'),
            monthly_profit: item.monthly_profit || Math.round((item.investment || 500000) * 0.15),
            monthly_revenue: item.monthly_revenue || Math.round((item.investment || 500000) * 0.35),
            roi_percent: item.roi_percent || 120,
            payback_months: item.payback_months || 6.5,
            createdAt: new Date().toISOString(),
            summary: item.summary || item.why_recommended || `High feasibility opportunity in ${item.location || location}.`
          };
          const updated = [newItem, ...existing.filter(i => i.business !== newItem.business)];
          localStorage.setItem('business_finder_history', JSON.stringify(updated));
        } catch (e) {
          console.warn("Could not save to history:", e);
        }
      }
    }
    setSavedIds(newSaved);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070d19] text-[#0f172a] dark:text-white font-sans antialiased pb-16 transition-colors duration-200">
      
      {/* Header Banner */}
      <section className="relative border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-4 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" /> AI OPPORTUNITY DISCOVERY ENGINE
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Find &amp; Compare <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700">Real Business Ideas</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
            Evaluate real-world feasibility across any State &amp; City in India. Enter your business details in the logical sequence below.
          </p>
        </div>
      </section>

      {/* Main Search Controls Form — Sequential Flow */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        <form
          onSubmit={handleSearch}
          className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0b1329] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-emerald-950/10 dark:shadow-emerald-950/40 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Step 1: Business Idea */}
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <Lightbulb size={13} className="text-emerald-600 dark:text-emerald-400" /> 1. Business Idea
              </label>
              <input
                type="text"
                value={interest}
                onChange={e => setInterest(e.target.value)}
                placeholder="e.g. Tea Stall, Cloud Kitchen"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0f172a] dark:text-white text-xs font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
              />
            </div>

            {/* Step 2: Available Budget */}
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <DollarSign size={13} className="text-emerald-600 dark:text-emerald-400" /> 2. Available Budget (₹)
              </label>
              <input
                type="number"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                placeholder="e.g. 500000"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0f172a] dark:text-white text-xs font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                min="1"
                step="any"
                required
              />
            </div>

            {/* Step 3: Founder Experience */}
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <Award size={13} className="text-amber-500" /> 3. Founder Experience
              </label>
              <select
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0f172a] dark:text-white text-xs font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
              >
                <option value="">-- Select Experience --</option>
                <option value="Beginner">Beginner (First-Time)</option>
                <option value="Intermediate">Intermediate (1-3 Yrs)</option>
                <option value="Experienced">Experienced / Expert</option>
              </select>
            </div>

            {/* Step 4: State / Region */}
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <MapPin size={13} className="text-teal-500" /> 4. State / Region
              </label>
              <select
                value={selectedState}
                onChange={e => handleStateChange(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0f172a] dark:text-white text-xs font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
              >
                <option value="">-- Select State --</option>
                {ALL_INDIAN_STATES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Step 5: Target City / Area with Smart Dropdown & Manual Input */}
            <div className="space-y-1.5 text-left relative" ref={cityDropdownRef}>
              <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <Building2 size={13} className="text-emerald-600 dark:text-emerald-400" /> 5. Target City / Area
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={e => {
                    setLocation(e.target.value);
                    setIsCityDropdownOpen(true);
                  }}
                  onFocus={() => setIsCityDropdownOpen(true)}
                  placeholder="e.g. Pune, Mumbai, Bangalore"
                  className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[#0f172a] dark:text-white text-xs font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setIsCityDropdownOpen(prev => !prev)}
                  style={{ background: 'transparent', border: 'none', outline: 'none' }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition cursor-pointer p-0 m-0 border-0 bg-transparent shadow-none"
                  title="Click to view all cities"
                >
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isCityDropdownOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                </button>
              </div>

              {/* Dropdown Menu Popup */}
              {isCityDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 max-h-64 overflow-hidden bg-white dark:bg-slate-900 border border-[#bbf7d0] dark:border-slate-700 rounded-2xl shadow-2xl z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-[#f0fdf4]/50 dark:bg-slate-950">
                    <span>{selectedState ? `${selectedState} Cities` : 'Popular Indian Cities'}</span>
                    <span className="text-[9px] text-[#047857] dark:text-emerald-400 font-bold bg-[#dcfce7] dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      {availableCities.length} Cities
                    </span>
                  </div>
                  <div className="max-h-52 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5">
                    {availableCities.map(city => {
                      const isSelected = location && location.trim().toLowerCase() === city.toLowerCase();
                      return (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setLocation(city);
                            if (!selectedState) {
                              const foundState = Object.keys(STATE_CITIES).find(st => STATE_CITIES[st].includes(city));
                              if (foundState) setSelectedState(foundState);
                            }
                            setIsCityDropdownOpen(false);
                          }}
                          style={{ border: 'none' }}
                          className={`w-full px-3.5 py-2.5 rounded-xl text-left flex items-center justify-between transition cursor-pointer border-0 ${
                            isSelected
                              ? 'bg-[#047857] text-white font-black shadow-xs'
                              : 'text-slate-700 dark:text-slate-200 font-medium hover:bg-[#f0fdf4] dark:hover:bg-slate-800 hover:text-[#047857] dark:hover:text-emerald-300'
                          }`}
                        >
                          <span className="text-xs">{city}</span>
                          {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-300 border border-slate-300 dark:border-slate-700 text-xs font-bold transition cursor-pointer"
            >
              <Building2 size={16} /> Compare Cities Side-by-Side
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#047857', color: '#ffffff' }}
              className="px-8 h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-700/30 transition cursor-pointer border-0"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Analyzing Markets...
                </>
              ) : (
                <>
                  <Search size={16} color="#ffffff" strokeWidth={2.5} /> Evaluate Opportunities
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2 font-medium text-left">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Toolbar - Mint Frosted Theme */}
        {opportunities.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#f0fdf4] dark:bg-[#0b1329] p-4 sm:p-5 rounded-3xl border border-[#bbf7d0] dark:border-slate-800 shadow-sm transition-colors duration-200 text-left">
              <h2 className="text-lg font-black text-[#061c16] dark:text-white flex items-center gap-2">
                <Building2 size={18} className="text-[#047857] dark:text-emerald-400" />
                Matching Opportunities ({filteredOpportunities.length})
              </h2>
              <span className="text-xs text-[#334155] dark:text-slate-400 font-medium">
                Target City: <strong className="text-[#061c16] dark:text-white">{location || 'Custom City'} {selectedState ? `(${selectedState})` : ''}</strong> • Level: <strong className="text-amber-700 dark:text-amber-400">{experience || 'Standard'}</strong> • Budget: <strong className="text-[#047857] dark:text-emerald-400">₹{Number(budget || 0).toLocaleString()}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opp) => {
                const isSaved = savedIds.includes(opp.id);
                return (
                  <div
                    key={opp.id}
                    className="p-6 rounded-3xl bg-[#f0fdf4] dark:bg-[#0b1329] border border-[#bbf7d0] dark:border-slate-800 hover:border-emerald-500/60 hover:shadow-xl transition-all duration-200 space-y-4 shadow-sm flex flex-col justify-between group text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-3 py-0.5 rounded-full bg-[#dcfce7] dark:bg-emerald-500/20 border border-[#86efac] dark:border-emerald-400/30 text-[#065f46] dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                          {opp.category}
                        </span>
                        <button
                          onClick={() => toggleSave(opp)}
                          className={`p-2 rounded-xl border transition cursor-pointer shadow-xs ${
                            isSaved
                              ? 'bg-[#dcfce7] border-[#86efac] text-[#065f46]'
                              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-[#061c16] dark:hover:text-white'
                          }`}
                          title="Save to bookmarks"
                        >
                          <Bookmark size={14} className={isSaved ? 'fill-[#047857]' : ''} />
                        </button>
                      </div>

                      <h3 className="text-xl font-black text-[#061c16] dark:text-white group-hover:text-[#047857] dark:group-hover:text-emerald-400 transition">
                        {opp.title}
                      </h3>

                      <p className="text-xs text-[#334155] dark:text-slate-300 leading-relaxed font-medium">
                        {opp.summary}
                      </p>

                      {/* Metric Badges */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#bbf7d0]/80 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Investment</span>
                          <span className="text-sm sm:text-base font-black text-[#061c16] dark:text-white">₹{opp.investment.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Est. ROI</span>
                          <span className="text-sm sm:text-base font-black text-teal-700 dark:text-teal-400">{opp.roi_percent}% / yr</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Monthly Profit</span>
                          <span className="text-sm sm:text-base font-black text-[#047857] dark:text-emerald-400">₹{(opp.monthly_profit || 45000).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Payback</span>
                          <span className="text-sm sm:text-base font-black text-amber-700 dark:text-amber-400">{opp.payback_months} mos</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/business-finder/${opp.id}`}
                      state={{ opportunity: opp }}
                      style={{ backgroundColor: '#047857', color: '#ffffff' }}
                      className="w-full h-11 rounded-2xl bg-[#047857] hover:bg-[#065f46] text-white font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-[#047857]/20 border-0 mt-3"
                    >
                      <span>View Full Feasibility Report</span>
                      <ChevronRight size={15} color="#ffffff" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Multi-City Comparison Modal */}
      <CityCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        businessName={interest || 'Business Venture'}
        currentCity={location || 'Pune'}
        budget={budget || 500000}
      />
    </div>
  );
}
