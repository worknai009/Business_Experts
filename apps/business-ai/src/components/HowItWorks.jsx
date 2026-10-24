import React from "react";
import { MessageSquareText, LineChart, Target, GitCompare, FileCheck2 } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

const fallbackStepIcons = [Target, LineChart, GitCompare, MessageSquareText, FileCheck2];

export default function HowItWorks() {
  const { content } = useSiteContent();
  const howData = content?.howItWorks || {};

  const stepsList = (howData.steps || [
    { title: "Input Budget & City", desc: "Specify your investment capacity (₹2L – ₹50L+) and target Indian metro." },
    { title: "AI Scans 500+ Sectors", desc: "Our neural engine scans regional competition, rental benchmarks, and footfall density." },
    { title: "12-Month Financials", desc: "Review projected monthly revenue, operating expenses, and break-even payback timelines." },
    { title: "Subsidy Matching", desc: "Check instant pre-eligibility for PMEGP (15%–35%), MUDRA, and CGTMSE guarantee." },
    { title: "Bank-Ready PDF Export", desc: "Download an official A4 Project Appraisal Dossier ready for bank branch appraisal." }
  ]).map((st, i) => ({
    ...st,
    step: `0${i + 1}`,
    icon: fallbackStepIcons[i % fallbackStepIcons.length]
  }));

  return (
    <section id="how-it-works" className="py-10 sm:py-14 bg-white dark:bg-[#070d19] text-[#0f172a] dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">

        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            {howData.eyebrow || "5-Step Playbook"}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0f172a] dark:text-white">
            {howData.title || "From Raw Idea to Bank-Approved Business in 5 Steps"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
            {howData.subtitle || "A structured, risk-free workflow designed for Indian founders and MSME investors."}
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-emerald-500/20 via-emerald-500/50 to-emerald-500/20 -translate-y-6 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 relative z-10">
            {stepsList.map(({ step, title, desc, icon: Icon }, i) => (
              <div
                key={i}
                className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all duration-200 shadow-lg flex flex-col justify-between space-y-3.5 group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-2xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center shadow-md shadow-emerald-600/30">
                    {step}
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                    <Icon size={17} />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-black text-[#0f172a] dark:text-white leading-snug">
                    {title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
