import { motion } from "framer-motion";

type Props = { eyebrow: string; title: string; subtitle?: string };

export default function PageHero({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="hero-glow relative overflow-hidden border-b border-slate-200/60">
      <div className="bg-grid fade-mask pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -top-20 right-[16%] size-64 rounded-full bg-brand/10 blur-3xl"
        aria-hidden
      />
      <div className="container-x relative py-18 text-center md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <span className="eyebrow">
            <span className="size-1 rounded-full bg-brand" />
            {eyebrow}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-3xl font-bold tracking-tight md:text-5xl md:leading-[1.12]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-5 max-w-2xl text-base text-slate-500 md:text-lg">{subtitle}</p>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
