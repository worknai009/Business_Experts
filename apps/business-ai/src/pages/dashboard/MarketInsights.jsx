import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, ArrowLeft, MapPin, Sparkles, Rocket, Building2,
  ShieldCheck, DollarSign, BarChart3, Download, Compass, ChevronRight, CheckCircle2
} from 'lucide-react';
import { exportFeasibilityPdfReport } from '../../utils/ReportPdfExporter';

const CITY_RADAR_DATA = {
  mumbai: {
    name: 'Mumbai, Maharashtra',
    tier: 'Tier-1 Metro',
    demandScore: 94,
    rentPerSqFt: '₹140 – ₹220',
    purchasingPower: 'Very High',
    saturation: 'High',
    topSectors: [
      { name: 'Cloud Kitchen & Tiffin Delivery', score: 92, roi: '185%', profit: '₹84,000 / mo', risk: 'Low' },
      { name: 'Quick-Commerce Dark Store Hub', score: 89, roi: '160%', profit: '₹1,20,000 / mo', risk: 'Medium' },
      { name: 'EV Two-Wheeler Charging Kiosk', score: 87, roi: '145%', profit: '₹65,000 / mo', risk: 'Low' },
      { name: 'Corporate Laundromat & Dry Cleaning', score: 85, roi: '130%', profit: '₹55,000 / mo', risk: 'Low' }
    ]
  },
  bangalore: {
    name: 'Bangalore, Karnataka',
    tier: 'Tier-1 Tech Hub',
    demandScore: 96,
    rentPerSqFt: '₹90 – ₹160',
    purchasingPower: 'High',
    saturation: 'Moderate',
    topSectors: [
      { name: 'Specialty Coffee & Co-Working Cafe', score: 95, roi: '210%', profit: '₹1,10,000 / mo', risk: 'Low' },
      { name: 'Electronics & Gadget Repair Hub', score: 91, roi: '190%', profit: '₹75,000 / mo', risk: 'Low' },
      { name: 'Healthy Meal Prep & Salad Bar', score: 88, roi: '175%', profit: '₹68,000 / mo', risk: 'Medium' },
      { name: 'B2B Office Cleaning & Facilities', score: 86, roi: '150%', profit: '₹95,000 / mo', risk: 'Low' }
    ]
  },
  delhi: {
    name: 'Delhi NCR (Gurugram/Noida)',
    tier: 'Tier-1 Commercial',
    demandScore: 93,
    rentPerSqFt: '₹80 – ₹150',
    purchasingPower: 'Very High',
    saturation: 'High',
    topSectors: [
      { name: 'D2C Packaging & E-Commerce Fulfillment', score: 93, roi: '195%', profit: '₹1,40,000 / mo', risk: 'Low' },
      { name: 'Gourmet Street Food & Chaat Kiosk', score: 90, roi: '220%', profit: '₹90,000 / mo', risk: 'Low' },
      { name: 'Auto Detailing & Ceramic Coating', score: 88, roi: '165%', profit: '₹85,000 / mo', risk: 'Medium' },
      { name: 'Cold Storage Micro-Depot', score: 86, roi: '140%', profit: '₹1,15,000 / mo', risk: 'Medium' }
    ]
  },
  pune: {
    name: 'Pune, Maharashtra',
    tier: 'Tier-2 High-Growth',
    demandScore: 89,
    rentPerSqFt: '₹55 – ₹95',
    purchasingPower: 'Moderate-High',
    saturation: 'Low-Medium',
    topSectors: [
      { name: 'Student Tiffin & Co-Living Mess', score: 94, roi: '230%', profit: '₹78,000 / mo', risk: 'Low' },
      { name: 'Two-Wheeler Service & Spares Hub', score: 90, roi: '180%', profit: '₹62,000 / mo', risk: 'Low' },
      { name: 'Boutique Bakery & Dessert Studio', score: 87, roi: '160%', profit: '₹52,000 / mo', risk: 'Medium' },
      { name: 'Gym & Crossfit Functional Studio', score: 84, roi: '135%', profit: '₹80,000 / mo', risk: 'Medium' }
    ]
  },
  hyderabad: {
    name: 'Hyderabad, Telangana',
    tier: 'Tier-1 IT / Pharma',
    demandScore: 91,
    rentPerSqFt: '₹60 – ₹110',
    purchasingPower: 'High',
    saturation: 'Medium',
    topSectors: [
      { name: 'Biryani & Regional Cloud Kitchen', score: 96, roi: '240%', profit: '₹1,25,000 / mo', risk: 'Low' },
      { name: 'Diagnostic Collection Center & Lab', score: 89, roi: '170%', profit: '₹90,000 / mo', risk: 'Low' },
      { name: 'Organic Supermarket & Fresh Mart', score: 86, roi: '145%', profit: '₹70,000 / mo', risk: 'Medium' },
      { name: 'Commercial Pest Control & Sanitation', score: 83, roi: '155%', profit: '₹60,000 / mo', risk: 'Low' }
    ]
  },
  ahmedabad: {
    name: 'Ahmedabad, Gujarat',
    tier: 'Tier-2 Commercial',
    demandScore: 88,
    rentPerSqFt: '₹45 – ₹80',
    purchasingPower: 'High',
    saturation: 'Low-Medium',
    topSectors: [
      { name: 'Textile & Garment Direct Retail', score: 93, roi: '205%', profit: '₹95,000 / mo', risk: 'Low' },
      { name: 'Beverage & Mocktail Lounge Bar', score: 89, roi: '185%', profit: '₹72,000 / mo', risk: 'Low' },
      { name: 'Solar Rooftop Installation Agency', score: 87, roi: '160%', profit: '₹1,10,000 / mo', risk: 'Medium' },
      { name: 'Spices & Dry Fruit Packaging Unit', score: 85, roi: '150%', profit: '₹65,000 / mo', risk: 'Low' }
    ]
  }
};

