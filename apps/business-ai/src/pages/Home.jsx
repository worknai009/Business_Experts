import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import StatsBar from "../components/StatsBar";
import HowItWorks from "../components/HowItWorks";
import OpportunityFinder from "../components/OpportunityFinder";
import Features from "../components/Features";
import ReportPreview from "../components/ReportPreview";
import AudienceCards from "../components/AudienceCards";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import SiteFooter from "../components/SiteFooter";
import { ArrowRight, Search, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSiteContent } from "../context/SiteContentContext";

// ── FAQ Accordion Item Component ──────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(!open)}
      className={`w-full px-6 py-4 sm:py-5 rounded-2xl bg-white dark:bg-slate-900/80 border cursor-pointer transition-all duration-200 shadow-md ${
        open
          ? "border-emerald-500 bg-emerald-50/50 dark:bg-slate-900 shadow-lg shadow-emerald-500/10"
          : "border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/50"
      }`}
    >
      <div className="flex items-center justify-between gap-4 w-full">
        <span className="text-sm sm:text-base font-bold text-[#0f172a] dark:text-slate-100 text-left flex-1">{q}</span>
        <ChevronDown
          size={19}
          className={`shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${open ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""}`}
        />
      </div>
      {open && (
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/60 text-left">
          {a}
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN LANDING PAGE
// Structure: Navbar → Hero → Stats → 5-step process → AI opportunity finder → Opportunity cards → Features → AI report visual → Use cases → Testimonials → Pricing → FAQ → CTA → Footer
// ═══════════════════════════════════════════════════════════════
export default function Home() {
  const routerLocation = useLocation();
  const { content } = useSiteContent();

  const faqData = content?.faq || {};
  const finalCtaData = content?.finalCta || {};

  useEffect(() => {
    const id = routerLocation.hash.replace("#", "");
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const yOffset = -75;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
    return () => clearTimeout(t);
  }, [routerLocation.hash]);

  const faqs = (faqData.items || [
    { q: "Can I search for any business in any Indian city?", a: "Yes. Enter any business sector or category. BusinessAI evaluates local demand, footfall, competitor density, and unit profit benchmarks across 28+ Indian metros." },
    { q: "How accurate are the 12-month financial estimates?", a: "The financial models are benchmarked against live commercial lease data, GST unit economics, machinery supplier catalogs, and regional OpEx averages." },
    { q: "Can I use the exported PDF report to apply for bank loans?", a: "Yes. The exported A4 Executive Feasibility Dossier includes formal capex breakdowns, debt service coverage (DSCR), SWOT matrix, and PMEGP/MUDRA subsidy eligibility." },
    { q: "How does the PMEGP & MUDRA government subsidy matching work?", a: "BusinessAI calculates your subsidy eligibility (15% to 35% margin money support under PMEGP or up to ₹10 Lakhs under MUDRA) based on your category and business type." },
    { q: "Can I compare multiple business ideas side-by-side?", a: "Yes. Use our comparative matrix to benchmark required capex, monthly net profit, risk score, and break-even payback timelines across any two opportunities." }
  ]);

  return (
    <div className="landing-page bg-white dark:bg-[#070d19] font-sans text-[#0f172a] dark:text-slate-100 min-h-screen transition-colors duration-200 relative">

      {/* 1. HERO SECTION (Big headline + Large Visual Dashboard Mockup) */}
      <Hero />

      {/* 2. STATS BAR (Full width, evenly distributed 4-column metrics) */}
      <StatsBar />

      {/* 3. 5-STEP PROCESS */}
      <HowItWorks />

      {/* 4. AI OPPORTUNITY FINDER INTERACTIVE WIDGET */}
      <OpportunityFinder />

      {/* 5. PRODUCT DEMONSTRATION & OPPORTUNITY CARDS */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900/80 p-7 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1 block">LIVE MARKET MATCHING</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] dark:text-white tracking-tight">Enter ANY Business Idea → AI Evaluates → Ranks Prime Opportunities</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">Real-time feasibility matching for any search query in 30 seconds</p>
            </div>
            <Link
              to="/business-finder"
              style={{ backgroundColor: '#047857', color: '#ffffff' }}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-600/30 border-0 cursor-pointer"
            >
              <span>Explore All 500+ Sectors</span>
              <ArrowRight size={16} color="#ffffff" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Left: Input Parameters Panel */}
            <div className="bg-slate-50 dark:bg-slate-950/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between shadow-md">
              <div className="space-y-3">
                <div className="text-xs font-bold text-[#0f172a] dark:text-slate-300 flex items-center gap-2">
                  <Search size={15} className="text-emerald-600 dark:text-emerald-400" /> Search Parameters
                </div>
                <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-bold">
                  "Food &amp; Beverage in Pune"
                </div>
                <div className="space-y-2 text-xs pt-1">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Target Budget:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">₹4,00,000 – ₹8,00,000</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Experience Level:</span>
                    <span className="font-bold text-[#0f172a] dark:text-white">Beginner Friendly</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Industry Focus:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">Quick-Service Restaurant</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: AI Recommended Opportunities */}
            <div className="lg:col-span-2 space-y-3 flex flex-col justify-between">
              <div className="text-xs font-bold text-[#0f172a] dark:text-slate-300 flex items-center justify-between">
                <span>Top Ranked Recommendations</span>
                <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-500/20">
                  {content?.opportunityFinder?.opportunities?.length || 3} Prime Matches
                </span>
              </div>
              {(content?.opportunityFinder?.opportunities?.slice(0, 3) || [
                { name: "Specialty Tea & Snack Kiosk", tag: "Fast ROI • High Margin", invest: "₹1,50,000 – ₹3,50,000" },
                { name: "Cloud Kitchen / Dark Kitchen Hub", tag: "Delivery Only • Scalable", invest: "₹4,00,000 – ₹8,00,000" },
                { name: "EV Two-Wheeler Charging Hub", tag: "Clean Tech • Future Proof", invest: "₹8,50,000 – ₹15,00,000" },
              ]).map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-4.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3 shadow-sm hover:border-emerald-500/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-md">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-[#0f172a] dark:text-white text-sm sm:text-base">{item.name}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Capital: <strong>{item.invest || item.inv}</strong> • Tag: <strong className="text-emerald-600">{item.tag || "High ROI"}</strong>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 rounded-full shrink-0">
                    {95 - idx * 3}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURES WORKSPACE */}
      <Features />

      {/* 7. AI REPORT PREVIEW (A4 Bank Appraisal Mockup & PDF Download) */}
      <ReportPreview />

      {/* 8. USE CASES & AUDIENCES WITH RICH IMAGES */}
      <AudienceCards />

      {/* 9. TESTIMONIALS */}
      <Testimonials />

      {/* 10. PRICING PLANS */}
      <Pricing />

      {/* 11. FAQ ACCORDION */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6" id="faq">
        <div className="space-y-8 w-full">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{faqData.eyebrow || "FAQ"}</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] dark:text-white">{faqData.title || "Frequently Asked Questions"}</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-medium">Clear answers regarding financial algorithms, subsidy matching, and bank appraisal reports.</p>
          </div>
          <div className="space-y-3.5">
            {faqs.map(({ q, a }, idx) => (
              <FaqItem key={idx} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* 12. FINAL CALL TO ACTION */}
      <section className="bg-gradient-to-b from-slate-50 via-emerald-50/40 to-white dark:from-[#070d19] dark:via-emerald-950/20 dark:to-[#070d19] border-t border-slate-200 dark:border-slate-800/80 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-5 px-4">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">START VALIDATING TODAY</span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0f172a] dark:text-white tracking-tight leading-tight">
            Find the High-Growth Business that Fits Your Capital Reality.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-xl mx-auto">
            Input your budget and target city to generate your 12-month feasibility analysis and subsidy qualification in 30 seconds.
          </p>
          <div className="pt-2">
            <Link
              to="/business-finder"
              style={{ backgroundColor: '#047857', color: '#ffffff' }}
              className="px-9 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xl shadow-emerald-600/30 transition inline-flex items-center gap-2 cursor-pointer border-0 group"
            >
              <span>Explore Profitable Opportunities Free</span>
              <ArrowRight size={18} color="#ffffff" strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 13. FOOTER */}
      <SiteFooter />

    </div>
  );
}
