import { Link } from "react-router-dom";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";
import { isAuthenticated } from "../utils/auth";

export default function Pricing() {
  const { content } = useSiteContent();
  const pricingData = content?.pricing || {};
  const authenticated = isAuthenticated();

  const getPlanTarget = (planName, defaultTo) => {
    if (defaultTo && defaultTo !== "/pricing" && defaultTo !== "/register") return defaultTo;
    if (authenticated) {
      if (planName === "Free") return "/business-finder";
      if (planName === "Pro") return "/subscription?plan=Pro";
      if (planName === "Business") return "/subscription?plan=Business";
      return "/subscription";
    }
    if (planName === "Free") return "/business-finder";
    if (planName === "Pro") return "/register?plan=pro";
    if (planName === "Business") return "/register?plan=business";
    return defaultTo || "/register";
  };

  const getPlanCTA = (planName, defaultCta) => {
    if (defaultCta && defaultCta !== "Choose Plan" && defaultCta !== "Get Started") {
      return defaultCta;
    }
    if (authenticated) {
      if (planName === "Free") return "Explore Opportunities";
      if (planName === "Pro") return "Upgrade to Pro";
      if (planName === "Business") return "Contact Sales / Enterprise";
    }
    return defaultCta || "Choose Plan";
  };

  const DEFAULT_PLAN_META = {
    Free: {
      desc: "Explore business opportunities and basic analysis.",
      features: [
        "Opportunity search & matching (500+ sectors)",
        "Feasibility score index rating (0–100)",
        "Core market demand & risk assessment",
        "PMEGP / MUDRA subsidy calculator",
        "Basic unit economics preview"
      ]
    },
    Pro: {
      desc: "Full AI reports, comparisons and mentor access.",
      features: [
        "Everything in Free tier",
        "Unlimited AI feasibility appraisal reports",
        "12-Month unit economic cash flow projections",
        "Multi-opportunity comparison matrix",
        "RAG AI Business Mentor 24/7 access",
        "Official bank-ready A4 PDF export"
      ]
    },
    Business: {
      desc: "Multi-seat access for teams, consultants and incubators.",
      features: [
        "Everything in Pro tier",
        "Up to 10 collaborative team seats",
        "White-label custom PDF reports with logo",
        "Direct API access for CRM integrations",
        "Real-time market data refresh priority",
        "Dedicated senior account advisor"
      ]
    }
  };

  const plans = (pricingData.plans || [
    { name: "Free", price: "₹0", period: "forever", cta: "Explore Free", highlight: false },
    { name: "Pro", price: "₹499", period: "/month", cta: "Get Pro", highlight: true },
    { name: "Business", price: "₹1,999", period: "/month", cta: "Contact Sales", highlight: false }
  ]).map((p) => {
    const meta = DEFAULT_PLAN_META[p.name] || DEFAULT_PLAN_META[p.name?.split(" ")[0]] || {
      desc: "Full access to business evaluation tools and market analysis.",
      features: [
        "Comprehensive AI feasibility analysis",
        "Interactive unit economics model",
        "PMEGP & government subsidy check",
        "Downloadable PDF report"
      ]
    };
    return {
      ...p,
      desc: p.desc || meta.desc,
      features: p.features?.length ? p.features : meta.features
    };
  });

  return (
    <section id="pricing" className="landing-section py-10 sm:py-16">
      <div className="w-full max-w-full mx-auto px-2 sm:px-4 lg:px-6">

        <div className="text-center mb-10">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-2">
            {pricingData.eyebrow || "Membership Plans"}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {pricingData.title || "Start validating before you start spending"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
            {pricingData.subtitle || "Explore the tools you need to make smarter business decisions."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col rounded-3xl p-6 sm:p-7 transition-all duration-300 ${
                p.highlight
                  ? "bg-gradient-to-b from-emerald-50 via-white to-emerald-50/50 dark:from-emerald-950/50 dark:via-slate-900 dark:to-slate-950 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/15 sm:-mt-2 sm:mb-[-0.5rem]"
                  : "bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xl"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1 whitespace-nowrap">
                  <Sparkles size={11} /> Most Popular
                </span>
              )}

              <div className="flex-1">
                <div
                  className={`text-xs font-black uppercase tracking-widest mb-2 ${
                    p.highlight ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {p.name}
                </div>

                <div className="flex items-end gap-1 mb-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-none">
                    {p.price}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pb-1">{p.period}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-5">{p.desc}</p>

                <ul className="space-y-2.5 border-t border-slate-200 dark:border-slate-800 pt-5">
                  {(p.features || []).map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <Check
                        size={14}
                        className={`shrink-0 mt-0.5 ${
                          p.highlight ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
                        }`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={getPlanTarget(p.name, p.to)}
                className={`mt-6 w-full py-3.5 rounded-2xl font-black text-xs text-center transition flex items-center justify-center gap-2 cursor-pointer ${
                  p.highlight
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-600/20 dark:hover:bg-emerald-600/30 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30"
                }`}
              >
                {getPlanCTA(p.name, p.cta || "Get Started")} <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
