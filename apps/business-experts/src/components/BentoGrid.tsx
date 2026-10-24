import { ArrowRight, Bot, Calendar, Sparkles, TrendingUp, Users, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

type BentoGridProps = {
  onOpenAiModal?: () => void;
  onOpenPitchModal?: () => void;
};

export default function BentoGrid({ onOpenAiModal, onOpenPitchModal }: BentoGridProps) {
  return (
    <section className="section-pad relative overflow-hidden bg-mist/60 dark:bg-[#070c17]/60">
      <div className="container-x">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <Reveal>
            <span className="eyebrow mb-3 inline-block">The Complete Ecosystem</span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
              Everything businesses need to <span className="gradient-text">scale, fund & lead</span>
            </h2>
            <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
              Connecting high-growth startups, institutional investors, enterprise mentors, and sovereign communities.
            </p>
          </Reveal>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: Large Featured Anchor (2 cols on desktop) */}
          <Reveal className="md:col-span-2 lg:col-span-2">
            <div className="card group relative flex flex-col justify-between h-full p-7 lg:p-8 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 dark:bg-emerald-950/40 text-brand dark:text-emerald-300 border border-brand/20 px-3 py-1 text-xs font-bold">
                    <TrendingUp className="size-3.5" /> High-Impact Accelerator
                  </span>
                  <span className="text-xs font-extrabold text-slate-400">Portfolio</span>
                </div>
                
                <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-brand transition">
                  From Seed to Market Leader
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400 max-w-lg">
                  Access venture capital syndicates, strategic market entry in Southeast Asia & India, and growth engineering tailored for fast-moving founders.
                </p>

                {/* Micro Stats inside Bento */}
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-5">
                  <div>
                    <span className="block text-xl font-black text-slate-900 dark:text-white">₹45Cr+</span>
                    <span className="text-[11px] font-medium text-slate-400">Capital Syndicated</span>
                  </div>
                  <div>
                    <span className="block text-xl font-black text-slate-900 dark:text-white">120+</span>
                    <span className="text-[11px] font-medium text-slate-400">Startups Mentored</span>
                  </div>
                  <div>
                    <span className="block text-xl font-black text-slate-900 dark:text-white">88%</span>
                    <span className="text-[11px] font-medium text-slate-400">Follow-on Funding</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 relative z-10">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-brand hover:text-brand-dark transition"
                >
                  Explore Delivered Projects <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
                </Link>
                {onOpenPitchModal && (
                  <button
                    type="button"
                    onClick={onOpenPitchModal}
                    className="btn-secondary !py-1.5 !px-3.5 !text-xs !rounded-xl font-bold"
                  >
                    Submit Pitch Deck
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          {/* Card 2: Interactive AI Intelligence Engine (1 col) */}
          <Reveal className="md:col-span-1 lg:col-span-1">
            <div className="card group relative flex flex-col justify-between h-full p-6 sm:p-7 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-white to-indigo-500/5 dark:from-emerald-950/20 dark:via-slate-900 dark:to-indigo-950/20">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-tr from-brand to-emerald-400 text-white shadow-glow">
                    <Bot className="size-5" />
                  </span>
                  <span className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black uppercase">
                    AI Service
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  BusinessAI
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Real-time market valuation, financial viability scoring, and 24/7 AI mentor trained on Asian commerce.
                </p>

                {/* Score Teaser Pill */}
                <div className="mt-5 rounded-2xl border border-emerald-500/25 bg-white dark:bg-slate-800/80 p-3.5 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Viability Score</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">92.4%</span>
                  </div>
                  <Sparkles className="size-5 text-emerald-500 animate-pulse" />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onOpenAiModal}
                  className="btn-primary !py-2.5 !px-4 !w-full !rounded-xl !text-xs flex items-center justify-center gap-1.5 font-bold"
                >
                  <span>Test Business with AI</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </Reveal>

          {/* Card 3: Flagship Event / Executive Summit (1 col) */}
          <Reveal className="md:col-span-1 lg:col-span-1">
            <div className="card group relative flex flex-col justify-between h-full p-6 sm:p-7 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="grid size-10 place-items-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    <Calendar className="size-5" />
                  </span>
                  <span className="rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 text-[10px] font-black uppercase">
                    Upcoming
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Founder &amp; Investor Summit
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Join exclusive in-person and hybrid masterminds, pitch sessions, and networking rounds.
                </p>

                <div className="mt-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 p-3">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block">
                    ⚡ Limited Seats Available
                  </span>
                  <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80 block mt-0.5">
                    Verified founders, angels &amp; family offices
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/events"
                  className="btn-secondary !py-2.5 !px-4 !w-full !rounded-xl !text-xs flex items-center justify-center gap-1.5 font-bold"
                >
                  <span>View All Summits</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Card 4: Executive Mentorship & Advisory Track (1.5 cols or 2 cols) */}
          <Reveal className="md:col-span-1 lg:col-span-2">
            <div className="card group relative flex flex-col justify-between h-full p-6 sm:p-7 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase">
                    Knowledge Hub
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Executive Training &amp; Upskilling
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Industry-validated curriculums designed by seasoned practitioners. Master artificial intelligence, fundraising, and scale-up governance.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">10+ Cohort Programs</span>
                <Link
                  to="/training-programs"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline"
                >
                  Explore Programs <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Card 5: Membership Network (1.5 cols or 2 cols) */}
          <Reveal className="md:col-span-2 lg:col-span-2">
            <div className="card group relative flex flex-col justify-between h-full p-6 sm:p-7 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase">
                    Ecosystem Memberships
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Join the Verified Business Community
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Unlock tier-based access: member directories, deal flow reviews, priority pitch slots, and legal/tax consultation vouchers.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">5 Structured Tiers</span>
                <Link
                  to="/memberships"
                  className="btn-primary !py-2 !px-4 !text-xs !rounded-xl flex items-center gap-1.5 font-bold"
                >
                  <span>Compare Membership Tiers</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
