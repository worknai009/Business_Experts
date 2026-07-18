import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import type { Settings } from "../api";

function CtaLink({ to, className, children }: { to: string; className: string; children: React.ReactNode }) {
  if (to.startsWith("http")) {
    return (
      <a href={to} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }
  if (to.startsWith("/#")) {
    return (
      <a href={to.slice(1)} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] as const }
});

export default function Hero({ settings }: { settings: Settings }) {
  const hero = settings.hero;
  const [statA, statB] = hero.stats || [];

  return (
    <section className="hero-glow relative overflow-hidden">
      <div className="bg-grid fade-mask pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-24 right-[12%] size-72 rounded-full bg-brand/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-6rem] left-[6%] size-80 rounded-full bg-brand/8 blur-3xl"
        aria-hidden
      />

      <div className="container-x grid items-center gap-10 py-10 md:py-14 lg:grid-cols-2 lg:gap-14">
        <div>
          {hero.badge ? (
            <motion.span {...fadeUp(0)} className="glass chip !py-1.5 !pl-1.5 !pr-4 text-ink shadow-soft">
              <span className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-white">
                <Sparkles className="size-3" />
              </span>
              <span className="text-xs font-semibold tracking-wide text-slate-600">{hero.badge}</span>
            </motion.span>
          ) : null}

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-5 text-balance text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl xl:text-[3.6rem]"
          >
            {hero.title.split(" ").map((word, index, words) =>
              index >= words.length - 2 ? (
                <span key={index} className="gradient-text">
                  {word}{" "}
                </span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="mt-4 max-w-xl text-base leading-relaxed text-slate-500 md:text-lg">
            {hero.subtitle}
          </motion.p>

          <motion.div {...fadeUp(0.24)} className="mt-7 flex flex-wrap items-center gap-3.5">
            {hero.primaryCta?.label ? (
              <CtaLink to={hero.primaryCta.url || "/"} className="btn-primary !rounded-2xl !px-8 !py-4 !text-base">
                {hero.primaryCta.label} <ArrowRight className="size-4" />
              </CtaLink>
            ) : null}
            {hero.secondaryCta?.label ? (
              <CtaLink to={hero.secondaryCta.url || "/"} className="btn-secondary !rounded-2xl !px-8 !py-4 !text-base">
                {hero.secondaryCta.label}
              </CtaLink>
            ) : null}
          </motion.div>

          <motion.p {...fadeUp(0.3)} className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400">
            <ShieldCheck className="size-4 text-emerald-500" />
            Trusted by businesses, startups & investors across the ecosystem
          </motion.p>

          {hero.stats?.length ? (
            <motion.dl
              {...fadeUp(0.36)}
              className="glass mt-8 grid max-w-xl grid-cols-2 divide-slate-200/70 rounded-2xl shadow-soft sm:grid-cols-4 sm:divide-x"
            >
              {hero.stats.map((stat) => (
                <div key={stat.label} className="px-5 py-4">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="gradient-text font-display text-2xl font-bold md:text-[1.7rem]">{stat.value}</dd>
                  <dd className="mt-0.5 text-[11px] font-medium text-slate-500 md:text-xs">{stat.label}</dd>
                </div>
              ))}
            </motion.dl>
          ) : null}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2"
        >
          {hero.image ? (
            <img
              src={hero.image}
              alt="Business ecosystem illustration"
              className="hero-img-blend h-[420px] w-full object-cover md:h-[560px] lg:h-full"
              fetchPriority="high"
            />
          ) : null}

          {statA ? (
            <div className="glass animate-float absolute -left-5 top-10 hidden items-center gap-3 rounded-2xl px-4 py-3 shadow-lift md:flex">
              <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-glow">
                <TrendingUp className="size-5" />
              </span>
              <span>
                <span className="block font-display text-base font-bold text-ink">{statA.value}</span>
                <span className="block text-[11px] font-medium text-slate-500">{statA.label}</span>
              </span>
            </div>
          ) : null}

          {statB ? (
            <div className="glass animate-float-slow absolute bottom-8 left-8 hidden items-center gap-3 rounded-2xl px-4 py-3 shadow-lift md:flex">
              <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white">
                <ShieldCheck className="size-5" />
              </span>
              <span>
                <span className="block font-display text-base font-bold text-ink">{statB.value}</span>
                <span className="block text-[11px] font-medium text-slate-500">{statB.label}</span>
              </span>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
