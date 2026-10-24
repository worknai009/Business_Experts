import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { exportInvoicePdf } from '../../utils/InvoicePdfExporter';
import { CreditCard, ArrowLeft, Download, CheckCircle2, Shield, Sparkles, AlertCircle, RefreshCw, Printer, FileText, ExternalLink } from 'lucide-react';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMsg, setCancelMsg] = useState('');

  const userStr = localStorage.getItem('user') || '{}';
  const user = JSON.parse(userStr);
  const [currentPlan, setCurrentPlan] = useState(user.plan || 'Free Plan');

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getInvoices(user.email);
      setInvoices(data || []);
    } catch (e) {
      console.error('Error fetching invoices:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleDownloadInvoice = (inv) => {
    exportInvoicePdf(inv, user);
  };

  const handleViewReceipt = (inv) => {
    setActiveReceipt(inv);
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to downgrade your subscription to Free Plan?')) return;
    setCancelling(true);
    try {
      if (dashboardService.cancelSubscription) {
        await dashboardService.cancelSubscription(user.email);
      }
      const updatedUser = { ...user, plan: 'Free Plan' };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentPlan('Free Plan');
      setCancelMsg('Your subscription has been cancelled and reset to Free Plan.');
    } catch (e) {
      console.error('Cancel error:', e);
    } finally {
      setCancelling(false);
    }
  };

  const formatAmount = (amt) => {
    if (!amt) return '₹0';
    const str = String(amt).trim();
    return str.startsWith('₹') ? str : `₹${str}`;
  };

  return (
    <div className="space-y-6 text-[#0f172a] dark:text-white font-sans antialiased">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1 text-left">
          <Link to="/dashboard" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center space-x-1">
            <ArrowLeft size={14} /> <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center space-x-2">
            <CreditCard className="text-emerald-600 dark:text-emerald-400" size={28} />
            <span>Billing History &amp; Invoices</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Manage your active enterprise membership and download official GST tax receipts.
          </p>
        </div>

        <Link
          to="/subscription"
          style={{ backgroundColor: '#047857', color: '#ffffff' }}
          className="px-4 py-2 rounded-xl text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-700/20 border-0 self-start sm:self-auto hover:bg-emerald-800"
        >
          <Sparkles size={14} color="#ffffff" />
          <span>Upgrade Membership</span>
        </Link>
      </div>

      {cancelMsg && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold text-xs rounded-2xl flex items-center space-x-2 text-left">
          <AlertCircle size={16} />
          <span>{cancelMsg}</span>
        </div>
      )}

      {/* Plan Card - Mint Frosted Theme */}
      <div className="bg-[#f0fdf4] dark:bg-[#0b1329] p-6 rounded-3xl border border-[#bbf7d0] dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 text-left transition-colors duration-200">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#065f46] dark:text-emerald-400">Active Membership</span>
            <span className="px-3 py-0.5 rounded-full text-xs font-black bg-[#dcfce7] dark:bg-emerald-500/20 text-[#065f46] dark:text-emerald-300 border border-[#86efac] dark:border-emerald-400/30">
              {currentPlan}
            </span>
          </div>
          <h2 className="text-xl font-black text-[#061c16] dark:text-white">BusinessAI Enterprise Founder Tier</h2>
          <p className="text-xs text-[#334155] dark:text-slate-300 font-medium max-w-2xl">
            Unlocks full AI feasibility scoring, 10-slide investor pitch decks, bank project reports, and MSME government subsidy calculators.
          </p>
        </div>

        {currentPlan !== 'Free Plan' && currentPlan !== 'Free' && (
          <button
            onClick={handleCancelSubscription}
            disabled={cancelling}
            className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 text-xs font-bold text-rose-600 dark:text-rose-400 transition cursor-pointer self-start md:self-auto"
          >
            {cancelling ? 'Downgrading...' : 'Cancel Subscription'}
          </button>
        )}
      </div>

      {/* Invoices List */}
      <div className="bg-white dark:bg-[#0b1329] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-[#0f172a] dark:text-white">Past Invoices &amp; Receipts</h3>
          <button
            onClick={loadInvoices}
            disabled={loading}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw size={24} className="animate-spin text-emerald-600" />
            <span className="text-xs text-slate-400 font-medium">Loading billing statements...</span>
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <FileText size={32} className="mx-auto text-slate-400" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No payment transactions found yet.</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your paid subscription invoices and GST receipts will appear here automatically when you upgrade.
            </p>
            <Link
              to="/subscription"
              className="inline-block mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Explore Strategy Plans
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Invoice Number</th>
                  <th className="pb-3">Subscription Tier</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Transaction Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {invoices.map((inv, idx) => (
                  <tr key={inv.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                      <FileText size={14} className="text-emerald-600 shrink-0" />
                      <span>{inv.invoiceId || inv.id}</span>
                    </td>
                    <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200">{inv.plan || inv.planName}</td>
                    <td className="py-3.5 font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">
                      {formatAmount(inv.amount)}
                    </td>
                    <td className="py-3.5 text-slate-500 dark:text-slate-400 font-medium">{inv.date || 'Recent'}</td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        <CheckCircle2 size={10} className="text-emerald-600" />
                        {inv.status || 'Paid'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownloadInvoice(inv)}
                          style={{ color: '#ffffff', backgroundColor: '#047857' }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-sm border-0"
                          title="Download Official GST Tax Invoice PDF"
                        >
                          <Download size={12} color="#ffffff" />
                          <span>PDF Invoice</span>
                        </button>
                        <button
                          onClick={() => handleViewReceipt(inv)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700"
                        >
                          <Printer size={12} />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Printable Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-left relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  GST Tax Receipt
                </span>
                <span className="text-xs text-slate-400 font-bold">SAC 998313</span>
              </div>
              <button
                onClick={() => setActiveReceipt(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm font-bold cursor-pointer p-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 font-semibold">Invoice ID:</span>
                <span className="font-mono font-bold text-[#0f172a] dark:text-white">{activeReceipt.invoiceId || activeReceipt.id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 font-semibold">Billed Subscriber:</span>
                <span className="font-bold text-[#0f172a] dark:text-white">{user.fullName || 'Business Founder'} ({user.email || 'user@businessai.com'})</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 font-semibold">Billing Date:</span>
                <span className="text-[#0f172a] dark:text-white font-medium">{activeReceipt.date || 'Recent'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 font-semibold">Subscribed Tier:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeReceipt.plan || activeReceipt.planName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-400 font-semibold">Payment Gateway:</span>
                <span className="font-medium text-[#0f172a] dark:text-white">{activeReceipt.paymentMethod || 'Stripe Gateway (Card)'}</span>
              </div>
              <div className="flex justify-between items-center pt-2 font-bold text-base border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-800 dark:text-white">Total Amount Paid:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">{formatAmount(activeReceipt.amount)}</span>
              </div>
              <p className="text-[10px] text-slate-400 text-center pt-1">
                Includes 18% GST (9% CGST + 9% SGST). Computer-generated valid invoice.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  exportInvoicePdf(activeReceipt, user);
                  setActiveReceipt(null);
                }}
                style={{ backgroundColor: '#047857', color: '#ffffff' }}
                className="flex-1 py-2.5 rounded-xl text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-700/20 border-0 hover:bg-emerald-800"
              >
                <Download size={14} color="#ffffff" /> Download GST Invoice (PDF)
              </button>
              <button
                onClick={() => exportInvoicePdf(activeReceipt, user)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <Printer size={14} /> Print
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