export default function MarketInsights() {
  const [selectedCity, setSelectedCity] = useState('mumbai');
  const [compareCity, setCompareCity] = useState('bangalore');

  const current = CITY_RADAR_DATA[selectedCity] || CITY_RADAR_DATA.mumbai;
  const compare = CITY_RADAR_DATA[compareCity] || CITY_RADAR_DATA.bangalore;

  const handleDownloadCityDossier = () => {
    exportFeasibilityPdfReport({
      business: `Regional Market Radar — ${current.name}`,
      location: current.name,
      budget: 500000,
      estimated_investment: 450000,
      monthly_profit: 85000,
      monthly_revenue: 280000,
      roi: '180%',
      break_even: '7.2 Months',
      score: current.demandScore,
      rating: 'Prime Investment Sector',
      demand: `Demand Index: ${current.demandScore}/100`,
      risk: 'Low-to-Moderate',
      swot: {
        strengths: [
          `Dominant purchasing power tier (${current.purchasingPower})`,
          `Competitive rental index: ${current.rentPerSqFt} / sq.ft`,
          'Strong supplier and logistics infrastructure density'
        ],
        weaknesses: [
          `Market saturation tier is rated ${current.saturation}`,
          'Initial local brand building required against incumbents'
        ],
        opportunities: [
          'High demand for top sectors: ' + current.topSectors.map(s => s.name).slice(0, 2).join(', '),
          'PMEGP & MUDRA government subsidy eligibility for new registrations'
        ],
        threats: [
          'Rising commercial leasing deposit in prime pockets'
        ]
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <Link to="/dashboard" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1">
              <ArrowLeft size={14} /> <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center space-x-2">
              <Compass className="text-emerald-600 dark:text-emerald-400" size={32} />
              <span>City Demand Radar &amp; Market Intelligence</span>
            </h1>
            <p className="text-xs text-[#64748b] dark:text-slate-400 font-medium">
              Real-time regional demand density, rental benchmarks, and high-viability business sectors across top Indian cities.
            </p>
          </div>

          <button
            onClick={handleDownloadCityDossier}
            style={{ backgroundColor: '#047857', color: '#ffffff' }}
            className="px-4 py-2.5 rounded-xl hover:bg-[#065f46] text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-[#047857]/20 border-0 self-start sm:self-auto"
          >
            <Download size={15} color="#ffffff" strokeWidth={2.5} />
            <span>Export City Dossier (PDF)</span>
          </button>
        </div>

        {/* City Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {Object.entries(CITY_RADAR_DATA).map(([key, city]) => (
            <button
              key={key}
              onClick={() => setSelectedCity(key)}
              style={selectedCity === key ? { backgroundColor: '#047857', color: '#ffffff' } : {}}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                selectedCity === key
                  ? 'bg-[#047857] text-white shadow-md shadow-[#047857]/20 border-0'
                  : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-[#0f172a] dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <MapPin size={13} className={selectedCity === key ? 'text-white' : 'text-emerald-600'} />
              <span>{city.name.split(',')[0]}</span>
            </button>
          ))}
        </div>

        {/* City Score & Metric Cards - Mint Frosted */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#f0fdf4] dark:bg-[#0b1329] p-5 rounded-3xl border border-[#bbf7d0] dark:border-slate-800 shadow-sm space-y-1 text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#065f46] dark:text-slate-400">Demand Index</span>
            <div className="text-3xl font-black text-[#047857] dark:text-emerald-400">{current.demandScore} <span className="text-xs font-normal text-slate-500">/ 100</span></div>
            <p className="text-[11px] text-[#334155] dark:text-slate-400 font-medium">Top 5% nationwide</p>
          </div>

          <div className="bg-[#f0fdf4] dark:bg-[#0b1329] p-5 rounded-3xl border border-[#bbf7d0] dark:border-slate-800 shadow-sm space-y-1 text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#065f46] dark:text-slate-400">Avg Commercial Rent</span>
            <div className="text-2xl font-black text-[#061c16] dark:text-white">{current.rentPerSqFt}</div>
            <p className="text-[11px] text-[#334155] dark:text-slate-400 font-medium">Per sq.ft monthly</p>
          </div>

          <div className="bg-[#f0fdf4] dark:bg-[#0b1329] p-5 rounded-3xl border border-[#bbf7d0] dark:border-slate-800 shadow-sm space-y-1 text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#065f46] dark:text-slate-400">Purchasing Power</span>
            <div className="text-2xl font-black text-amber-700 dark:text-amber-400">{current.purchasingPower}</div>
            <p className="text-[11px] text-[#334155] dark:text-slate-400 font-medium">Consumer spending rank</p>
          </div>

          <div className="bg-[#f0fdf4] dark:bg-[#0b1329] p-5 rounded-3xl border border-[#bbf7d0] dark:border-slate-800 shadow-sm space-y-1 text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#065f46] dark:text-slate-400">Market Saturation</span>
            <div className="text-2xl font-black text-teal-700 dark:text-teal-400">{current.saturation}</div>
            <p className="text-[11px] text-[#334155] dark:text-slate-400 font-medium">Competition density</p>
          </div>
        </div>

        {/* High Demand Sectors in Selected City */}
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#061c16] dark:text-white flex items-center gap-2">
              <Sparkles size={20} className="text-[#047857]" />
              <span>Top High-Viability Business Sectors in {current.name.split(',')[0]}</span>
            </h2>
            <span className="text-xs text-[#334155] dark:text-slate-400 font-medium">Updated Weekly</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {current.topSectors.map((sector, i) => (
              <div
                key={i}
                className="bg-[#f0fdf4] dark:bg-[#0b1329] p-6 rounded-3xl border border-[#bbf7d0] dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-500/60 hover:shadow-md transition group text-left"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full bg-[#dcfce7] text-[#065f46] dark:bg-emerald-500/20 dark:text-emerald-300 border border-[#86efac] dark:border-emerald-500/30">
                      Score: {sector.score}/100
                    </span>
                    <span className="text-xs font-black text-amber-700 dark:text-amber-400 font-mono">
                      ROI: {sector.roi}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#061c16] dark:text-white group-hover:text-[#047857] transition">
                    {sector.name}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-[#334155] dark:text-slate-400">
                    <span>Est. Profit: <strong className="text-[#047857] dark:text-emerald-300 font-bold">{sector.profit}</strong></span>
                    <span>Risk: <strong className="text-[#061c16] dark:text-white font-bold">{sector.risk}</strong></span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#bbf7d0]/80 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-[#334155] dark:text-slate-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 size={13} className="text-[#047857]" /> PMEGP / MUDRA Eligible
                  </span>
                  <Link
                    to={`/business-finder`}
                    className="text-xs font-bold text-[#047857] dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Analyze</span>
                    <Rocket size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side-by-Side City Comparator */}
        <div className="bg-white dark:bg-[#0b1329] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-[#0f172a] dark:text-white">Side-by-Side City Market Comparison</h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400">Compare demand strength and operating costs across two target territories.</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#64748b] dark:text-slate-400">Compare with:</span>
              <select
                value={compareCity}
                onChange={(e) => setCompareCity(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0f172a] dark:text-white outline-none cursor-pointer"
              >
                {Object.entries(CITY_RADAR_DATA).map(([k, c]) => (
                  <option key={k} value={k}>{c.name.split(',')[0]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-base text-[#0f172a] dark:text-white flex items-center gap-2">
                <MapPin size={16} className="text-emerald-600" />
                <span>{current.name}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748b] dark:text-slate-400">Demand Viability:</span>
                  <span className="font-black text-emerald-600">{current.demandScore}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${current.demandScore}%` }} />
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[#64748b] dark:text-slate-400">Commercial Rent / sq.ft:</span>
                  <span className="font-bold text-[#0f172a] dark:text-white">{current.rentPerSqFt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b] dark:text-slate-400">Purchasing Power:</span>
                  <span className="font-bold text-amber-600">{current.purchasingPower}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-base text-[#0f172a] dark:text-white flex items-center gap-2">
                <MapPin size={16} className="text-indigo-600" />
                <span>{compare.name}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#64748b] dark:text-slate-400">Demand Viability:</span>
                  <span className="font-black text-indigo-600">{compare.demandScore}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${compare.demandScore}%` }} />
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-[#64748b] dark:text-slate-400">Commercial Rent / sq.ft:</span>
                  <span className="font-bold text-[#0f172a] dark:text-white">{compare.rentPerSqFt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b] dark:text-slate-400">Purchasing Power:</span>
                  <span className="font-bold text-amber-600">{compare.purchasingPower}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
