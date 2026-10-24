import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, CheckCircle2, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";
import BrandMark from "./BrandMark";
import { useSiteContent } from "../context/SiteContentContext";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (email.trim()) setSent(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Stay Updated</span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">Monthly</span>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        Curated high-ROI MSME trends, policy updates, and regional demand shifts.
      </p>
      {sent ? (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
          <CheckCircle2 size={16} />
          <span>You're subscribed to Trusted Growth Advisor updates!</span>
        </div>
      ) : (
        <form onSubmit={submit} className="flex gap-2">
          <div className="relative flex-1">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 transition shadow-inner"
              required
            />
          </div>
          <button
            type="submit"
            aria-label="Subscribe"
            style={{ backgroundColor: '#047857', color: '#ffffff' }}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shrink-0 cursor-pointer shadow-md flex items-center justify-center border-0"
          >
            <ArrowRight size={15} />
          </button>
        </form>
      )}
    </div>
  );
}

const socials = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    path: "M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4v12H3v-12zm7 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.76-1.95 4.02 0 4.76 2.5 4.76 5.76v6.55h-4v-5.8c0-1.38-.03-3.16-2-3.16-2 0-2.3 1.5-2.3 3.06v5.9h-4v-12z",
  },
  {
    label: "X",
    href: "https://x.com",
    path: "M17.53 3h3.02l-6.6 7.54L21.75 21h-5.9l-4.63-6.05L5.9 21H2.87l7.06-8.07L2.5 3h6.05l4.18 5.53L17.53 3zm-1.06 16.2h1.67L7.6 4.71H5.8l10.67 14.49z",
  },
  {
    label: "GitHub",
    href: "https://github.com",
    path: "M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49l-.01-1.72c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.28 9.28 0 015 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.59.69.49A10.03 10.03 0 0022 12.25C22 6.58 17.52 2 12 2z",
  },
  {
    label: "Email",
    href: "mailto:support@businessai.com",
    path: "M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4.24l-8 4.99-8-4.99V6l8 5 8-5v2.24z",
  },
];

export default function SiteFooter() {
  const navigate = useNavigate();
  const { content } = useSiteContent();
  const footerData = content?.footer || {};

  const scrollToSection = (id) => {
    if (window.location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      const yOffset = -75;
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  const columns = [
    {
      title: "Product",
      links: [
        { label: "Market Radar", action: () => scrollToSection("features") },
        { label: "5-Step Framework", action: () => scrollToSection("how-it-works") },
        { label: "Opportunity Finder", action: () => scrollToSection("opportunities") },
        { label: "Feasibility Simulator", to: "/analyze" },
        { label: "Pricing Plans", action: () => scrollToSection("pricing") },
      ],
    },
    {
      title: "Intelligence & Tools",
      links: [
        { label: "500+ Sectors Finder", to: "/business-finder" },
        { label: "PMEGP / MUDRA Subsidies", to: "/analyze" },
        { label: "Bank Dossier Export", to: "/analyze" },
        { label: "Frequently Asked Questions", action: () => scrollToSection("faq") },
        { label: "Saved Dossiers & History", to: "/history" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About BusinessAI", action: () => scrollToSection("features") },
        { label: "Start Free Analysis", to: "/register" },
        { label: "Founder Sign In", to: "/login" },
        { label: "Privacy Policy", to: "/" },
        { label: "Terms of Service", to: "/" },
      ],
    },
  ];

  return (
    <footer className="landing-footer bg-slate-50 dark:bg-[#060b17] border-t border-slate-200 dark:border-slate-800/80 pt-16 pb-10 transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-200 dark:border-slate-800/80">

          {/* Left Brand Column (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <BrandMark size={32} />
              <div className="flex flex-col text-left">
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  Business<span className="text-emerald-600 dark:text-emerald-400">AI</span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-0.5">
                  TRUSTED GROWTH ADVISOR
                </span>
              </div>
            </Link>
            
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm font-medium">
              {footerData.description || "Next-generation business feasibility, market demand validation, and unit economics intelligence engine for Indian founders and MSMEs."}
            </p>

            <div className="flex items-center gap-2 pt-2">
              {socials.map(({ path, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 hover:shadow-md transition flex items-center justify-center"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                    <title>{label}</title>
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns (5 cols: 2 + 2 + 2 or 5 cols distributed) */}
          <div className="md:col-span-5 grid grid-cols-3 gap-6">
            {columns.map((col) => (
              <div key={col.title} className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  {col.title}
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.to ? (
                        <Link
                          to={l.to}
                          className="footer-link inline-block text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-150"
                        >
                          {l.label}
                        </Link>
                      ) : (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={l.action}
                          onKeyDown={(e) => e.key === "Enter" && l.action()}
                          className="footer-link inline-block text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-150 cursor-pointer select-none"
                        >
                          {l.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right Newsletter Column (3 cols) */}
          <div className="md:col-span-3">
            <Newsletter />
          </div>

        </div>

        {/* Bottom Copyright & Legal Links Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-8 font-medium">
          <div>
            <span>{footerData.copyright || "© 2026 BusinessAI Inc. • Trusted Growth Advisor. All rights reserved."}</span>
          </div>

          <div className="flex items-center gap-5 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Security Policy</Link>
            <span>•</span>
            <Link to="/#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Help Center</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
