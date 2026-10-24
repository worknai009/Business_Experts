import React, { useState } from 'react';
import { 
  Building2, Search, Filter, Sparkles, CheckCircle2, ShieldCheck, 
  IndianRupee, ArrowRight, Phone, Mail, User, X, Check, Store, Truck, 
  TrendingUp, Clock, MapPin, ExternalLink
} from 'lucide-react';
import { FRANCHISE_SUPPLIERS, getFranchises, saveFranchiseInquiry } from '../services/franchiseService';

const CATEGORIES = ["All", "QSR & Beverages", "Pet Care & Services", "EV & Green Tech", "Fitness & Wellness", "Retail & Grocery"];

const BUDGET_TIERS = [
  { label: "All Budgets", max: null },
  { label: "Under ₹5 Lakhs", max: 500000 },
  { label: "₹5L – ₹10 Lakhs", max: 1000000 },
  { label: "₹10 Lakhs+", max: null },
];

export default function FranchiseDirectory() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBudget, setSelectedBudget] = useState(null);
  
  // Inquiry Modal State
  const [activeBrand, setActiveBrand] = useState(null);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const filteredBrands = getFranchises({
    category: selectedCategory,
    maxInvestment: selectedBudget,
    searchQuery: search
  });

  const handleOpenInquiry = (brand) => {
    setActiveBrand(brand);
    setInquirySuccess(false);
    setUserMessage(`Hi, I am interested in launching a ${brand.name} in my area. Please share the partner prospectus and unit economics.`);
    
    // Auto-fill from localStorage if available
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.fullName) setUserName(user.fullName);
    if (user.phone) setUserPhone(user.phone);
  };

  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!userName || !userPhone) return;

    saveFranchiseInquiry({
      brandId: activeBrand.id,
      brandName: activeBrand.name,
      applicantName: userName,
      applicantPhone: userPhone,
      targetCity: userCity || "Not Specified",
      message: userMessage
    });

    setInquirySuccess(true);
  };

  return (
    <main className="min-h-screen pt-4 sm:pt-6 pb-16 px-4 sm:px-6 lg:px-8 xl:px-12 text-[#061c16] dark:text-slate-100 font-sans antialiased text-left">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Hero Banner - Mint Frosted Theme with Stats Card */}
        <section className="bg-[#f0fdf4] dark:bg-[#0b1329] p-6 sm:p-8 rounded-3xl border border-[#bbf7d0] dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden transition-colors duration-200">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcfce7] dark:bg-emerald-500/20 border border-[#86efac] dark:border-emerald-400/30 text-[#065f46] dark:text-emerald-300 text-xs font-black uppercase tracking-wider shadow-xs">
              <ShieldCheck size={14} /> Verified Franchise &amp; Supplier Matchmaker
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-[#061c16] dark:text-white tracking-tight leading-tight">
              Connect Directly with <span className="text-[#047857] dark:text-emerald-400">Verified Franchise Brands</span> &amp; Equipment Suppliers.
            </h1>

            <p className="text-xs sm:text-sm text-[#334155] dark:text-slate-300 font-medium leading-relaxed">
              Explore turnkey business models with guaranteed supply chain, machine setups, SOP training, and transparent royalty terms across India.
            </p>
          </div>

          {/* Right-Side Stat Cards */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-[#bbf7d0] dark:border-slate-800 shadow-xs flex items-center justify-around gap-4 shrink-0 lg:min-w-[340px]">
            <div className="text-center space-y-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-[#047857] dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Store size={16} />
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#061c16] dark:text-white">25+</div>
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">Verified Brands</div>
            </div>

            <div className="w-px h-10 bg-[#bbf7d0] dark:bg-slate-800" />

            <div className="text-center space-y-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-[#047857] dark:text-emerald-400 flex items-center justify-center mx-auto">
                <IndianRupee size={16} />
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#061c16] dark:text-white">₹2L–₹15L</div>
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">Capex Range</div>
            </div>

            <div className="w-px h-10 bg-[#bbf7d0] dark:bg-slate-800" />

            <div className="text-center space-y-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-[#047857] dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Sparkles size={16} />
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#047857] dark:text-emerald-400">0%</div>
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">Royalty Models</div>
            </div>
          </div>
        </section>

        {/* Filters & Search Toolbar */}
        <div className="bg-[#f0fdf4] dark:bg-[#0b1329] p-4 sm:p-6 rounded-3xl border border-[#bbf7d0] dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#047857] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search brands (e.g. Chai Point, PetSpa, EV Swap)..."
                className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white dark:bg-slate-950 border border-[#bbf7d0] dark:border-slate-700 text-[#061c16] dark:text-white text-xs font-bold focus:border-[#047857] outline-none shadow-xs"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black transition cursor-pointer whitespace-nowrap border-0 ${
                    selectedCategory === cat
                      ? 'bg-[#047857] text-white shadow-md shadow-[#047857]/20'
                      : 'bg-white hover:bg-slate-50 dark:bg-slate-900 text-[#061c16] dark:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Sub-filter */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#bbf7d0]/80 dark:border-slate-800 text-xs">
            <span className="text-[10px] font-black uppercase text-slate-500">Investment Cap:</span>
            {BUDGET_TIERS.map((tier, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedBudget(tier.max)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer border-0 ${
                  selectedBudget === tier.max
                    ? 'bg-[#047857] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 dark:bg-slate-900 text-[#061c16] dark:text-slate-200'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>

        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="bg-[#f0fdf4] dark:bg-[#0b1329] border border-[#bbf7d0] dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-emerald-500/60 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                
                {/* Badge & Rating Header */}
                <div className="flex items-start justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#dcfce7] dark:bg-emerald-500/20 border border-[#86efac] dark:border-emerald-400/30 text-[#065f46] dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                    {brand.category}
                  </span>
                  
                  <div className="flex items-center gap-1 text-xs font-black text-amber-600 dark:text-amber-400 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-500/30">
                    <span>★ {brand.rating}</span>
                    <span className="text-[10px] text-slate-400 font-bold">(Verified)</span>
                  </div>
                </div>

                {/* Brand Name & Description */}
                <div>
                  <h3 className="text-xl font-black text-[#061c16] dark:text-white group-hover:text-[#047857] dark:group-hover:text-emerald-400 transition">
                    {brand.name}
                  </h3>
                  <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 block mt-0.5">{brand.type}</span>
                  <p className="text-xs text-[#334155] dark:text-slate-300 font-medium leading-relaxed mt-2">
                    {brand.description}
                  </p>
                </div>

                {/* Key Financial Metrics */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900/80 border border-[#bbf7d0]/80 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Investment</span>
                    <span className="text-sm font-black text-[#061c16] dark:text-white">{brand.investmentFormatted}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Est. Profit</span>
                    <span className="text-sm font-black text-[#047857] dark:text-emerald-400">₹{brand.estMonthlyProfit.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Payback</span>
                    <span className="text-sm font-black text-amber-600 dark:text-amber-400">{brand.paybackMonths} Months</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Min Space</span>
                    <span className="text-sm font-black text-[#061c16] dark:text-white">{brand.minSpaceSqFt > 0 ? `${brand.minSpaceSqFt} sq.ft` : "Mobile Van"}</span>
                  </div>
                </div>

                {/* Royalty Model & Support Highlights */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-[#dcfce7]/60 dark:bg-slate-900 p-2 rounded-xl border border-[#bbf7d0]/60">
                    ⚡ <strong>Royalty:</strong> {brand.royaltyModel}
                  </div>
                  <div className="space-y-1 pt-1">
                    {brand.supportProvided.slice(0, 2).map((sup, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#334155] dark:text-slate-300 font-bold">
                        <Check size={12} className="text-[#047857] shrink-0" />
                        <span className="truncate">{sup}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={() => handleOpenInquiry(brand)}
                style={{ backgroundColor: '#047857', color: '#ffffff' }}
                className="w-full h-11 rounded-2xl bg-[#047857] hover:bg-[#065f46] text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md shadow-[#047857]/20 border-0 mt-5"
              >
                <span>Connect &amp; Request Prospectus</span>
                <ArrowRight size={14} color="#ffffff" />
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Direct Brand Inquiry Modal */}
      {activeBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#f0fdf4] dark:bg-[#061c16] border border-[#bbf7d0] dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <button
              onClick={() => setActiveBrand(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white hover:bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition cursor-pointer shadow-xs"
            >
              <X size={16} />
            </button>

            {inquirySuccess ? (
              <div className="text-center space-y-4 py-6">
                <div className="w-14 h-14 rounded-full bg-[#dcfce7] border border-[#86efac] text-[#047857] flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-black text-[#061c16] dark:text-white">Inquiry Sent Successfully!</h3>
                <p className="text-xs text-[#334155] dark:text-slate-300 font-medium max-w-sm mx-auto">
                  Your details have been routed directly to <strong className="text-[#047857]">{activeBrand.name}</strong> team ({activeBrand.contactPerson}). They will contact you within 24 hours.
                </p>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-[#bbf7d0] text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                  Direct Line: {activeBrand.phone} • {activeBrand.email}
                </div>
                <button
                  onClick={() => setActiveBrand(null)}
                  style={{ backgroundColor: '#047857', color: '#ffffff' }}
                  className="px-6 py-2.5 rounded-2xl bg-[#047857] text-white font-black text-xs cursor-pointer border-0 shadow-md"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#047857] text-white flex items-center justify-center shadow-xs">
                    <Store size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#061c16] dark:text-white">Apply for {activeBrand.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">Investment: {activeBrand.investmentFormatted} • {activeBrand.category}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Karan Bahir"
                      className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-[#bbf7d0] dark:border-slate-700 text-[#061c16] dark:text-white text-xs font-bold focus:border-[#047857] outline-none shadow-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-[#bbf7d0] dark:border-slate-700 text-[#061c16] dark:text-white text-xs font-bold focus:border-[#047857] outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">Target Launch City</label>
                      <input
                        type="text"
                        value={userCity}
                        onChange={(e) => setUserCity(e.target.value)}
                        placeholder="e.g. Pune / Mumbai"
                        className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-950 border border-[#bbf7d0] dark:border-slate-700 text-[#061c16] dark:text-white text-xs font-bold focus:border-[#047857] outline-none shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-black uppercase text-slate-600 block mb-1">Inquiry Note</label>
                    <textarea
                      rows={3}
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white dark:bg-slate-950 border border-[#bbf7d0] dark:border-slate-700 text-[#061c16] dark:text-white text-xs font-medium focus:border-[#047857] outline-none shadow-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ backgroundColor: '#047857', color: '#ffffff' }}
                  className="w-full h-12 rounded-2xl bg-[#047857] hover:bg-[#065f46] text-white font-black text-xs transition cursor-pointer shadow-md shadow-[#047857]/20 border-0"
                >
                  Submit Official Partnership Request
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </main>
  );
}
