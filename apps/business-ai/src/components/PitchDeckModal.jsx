import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Sparkles, Presentation, CheckCircle, TrendingUp, BarChart2, ShieldCheck } from 'lucide-react';
import { generatePitchDeckData, exportPitchDeckPdf } from '../utils/PitchDeckExporter';

export default function PitchDeckModal({ isOpen, onClose, result }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentSlideIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex((prev) => Math.min(prev + 1, 9));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !result) return null;

  const slides = generatePitchDeckData(result);
  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-5xl bg-[#f0fdf4] dark:bg-[#061c16] border border-[#bbf7d0] dark:border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#bbf7d0] dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#047857] text-white flex items-center justify-center shadow-xs">
              <Presentation size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#061c16] dark:text-white">
                  {result.business || "Business Venture"} • 10-Slide Investor Deck
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#dcfce7] dark:bg-emerald-500/20 text-[#065f46] dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                  Slide {currentSlideIndex + 1} of 10
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Use arrow keys or buttons to navigate slides</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportPitchDeckPdf(result)}
              style={{ backgroundColor: '#047857', color: '#ffffff' }}
              className="px-4 py-2 rounded-2xl bg-[#047857] hover:bg-[#065f46] text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-[#047857]/20 border-0"
            >
              <Download size={14} color="#ffffff" />
              <span>Export Landscape PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition cursor-pointer shadow-xs"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Slide Canvas Area */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto custom-scrollbar flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-[#dcfce7] dark:bg-emerald-500/20 border border-[#86efac] dark:border-emerald-400/30 text-[#065f46] dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                {currentSlide.tag}
              </span>
              <span className="text-xs font-bold text-slate-400">
                Slide {currentSlide.slideNumber} / 10
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#061c16] dark:text-white tracking-tight mb-1">
              {currentSlide.title}
            </h2>
            <p className="text-sm text-emerald-800 dark:text-emerald-300 font-bold mb-6">
              {currentSlide.subtitle}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Bullet Points */}
              <div className="md:col-span-7 bg-white dark:bg-slate-900/80 border border-[#bbf7d0] dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3.5 text-left">
                {currentSlide.bullets.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#334155] dark:text-slate-200 font-medium leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-[#047857] shrink-0 mt-1.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Metrics Stack */}
              <div className="md:col-span-5 flex flex-col gap-3">
                {(currentSlide.metrics || []).map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900/80 border border-[#bbf7d0] dark:border-slate-800 rounded-2xl p-4 text-left shadow-sm"
                  >
                    <div className="text-xl sm:text-2xl font-black text-[#047857] dark:text-emerald-400 font-mono">
                      {m.value}
                    </div>
                    <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Footer Controls & Thumbnails */}
          <div className="pt-6 border-t border-[#bbf7d0]/80 dark:border-slate-800 mt-6 flex flex-wrap items-center justify-between gap-4">
            
            {/* Prev Button */}
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentSlideIndex === 0}
              className="px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-[#061c16] dark:text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <ChevronLeft size={16} /> <span>Previous Slide</span>
            </button>

            {/* Slide Dots / Indicator */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                    idx === currentSlideIndex
                      ? 'w-7 bg-[#047857] shadow-sm'
                      : 'w-2.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                  title={`Go to Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, 9))}
              disabled={currentSlideIndex === 9}
              className="px-4 py-2 rounded-2xl bg-[#047857] hover:bg-[#065f46] disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-md shadow-[#047857]/20 border-0"
            >
              <span>Next Slide</span> <ChevronRight size={16} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
