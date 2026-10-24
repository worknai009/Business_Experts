import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Sparkles, Zap, Crown, ArrowRight, ShieldCheck, CreditCard, Lock, X, Building2 } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';

export default function Subscription() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [nameOnCard, setNameOnCard] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const userStr = localStorage.getItem('user') || '{}';
  const user = JSON.parse(userStr);
  const currentPlan = user.plan || 'Free Plan';

  const planPricing = {
    Free: { price: '₹0', raw: 0 },
    Pro: { price: '₹499', raw: 499 },
    Business: { price: '₹1,999', raw: 1999 },
  };

  const openCheckout = (planName) => {
    setSelectedPlan(planName);
    setNameOnCard(user.fullName || 'Business Founder');
    setShowModal(true);
    setErrorMsg('');
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Create checkout session on backend
      const session = await dashboardService.createCheckoutSession(selectedPlan, user.email);
      
      // 2. Process & confirm payment
      const confirmRes = await dashboardService.confirmPayment(selectedPlan, session.sessionId, user.email);

      // 3. Update client-side user state
      const updatedUser = { ...user, plan: confirmRes.plan || `${selectedPlan} Plan` };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // 4. Redirect to Payment Success page
      setShowModal(false);
      navigate(`/payment-success?session_id=${session.sessionId}&plan=${encodeURIComponent(confirmRes.plan || `${selectedPlan} Plan`)}&amount=${encodeURIComponent(session.amount || planPricing[selectedPlan]?.price || '₹499')}`);
    } catch (err) {
      console.error('Payment failure:', err);
      setErrorMsg('Payment could not be completed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#060b17] text-[#0f172a] dark:text-slate-100 pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header with generous top breathing room */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> <span>Transparent Pricing Tiers</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#0f172a] dark:text-white">
            Choose the Right Strategy Plan for Your Enterprise
          </h1>
          <p className="text-sm text-[#475569] dark:text-slate-400 font-medium">
            Unlock AI Mentor Chat, Unlimited AI Feasibility Reports, PDF Exports, and City Demand Radar.
          </p>
        </div>

        {/* Pricing Cards Grid — Identical to Landing Page */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* 1. Free Plan */}
          <div className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border shadow-xl flex flex-col justify-between space-y-8 transition ${
            currentPlan.includes('Free') ? 'border-slate-300 dark:border-slate-700 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#0f172a] dark:text-white flex items-center space-x-2">
                  <Zap size={20} className="text-[#64748b] dark:text-slate-400" />
                  <span>Free</span>
                </h2>
                <p className="text-xs text-[#64748b] dark:text-slate-400">Explore business opportunities and basic analysis.</p>
              </div>

              <div className="text-4xl font-black text-[#0f172a] dark:text-white">
                ₹0 <span className="text-xs font-normal text-[#64748b] dark:text-slate-400">forever</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-[#334155] dark:text-slate-300 font-medium">
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Opportunity search & matching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Feasibility rating (0–100)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Core market demand & risk signals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Basic business recommendations</span>
                </div>
              </div>
            </div>

            <button
              disabled
              className="w-full bg-slate-100 dark:bg-slate-800 text-[#64748b] dark:text-slate-400 font-bold py-3.5 rounded-2xl text-xs cursor-default"
            >
              {currentPlan.includes('Free') ? '✓ Active Plan' : 'Free Tier'}
            </button>
          </div>

          {/* 2. Pro Plan (Most Popular — Matching Landing Page) */}
          <div className="bg-white dark:bg-gradient-to-b dark:from-emerald-950/80 dark:to-slate-900/90 rounded-3xl p-8 border-2 border-emerald-500 shadow-2xl flex flex-col justify-between space-y-8 relative transform md:-translate-y-2">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-full tracking-widest shadow-md flex items-center gap-1">
              <Sparkles size={11} /> Most Popular
            </span>

            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#0f172a] dark:text-white flex items-center space-x-2">
                  <Crown size={20} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Pro</span>
                </h2>
                <p className="text-xs text-emerald-800 dark:text-emerald-200 font-medium">Full AI reports, comparisons and mentor access.</p>
              </div>

              <div className="text-4xl font-black text-[#0f172a] dark:text-white">
                ₹499 <span className="text-xs font-normal text-[#64748b] dark:text-slate-400">/month</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-emerald-500/20 text-xs text-[#1e293b] dark:text-slate-200 font-medium">
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 font-bold" />
                  <span className="font-bold text-[#0f172a] dark:text-white">Everything in Free</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Unlimited AI feasibility reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Extended financial projections</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Multi-opportunity comparison tool</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>RAG AI Business Mentor chat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>PDF report export</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openCheckout('Pro')}
              disabled={currentPlan.includes('Pro')}
              className={`w-full font-bold py-3.5 rounded-2xl text-xs transition shadow-lg flex items-center justify-center space-x-1.5 ${
                currentPlan.includes('Pro')
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-emerald-600/30'
              }`}
            >
              <span>{currentPlan.includes('Pro') ? '✓ Active Plan' : 'Upgrade to Pro'}</span>
              {!currentPlan.includes('Pro') && <ArrowRight size={14} />}
            </button>
          </div>

          {/* 3. Business Plan */}
          <div className={`bg-white dark:bg-slate-900 rounded-3xl p-8 border shadow-xl flex flex-col justify-between space-y-8 transition ${
            currentPlan.includes('Business') ? 'border-slate-300 dark:border-slate-700 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#0f172a] dark:text-white flex items-center space-x-2">
                  <Building2 size={20} className="text-[#64748b] dark:text-slate-400" />
                  <span>Business</span>
                </h2>
                <p className="text-xs text-[#64748b] dark:text-slate-400">Multi-seat access for teams, consultants and incubators.</p>
              </div>

              <div className="text-4xl font-black text-[#0f172a] dark:text-white">
                ₹1,999 <span className="text-xs font-normal text-[#64748b] dark:text-slate-400">/month</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-[#334155] dark:text-slate-300 font-medium">
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 font-bold" />
                  <span className="font-bold text-[#0f172a] dark:text-white">Everything in Pro</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Up to 10 team seats</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>White-labelled reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>API access for integrations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Priority data refresh</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Dedicated account manager</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => openCheckout('Business')}
              disabled={currentPlan.includes('Business')}
              className={`w-full font-bold py-3.5 rounded-2xl text-xs transition border flex items-center justify-center space-x-1.5 ${
                currentPlan.includes('Business')
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 cursor-default'
                  : 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30 cursor-pointer'
              }`}
            >
              <span>{currentPlan.includes('Business') ? '✓ Active Plan' : 'Upgrade to Business'}</span>
              {!currentPlan.includes('Business') && <ArrowRight size={14} />}
            </button>
          </div>

        </div>

        {/* Stripe Trust Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={18} />
            <span className="font-bold text-slate-800 dark:text-slate-200">256-Bit SSL Encrypted Checkout</span>
          </div>
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <CreditCard size={18} />
            <span className="font-bold text-slate-800 dark:text-slate-200">Stripe Global Payment Gateway</span>
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            Cancel or downgrade anytime with 1-click in Dashboard.
          </div>
        </div>

      </div>

      {/* ── STRIPE CHECKOUT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative text-slate-900 dark:text-slate-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border-0"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                <Lock size={12} /> <span>Secured by Stripe</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Complete Your Subscription
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upgrading to <span className="font-bold text-slate-900 dark:text-white">{selectedPlan} Plan</span> • {planPricing[selectedPlan]?.price || '₹499'}/month
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs rounded-xl font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handlePayNow} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Name on Card</label>
                <input
                  type="text"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-emerald-500 outline-none transition"
                  placeholder="Founder Name"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Card Number</label>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-emerald-500 outline-none font-mono"
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Expiry Date</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-emerald-500 outline-none font-mono"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">CVC / CVV</label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:border-emerald-500 outline-none font-mono"
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Total Billed Today:</span>
                <span className="font-black text-base text-emerald-600 dark:text-emerald-400">
                  {planPricing[selectedPlan]?.price || '₹499'}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/25 transition cursor-pointer disabled:opacity-50 border-0"
              >
                <Lock size={16} />
                <span>{loading ? 'Processing Payment...' : `Pay ${planPricing[selectedPlan]?.price || '₹499'} with Stripe`}</span>
              </button>
            </form>

            <p className="text-[10px] text-center text-slate-500 dark:text-slate-400">
              By confirming your payment, you authorize BusinessAI to charge your card on a recurring monthly basis until cancelled.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
