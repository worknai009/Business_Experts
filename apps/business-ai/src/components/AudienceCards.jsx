import { Rocket, Store, TrendingUp, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PhotoCard from "./PhotoCard";
import { useSiteContent } from "../context/SiteContentContext";

const icons = [Rocket, Store, TrendingUp, GraduationCap];

export default function AudienceCards() {
  const { content } = useSiteContent();
  const audData = content?.audiences || {};

  const audiences = (audData.items || [
    {
      title: "First-Time Founders",
      badge: "Idea to Launch",
      desc: "Find low-capex business opportunities with government PMEGP/MUDRA subsidy backing.",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=600&fit=crop&q=85",
    },
    {
      title: "MSME & Retail Owners",
      badge: "Revenue Expansion",
      desc: "Identify high-demand franchise sectors, nearby micro-depots, and unit profit benchmarks.",
      img: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&h=600&fit=crop&q=85",
    },
    {
      title: "Angel & Seed Investors",
      badge: "Deal Due Diligence",
      desc: "Perform 30-second unit economic stress tests and evaluate regional saturation metrics.",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop&q=85",
    },
    {
      title: "Entrepreneurs & Students",
      badge: "Market Mastery",
      desc: "Learn real-world business appraisal with Gemini AI Mentor guidance.",
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=85",
    },
  ]).map((aud, i) => ({
    ...aud,
    badge: aud.badge || (i === 0 ? "Idea to Launch" : i === 1 ? "Revenue Expansion" : i === 2 ? "Deal Due Diligence" : "Market Mastery"),
    icon: icons[i % icons.length]
  }));

  return (
    <section className="py-16 sm:py-24 bg-slate-50/50 dark:bg-[#070d19]/60 border-y border-slate-200 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            {audData.eyebrow || "Tailored For Growth"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] dark:text-white tracking-tight">
            {audData.title || "Perfect for Every Aspiring Entrepreneur"}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            {audData.subtitle || "Whether you are launching your first venture or scaling regional operations."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map(({ icon: Icon, title, badge, desc, img, ctaLabel, ctaTo }, idx) => (
            <article
              key={idx}
              className="group rounded-3xl overflow-hidden bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-emerald-900/10"
            >
              <div>
                <PhotoCard
                  src={img}
                  alt={title}
                  icon={Icon}
                  className="aspect-[4/3] w-full shrink-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-sm font-black drop-shadow-md">{title}</span>
                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Icon size={16} className="text-white" />
                    </div>
                  </div>
                </PhotoCard>

                <div className="p-5">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <Link
                  to={ctaTo || "/business-finder"}
                  style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer border-0"
                >
                  <span>{ctaLabel || "Explore Playbook"}</span>
                  <ArrowRight size={13} color="#ffffff" strokeWidth={2.5} />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
