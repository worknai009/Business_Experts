import { useState, useEffect, useMemo } from 'react';
import {
  FileText, Download, Trash2, Search, Sparkles,
  ArrowRight, ShieldCheck, ChevronRight, RefreshCw, RotateCcw, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { exportBankProjectReport } from '../utils/ReportPdfExporter';

const DEFAULT_DEMO_REPORTS = [
  {
    id: 'demo-1',
    business: 'Cloud Kitchen & Tiffin Delivery',
    location: 'Bangalore',
    budget: 800000,
    estimated_investment: 680000,
    monthly_revenue: 320000,
    monthly_profit: 95000,
    roi_percent: 168,
    payback_months: 7.2,
    score: 92,
    rating: 'High Viability',
    summary: 'Strong urban working professional demand with high margin recurring monthly subscriptions.',
    date: '2026-03-28'
  },
  {
    id: 'demo-2',
    business: 'EV Charging & Battery Swap Hub',
    location: 'Pune',
    budget: 1500000,
    estimated_investment: 1250000,
    monthly_revenue: 480000,
    monthly_profit: 145000,
    roi_percent: 139,
    payback_months: 8.6,
    score: 89,
    rating: 'High Viability',
    summary: 'Govt FAME-II subsidy eligible location with fast rising commercial 2-wheeler delivery fleets.',
    date: '2026-03-25'
  },
  {
    id: 'demo-3',
    business: 'Specialty Cold Brew & Artisan Cafe',
    location: 'Mumbai',
    budget: 1200000,
    estimated_investment: 1050000,
    monthly_revenue: 550000,
    monthly_profit: 160000,
    roi_percent: 182,
    payback_months: 6.5,
    score: 94,
    rating: 'High Viability',
    summary: 'High footfall commercial IT park pocket with 68% gross margins on beverages.',
    date: '2026-03-20'
  }
];

export default function History() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/opportunities');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setOpportunities(res.data);
      } else {
        const cached = localStorage.getItem('business_finder_history');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setOpportunities(parsed.length > 0 ? parsed : DEFAULT_DEMO_REPORTS);
          } catch (e) {
            setOpportunities(DEFAULT_DEMO_REPORTS);
          }
        } else {
          setOpportunities(DEFAULT_DEMO_REPORTS);
          localStorage.setItem('business_finder_history', JSON.stringify(DEFAULT_DEMO_REPORTS));
        }
      }
    } catch (err) {
      console.warn('API error, falling back to local storage history:', err);
      const cached = localStorage.getItem('business_finder_history');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setOpportunities(parsed.length > 0 ? parsed : DEFAULT_DEMO_REPORTS);
        } catch (e) {
          setOpportunities(DEFAULT_DEMO_REPORTS);
        }
      } else {
        setOpportunities(DEFAULT_DEMO_REPORTS);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id) => {
    const updated = opportunities.filter(item => item.id !== id);
    setOpportunities(updated);
    localStorage.setItem('business_finder_history', JSON.stringify(updated));
    if (selectedReport?.id === id) setSelectedReport(null);

    try {
      await api.delete(`/opportunities/${id}`);
    } catch (e) {
      // silent catch
    }
  };

  const clearAll = () => {
    setOpportunities([]);
    localStorage.setItem('business_finder_history', JSON.stringify([]));
    setSelectedReport(null);
  };

  const restoreDemoReports = () => {
    setOpportunities(DEFAULT_DEMO_REPORTS);
    localStorage.setItem('business_finder_history', JSON.stringify(DEFAULT_DEMO_REPORTS));
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return opportunities.filter(item =>
      (item.business || item.title || '').toLowerCase().includes(q) ||
      (item.location || '').toLowerCase().includes(q)
    );
  }, [opportunities, search]);

  const handleDownloadPDF = (report) => {
    exportBankProjectReport({
      business: report.business || report.title,
      location: report.location,
      budget: report.budget,
      estimated_investment: report.estimated_investment || Math.round((report.budget || 500000) * 0.85),
      estimated_profit: report.monthly_profit,
      estimated_revenue: report.monthly_revenue,
      roi: `${report.roi_percent || 180}%`,
      break_even: `${report.payback_months || 6.0} Months`,
      score: report.score || 85,
      rating: report.rating || 'Good',
      recommendation: report.summary
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f172a] dark:text-white tracking-tight">Saved Feasibility Reports</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Review your past AI assessments, ROI metrics, and financial projections.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search reports by title or city..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-[#0f172a] dark:text-white focus:border-emerald-500 outline-none transition shadow-sm font-semibold placeholder:text-slate-400"
            />
          </div>

          {opportunities.length > 0 ? (
            <button
              onClick={clearAll}
              className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 text-xs font-black text-rose-600 dark:text-rose-400 transition cursor-pointer shrink-0"
            >
              Clear All
            </button>
          ) : (
            <button
              onClick={restoreDemoReports}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} /> Load Sample Reports
            </button>
          )}
        </div>
      </div>

      {/* Reports Table / Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <RefreshCw size={28} className="animate-spin text-emerald-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 space-y-4 shadow-sm">
          <FileText size={40} className="mx-auto text-slate-400" />
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#0f172a] dark:text-white">No Saved Feasibility Reports</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Run a new analysis or business finder search to automatically save your feasibility reports here.</p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/analyze')}
              style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer border-0"
            >
              <Sparkles size={14} color="#ffffff" /> Run New Analysis
            </button>
            <button
              onClick={restoreDemoReports}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <RotateCcw size={14} /> Load Samples
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const rawTitle = item.business || item.title || 'Business Opportunity';
            const title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
            const loc = item.location ? item.location.charAt(0).toUpperCase() + item.location.slice(1) : 'Location N/A';
            const score = item.score || 85;
            const roi = item.roi_percent || 180;
            const profit = item.monthly_profit || 75000;

            return (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-[#f0fdf4] dark:bg-[#0b1329] border border-[#bbf7d0] dark:border-slate-800 hover:border-emerald-500/60 hover:shadow-xl transition-all duration-200 space-y-4 shadow-sm flex flex-col justify-between group text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="px-3 py-0.5 rounded-full bg-[#dcfce7] dark:bg-emerald-500/20 border border-[#86efac] dark:border-emerald-400/30 text-[#065f46] dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                      SAVED ANALYSIS
                    </span>
                    <button
                      onClick={() => deleteReport(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                      title="Delete Report"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <h3 className="text-xl font-black text-[#061c16] dark:text-white group-hover:text-[#047857] dark:group-hover:text-emerald-400 transition leading-snug">
                    {title}
                  </h3>

                  <p className="text-xs text-[#334155] dark:text-slate-400 font-bold">📍 {loc}</p>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#bbf7d0]/80 dark:border-slate-800/60">
                    <div>
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Est. Monthly Profit</span>
                      <span className="text-sm sm:text-base font-black text-[#047857] dark:text-emerald-400">₹{profit.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">ROI %</span>
                      <span className="text-sm sm:text-base font-black text-amber-700 dark:text-amber-400">{roi}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#bbf7d0]/80 dark:border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Score:</span>
                    <span className="text-xs font-black text-[#065f46] dark:text-emerald-300 bg-[#dcfce7] dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-[#86efac] dark:border-emerald-500/20">
                      {score} / 100
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadPDF(item)}
                      className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-xs"
                      title="Download PDF Feasibility Dossier"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      onClick={() => setSelectedReport(item)}
                      style={{ backgroundColor: '#047857', color: '#ffffff' }}
                      className="px-3.5 py-2 rounded-xl bg-[#047857] hover:bg-[#065f46] text-white font-black text-xs flex items-center gap-1 shadow-md shadow-[#047857]/20 transition cursor-pointer border-0"
                    >
                      <span>View Report</span>
                      <ChevronRight size={14} color="#ffffff" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detailed Report Viewer */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
                FEASIBILITY REPORT PREVIEW
              </span>
              <h3 className="text-2xl font-black text-[#0f172a] dark:text-white">{selectedReport.business || selectedReport.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">📍 {selectedReport.location} • Budget: ₹{(selectedReport.budget || 500000).toLocaleString()}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Overall Feasibility Rating</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={18} /> High Viability ({selectedReport.score || 85} / 100)
                </span>
              </div>
              <button
                onClick={() => handleDownloadPDF(selectedReport)}
                style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer border-0"
              >
                <Download size={14} color="#ffffff" /> Download PDF
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Est. Monthly Profit</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹{(selectedReport.monthly_profit || 75000).toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Payback Period</span>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400">{selectedReport.payback_months || 5.5} Months</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">Summary &amp; Strategy</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-medium">
                {selectedReport.summary || 'Solid opportunity with strong demand fundamentals and low overhead risks.'}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
