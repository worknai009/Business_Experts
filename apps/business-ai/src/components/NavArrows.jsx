import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function NavArrows({ className = "" }) {
  const navigate = useNavigate();

  return (
    <div className={`inline-flex items-center gap-0.5 p-1 rounded-full bg-slate-900/90 border border-slate-800/80 shadow-md backdrop-blur-md hover:border-indigo-500/30 transition ${className}`}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600/20 hover:border hover:border-indigo-500/30 active:scale-95 transition cursor-pointer"
        title="Go Back (Previous Page)"
      >
        <ArrowLeft size={14} />
      </button>
      
      <div className="w-px h-3.5 bg-slate-800" />

      <button
        type="button"
        onClick={() => navigate(1)}
        className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600/20 hover:border hover:border-indigo-500/30 active:scale-95 transition cursor-pointer"
        title="Go Forward (Next Page)"
      >
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
