import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, CheckCircle2,
  ShieldCheck, BarChart3, Star
} from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

export default function Hero() {
  const { content } = useSiteContent();
  const heroData = content?.hero || {};
  const videoRef = useRef(null);

  const rotatingPhrases = heroData.rotatingPhrases?.length
    ? heroData.rotatingPhrases
    : heroData.highlight
    ? [heroData.highlight, "Profitable Decisions", "High-ROI Ventures", "Bankable Businesses"]
    : [
        "Thriving Enterprises",
        "Profitable Decisions",
        "High-ROI Ventures",
        "Bankable Businesses",
        "Market Leaders"
      ];

  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % rotatingPhrases.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [rotatingPhrases.length]);

  // Ensure autoplay works reliably across all browsers and devices
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const badgeText = heroData.badge || "AI-Powered Business Opportunity Finder";
  const headingLine1 = heroData.headingLine1 || "Turn Business Ideas Into";
  const headingSuffix = heroData.headingSuffix || heroData.headingLine3 || "in India.";
  const subheadline = heroData.description || heroData.subtitle || "Scan 500+ Indian industries, validate local consumer demand, calculate 12-month unit economics, and unlock government PMEGP/MUDRA subsidies in 30 seconds.";
  const primaryCta = heroData.primaryCtaLabel || heroData.ctaLabel || "Analyze Your Opportunity";
  const primaryTo = heroData.primaryCtaTo || heroData.ctaTo || "/business-finder";
  const secondaryCta = heroData.secondaryCtaLabel || "Explore Opportunities";

  return (
    <section
      className="relative isolate overflow-hidden text-[#0f172a] dark:text-white pt-4 pb-6 sm:pt-6 sm:pb-8 md:pt-0 md:pb-0 md:flex md:items-center bg-white dark:bg-[#070d19] transition-colors duration-200"
      style={{ minHeight: "clamp(580px, calc(100vh - 72px), 720px)" }}
    >
      {/* ══ Light Mode Hero Background: Harmonious gradient linking text and robot ══ */}
      <div
        className="absolute inset-0 -z-30 dark:hidden"
        style={{
          background:
            "linear-gradient(100deg, #ffffff 0%, #f4fbf7 30%, #e1f7ec 48%, #082d25 68%, #031714 100%)",
        }}
      />

      {/* ══ Dark Mode Hero Background ══ */}
      <div
        className="absolute inset-0 -z-30 hidden dark:block"
        style={{
          background:
            "linear-gradient(100deg, #051419 0%, #071f20 35%, #0a2d2a 55%, #05221d 75%, #021411 100%)",
        }}
      />

      {/* ══ Luminous Connection Flow: Links Robot's Pointing Finger directly to the Headline ══ */}
      <div
        className="absolute left-[28%] md:left-[34%] lg:left-[36%] top-[24%] md:top-[28%] w-[280px] lg:w-[380px] h-[140px] pointer-events-none -z-10 hidden md:block"
        style={{
          background:
            "radial-gradient(ellipse at 85% 50%, rgba(52, 211, 153, 0.38) 0%, rgba(16, 185, 129, 0.22) 35%, rgba(5, 150, 105, 0.05) 70%, transparent 100%)",
          filter: "blur(22px)",
        }}
      />

      {/* ══ Professional Curved Connection Flow between Text & Video (GPU Accelerated) ══ */}
      <div className="absolute top-0 bottom-0 left-[45%] md:left-[47%] lg:left-[46%] w-[120px] h-full pointer-events-none -z-10 hidden md:block overflow-visible" style={{ transform: "translate3d(0,0,0)" }}>
        {/* Soft volumetric curved ambient shadow */}
        <div
          className="absolute inset-0 w-[140px] -left-6 bg-gradient-to-r from-emerald-600/10 via-emerald-500/20 to-transparent dark:from-emerald-400/5 dark:via-emerald-400/15 dark:to-transparent blur-xl pointer-events-none"
          style={{
            clipPath: "ellipse(48% 60% at 50% 50%)",
          }}
        />

        <svg
          viewBox="0 0 100 800"
          preserveAspectRatio="none"
          className="w-full h-full opacity-75 dark:opacity-60"
        >
          <defs>
            <linearGradient id="heroCurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="25%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="52%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="78%" stopColor="#059669" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Volumetric Curved Shadow Arc */}
          <path
            d="M35,0 Q75,400 25,800"
            stroke="url(#heroCurveGradient)"
            strokeWidth="20"
            fill="none"
            opacity="0.25"
          />
          {/* Refined Glowing Curved Connector Line */}
          <path
            d="M35,0 Q75,400 25,800"
            stroke="url(#heroCurveGradient)"
            strokeWidth="2.5"
            fill="none"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* ══ Text Column: Left 50-52% desktop / full width mobile with Ambient Background Depth Shadow ══ */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Soft atmospheric depth shadow directly behind text area */}
        <div
          className="absolute -left-6 top-[8%] w-[520px] h-[480px] rounded-[40px] pointer-events-none -z-10 hidden md:block"
          style={{
            background:
              "radial-gradient(ellipse at 40% 45%, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.03) 45%, transparent 75%)",
            filter: "blur(32px)",
          }}
        />

        <div className="w-full md:w-[52%] lg:w-[48%] max-w-[650px] text-left py-6 lg:py-10">

          {/* Line 1: Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-400/40 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-black uppercase tracking-wider shadow-xs backdrop-blur-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" />
            <span>{badgeText}</span>
          </motion.div>

          {/* Line 2 & 3: Main Big Headline with 3 Clean Stable Lines */}
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-[42px] xl:text-[50px] font-black text-slate-900 dark:text-white tracking-normal leading-[1.25]">
            {/* Line 1 */}
            <span className="block mb-1">{headingLine1}</span>

            {/* Line 2: Animated Rotating Word */}
            <span className="block min-h-[1.25em] my-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={rotatingPhrases[phraseIdx]}
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block text-[#047857] dark:text-[#00b884] font-black"
                >
                  {rotatingPhrases[phraseIdx]}
                </motion.span>
              </AnimatePresence>
            </span>

            {/* Line 3: Suffix */}
            <span className="block mt-1 text-slate-900 dark:text-white">
              {headingSuffix}
            </span>
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 sm:mt-7 text-base sm:text-lg text-slate-600 dark:text-[#c7f5df] font-medium leading-relaxed max-w-xl text-balance"
          >
            {subheadline}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6.5 flex flex-wrap items-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={primaryTo}
                style={{ backgroundColor: '#047857', color: '#ffffff' }}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-black transition-all shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 flex items-center gap-2.5 cursor-pointer border-0 group"
              >
                <span>{primaryCta}</span>
                <ArrowRight size={18} color="#ffffff" strokeWidth={2.5} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/analyze"
                className="px-7 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white text-base font-bold transition border border-slate-300 dark:border-white/30 shadow-sm flex items-center gap-2 cursor-pointer backdrop-blur-sm"
              >
                <BarChart3 size={18} className="text-emerald-600 dark:text-emerald-300" />
                <span>{secondaryCta}</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust Proof Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 pt-4 border-t border-slate-200 dark:border-white/20 flex flex-wrap items-center gap-5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-bold"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <span>4.9/5 from 12,400+ Founders</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 size={16} />
              <span>Bank Loan PDF Ready</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
              <ShieldCheck size={16} />
              <span>PMEGP &amp; MUDRA Match</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ══ Robot Video: Right Side Full Height Visual (Seamless Linear Fade, Zero Circles, Zero Box Borders) ══ */}
      <div
        className="relative z-10 mt-6 sm:mt-8 px-0 w-full md:mt-0 md:absolute md:top-0 md:bottom-0 md:right-0 md:w-[50%] lg:w-[52%] xl:w-[55%] md:h-full flex items-center justify-end pointer-events-none overflow-hidden"
      >
        <div className="relative w-full h-[360px] sm:h-[460px] md:h-full flex items-center justify-end">
          {/* Seamless full-height video with smooth left horizontal edge fade like reference */}
          <video
            ref={videoRef}
            src="/robot-video.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="BusinessAI intelligent assistant robot"
            className="w-full h-full object-cover object-center select-none pointer-events-none"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.2) 6%, rgba(0, 0, 0, 0.85) 16%, black 28%, black 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.2) 6%, rgba(0, 0, 0, 0.85) 16%, black 28%, black 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
