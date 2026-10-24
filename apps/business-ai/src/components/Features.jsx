import React from "react";
import { Search, Sparkles, TrendingUp, CircleDollarSign, ShieldAlert, BarChart3, FileText, History, Target } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

const featureGroupsDefault = [
  {
    category: "DISCOVER",
    title: "Find Opportunities That Fit",
    color: "#16a34a",
    items: [
      { icon: Search, name: "Business Opportunity Finder", text: "Multi-business search filtered by your exact capital and location." },
      { icon: Sparkles, name: "Personalized Recommendations", text: "AI ranks candidate businesses using real-world suitability signals." },
      { icon: TrendingUp, name: "Market Demand Radar", text: "Track high-growth industries and consumer demand spikes in real-time." },
    ]
  },
  {
    category: "ANALYZE",
    title: "Deep Financial & Risk Analysis",
    color: "#10b981",
    items: [
      { icon: CircleDollarSign, name: "Investment & ROI Estimator", text: "Simulate startup capital, monthly turnover, net margins, and payback months." },
      { icon: ShieldAlert, name: "Risk & Competition Density", text: "Analyze local competitor saturation and key business risks before spending." },
      { icon: Target, name: "Location Intelligence", text: "Evaluate tier-1, tier-2, or tier-3 city footfall and cost multipliers." },
    ]
  },
  {
    category: "DECIDE",
    title: "Make Smarter Commitments",
    color: "#16a34a",
    items: [
      { icon: FileText, name: "Detailed AI Reports", text: "Complete feasibility score (0–100), financial benchmarks, and next steps." },
      { icon: BarChart3, name: "Opportunity Comparison", text: "Side-by-side comparison of alternative business ideas within your budget." },
      { icon: History, name: "Saved Report History", text: "Persist your analysis history and review past reports anytime." },
    ]
  }
];

export default function Features() {
  const { content } = useSiteContent();
  const featData = content?.features || {};

  const headline = featData.title || "Everything You Need to Discover, Evaluate & Decide";
  const subtitle = featData.subtitle || "BusinessAI brings market intelligence, financial modeling, and risk evaluation into one streamlined workflow.";
  const eyebrow = featData.eyebrow || "THE COMPLETE BUSINESS WORKSPACE";

  const featureGroups = featData.groups || featureGroupsDefault;

  return (
    <section className="py-16 sm:py-20 bg-slate-50/50 dark:bg-slate-950/60 border-y border-slate-200/80 dark:border-slate-800/80" id="features">
      <div className="page-container">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{eyebrow}</p>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{headline}</h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">{subtitle}</p>
        </div>

        <div className="space-y-12">
          {featureGroups.map((group, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                <span
                  className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest"
                  style={{ background: `${group.color || '#10b981'}18`, color: group.color || '#10b981', border: `1px solid ${group.color || '#10b981'}35` }}
                >
                  {group.category || "MODULE"}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">{group.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                {(group.items || []).map(({ icon: Icon, name, text }, i) => (
                  <article className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500 transition-all duration-300 space-y-3 flex flex-col justify-between h-full shadow-lg" key={i}>
                    <div className="space-y-3">
                      {Icon ? (
                        <div className="p-3 rounded-xl w-fit" style={{ background: `${group.color || '#10b981'}15`, color: group.color || '#10b981' }}>
                          <Icon size={22} />
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl w-fit bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-black text-xs">
                          {i + 1}
                        </div>
                      )}
                      <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight">{name}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
