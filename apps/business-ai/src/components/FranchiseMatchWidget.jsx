import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ShieldCheck, ArrowRight, Check, Sparkles, Building2 } from 'lucide-react';
import { FRANCHISE_SUPPLIERS } from '../services/franchiseService';

export default function FranchiseMatchWidget({ category = "", budget = 500000 }) {
  // Find top matching franchises based on category or budget
  const matches = FRANCHISE_SUPPLIERS.filter(f => {
    if (category && f.category.toLowerCase().includes(category.toLowerCase())) return true;
    return f.investment <= budget * 1.3;
  }).slice(0, 3);

  if (matches.length === 0) return null;

  return (
    <section className="bg-[#f0fdf4] dark:bg-[#0b1329] p-6 sm:p-8 rounded-3xl border border-[#bbf7d0] dark:border-slate-800 shadow-sm space-y-6 text-left transition-colors duration-200">
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#047857] shadow-md shadow-[#047857]/20 flex items-center justify-center text-white shrink-0">
            <Store size={22} color="#ffffff" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#065f46] dark:text-emerald-400 block">TURNKEY OPTIONS</span>
            <h2 className="text-xl font-black text-[#061c16] dark:text-white">Verified Franchise &amp; Supplier Matches</h2>
            <p className="text-xs text-[#334155] dark:text-slate-400 font-medium">Turnkey brand setups and machinery suppliers matched to your budget</p>
          </div>
        </div>

        <Link
          to="/franchise-directory"
          className="text-xs font-black text-[#047857] dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>Explore All 25+ Brands</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {matches.map((brand) => (
          <div
            key={brand.id}
            className="bg-white dark:bg-slate-900/80 border border-[#bbf7d0] dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 text-left"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#065f46] text-[10px] font-black uppercase">
                  {brand.category}
                </span>
                <span className="text-xs font-black text-amber-600">★ {brand.rating}</span>
              </div>

              <h3 className="text-base font-black text-[#061c16] dark:text-white">{brand.name}</h3>
              <p className="text-xs text-slate-500 font-medium line-clamp-2">{brand.description}</p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Investment</span>
                  <span className="font-black text-[#061c16] dark:text-white">{brand.investmentFormatted}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Est. Profit</span>
                  <span className="font-black text-[#047857] dark:text-emerald-400">₹{brand.estMonthlyProfit.toLocaleString('en-IN')}/mo</span>
                </div>
              </div>
            </div>

            <Link
              to="/franchise-directory"
              style={{ backgroundColor: '#047857', color: '#ffffff' }}
              className="w-full h-9 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white font-black text-xs flex items-center justify-center gap-1 transition shadow-xs border-0"
            >
              <span>View Franchise Prospectus</span>
              <ArrowRight size={13} color="#ffffff" />
            </Link>
          </div>
        ))}
      </div>

    </section>
  );
}
