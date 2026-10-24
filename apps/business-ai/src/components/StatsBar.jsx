import React from "react";
import { TrendingUp, Award, Building, Users } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

const fallbackIcons = [TrendingUp, Award, Users, Building];

export default function StatsBar() {
  const { content } = useSiteContent();
  const heroData = content?.hero || {};

  const stats = (heroData.stats || [
    { value: "50K+", label: "Ideas Analyzed", detail: "Across Indian MSME ventures" },
    { value: "₹20Cr+", label: "Revenue Mapped", detail: "Live commercial revenue models" },
    { value: "18,000+", label: "Opportunities Found", detail: "Tier-1 & Tier-2 economic zones" },
    { value: "96%", label: "Accuracy Rate", detail: "Validated by bank branch appraisers" },
  ]).map((st, i) => ({
    ...st,
    icon: fallbackIcons[i % fallbackIcons.length]
  }));

  return (
    <section className="w-full bg-slate-50/90 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80 py-8 sm:py-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-0 sm:divide-x divide-slate-200/80 dark:divide-slate-800/80 items-stretch">
          {stats.map(({ value, label, icon: Icon, detail }, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center text-center w-full px-4 sm:px-6 py-3 sm:py-2 transition group"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/25 shadow-xs group-hover:scale-105 transition-transform">
                  <Icon size={20} strokeWidth={2.3} />
                </div>
                <span className="text-3xl sm:text-4xl font-black text-[#0f172a] dark:text-white tracking-tight leading-none">
                  {value}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide">
                {label}
              </div>
              {detail && (
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 max-w-[200px]">
                  {detail}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
