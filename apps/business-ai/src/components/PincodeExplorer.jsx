import React, { useState } from 'react';
import { MapPin, Search, Navigation, Users, Building, TrendingUp, AlertTriangle, CheckCircle2, ArrowUpRight, Sparkles } from 'lucide-react';
import { getPincodeIntelligence, PINCODE_DATABASE } from '../services/pincodeData';

const POPULAR_PINS = [
  { pin: '411038', name: 'Kothrud, Pune' },
  { pin: '411057', name: 'Hinjawadi, Pune' },
  { pin: '560034', name: 'Koramangala, Bangalore' },
  { pin: '400050', name: 'Bandra, Mumbai' },
  { pin: '110001', name: 'Connaught Place, Delhi' },
  { pin: '500081', name: 'HITEC City, Hyderabad' },
];

export default function PincodeExplorer({ defaultPincode = "411038", onSelectPincode }) {
  const [pinInput, setPinInput] = useState(defaultPincode);
  const [data, setData] = useState(() => getPincodeIntelligence(defaultPincode));

  const handleSearch = (p) => {
    const targetPin = p || pinInput;
    const result = getPincodeIntelligence(targetPin);
    if (result) {
      setData(result);
      if (onSelectPincode) onSelectPincode(result);
    }
  };

  const handleChipClick = (p) => {
    setPinInput(p);
    handleSearch(p);
  };

  return (
    <section className="bg-[#f0fdf4] dark:bg-[#0b1329] p-6 sm:p-8 rounded-3xl border border-[#bbf7d0] dark:border-slate-800 shadow-sm space-y-6 text-left transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#047857] shadow-md shadow-[#047857]/20 flex items-center justify-center text-white shrink-0">
            <Navigation size={22} color="#ffffff" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#065f46] dark:text-emerald-400 block">HYPER-LOCAL DEMOGRAPHICS</span>
            <h2 className="text-xl font-black text-[#061c16] dark:text-white">Pincode Footfall &amp; Competitor Radar</h2>
            <p className="text-xs text-[#334155] dark:text-slate-400 font-medium">Evaluate commercial vs residential split, disposable income, and underserved market gaps</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#047857] pointer-events-none" />
            <input
              type="text"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-Digit PIN"
              className="w-full h-11 pl-9 pr-3 rounded-2xl bg-white dark:bg-slate-950 border border-[#bbf7d0] dark:border-slate-700 text-[#061c16] dark:text-white text-xs font-black focus:border-[#047857] outline-none shadow-xs font-mono"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            style={{ backgroundColor: '#047857', color: '#ffffff' }}
            className="h-11 px-5 rounded-2xl bg-[#047857] hover:bg-[#065f46] text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-[#047857]/20 border-0 shrink-0"
          >
            <Search size={14} color="#ffffff" />
            <span>Scan Area</span>
          </button>
        </div>
      </div>

      {/* Popular Pincode Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-[10px] font-black uppercase text-slate-500 shrink-0">Popular Hubs:</span>
        {POPULAR_PINS.map((item) => (
          <button
            key={item.pin}
            onClick={() => handleChipClick(item.pin)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer shrink-0 border-0 ${
              pinInput === item.pin
                ? 'bg-[#047857] text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 dark:bg-slate-900 text-[#061c16] dark:text-slate-200'
            }`}
          >
            {item.name} ({item.pin})
          </button>
        ))}
      </div>

      {/* Data Visualizer Grid */}
      {data && (
        <div className="space-y-6 pt-2">
          
          {/* Locality Banner */}
          <div className="bg-white dark:bg-slate-900/80 border border-[#bbf7d0] dark:border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#061c16] dark:text-white">{data.locality}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] dark:bg-emerald-500/20 text-[#065f46] dark:text-emerald-300 text-[10px] font-black uppercase">
                  PIN: {data.pincode}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {data.city}, {data.state} • Median Household Spend: <strong className="text-[#047857] dark:text-emerald-400">{data.avgMonthlyHouseholdSpend}/mo</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-500">Commercial Rent:</span>
              <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#061c16] dark:text-white font-mono text-xs font-black">
                {data.commercialRentRangePerSqFt}
              </span>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Footfall Score */}
            <div className="bg-white dark:bg-slate-900/80 border border-[#bbf7d0] dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-2 text-left">
              <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase">
                <span>Footfall Index</span>
                <TrendingUp size={15} className="text-[#047857]" />
              </div>
              <div className="text-2xl font-black text-[#047857] dark:text-emerald-400 font-mono">
                {data.footfallScore} / 100
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{data.footfallLevel}</p>
            </div>

            {/* Split */}
            <div className="bg-white dark:bg-slate-900/80 border border-[#bbf7d0] dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-2 text-left">
              <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase">
                <span>Density Split</span>
                <Building size={15} className="text-teal-600" />
              </div>
              <div className="text-sm font-black text-[#061c16] dark:text-white">
                {data.commercialSplit}% Commercial • {data.residentialSplit}% Residential
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                <div style={{ width: `${data.commercialSplit}%` }} className="bg-[#047857]" />
                <div style={{ width: `${data.residentialSplit}%` }} className="bg-teal-400" />
              </div>
            </div>

            {/* Income Bracket */}
            <div className="bg-white dark:bg-slate-900/80 border border-[#bbf7d0] dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-2 text-left">
              <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase">
                <span>Income Tier</span>
                <Users size={15} className="text-amber-500" />
              </div>
              <div className="text-sm font-black text-[#061c16] dark:text-white leading-tight">
                {data.medianIncomeTier}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Target: {data.targetConsumerAgeBracket}</p>
            </div>

            {/* Competitor Density */}
            <div className="bg-white dark:bg-slate-900/80 border border-[#bbf7d0] dark:border-slate-800 p-4 rounded-2xl shadow-xs space-y-2 text-left">
              <div className="flex justify-between items-center text-xs font-black text-slate-500 uppercase">
                <span>Competitor Density</span>
                <AlertTriangle size={15} className="text-rose-500" />
              </div>
              <div className="text-lg font-black text-[#061c16] dark:text-white">
                {data.competitorDensityPerKm2}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Based on registered local businesses</p>
            </div>

          </div>

          {/* Underserved Gaps & Best Fit Businesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            
            {/* Top Underserved Retail / Service Gaps */}
            <div className="bg-white dark:bg-slate-900/80 border border-[#bbf7d0] dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                <Sparkles size={15} /> Top 3 Underserved Gaps in {data.locality}
              </div>
              <div className="space-y-2">
                {data.topUnderservedGaps.map((gap, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#061c16] dark:text-slate-200 font-bold bg-[#f0fdf4] dark:bg-slate-800/60 p-2.5 rounded-xl border border-[#bbf7d0]/60">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 font-black text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Business Formats */}
            <div className="bg-white dark:bg-slate-900/80 border border-[#bbf7d0] dark:border-slate-800 p-5 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#047857] dark:text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 size={15} /> High-Viability Business Formats
              </div>
              <div className="grid grid-cols-2 gap-2">
                {data.bestFitBusinesses.map((biz, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-black text-[#061c16] dark:text-white flex items-center gap-1.5">
                    <ArrowUpRight size={13} className="text-[#047857] shrink-0" />
                    <span className="truncate">{biz}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </section>
  );
}
