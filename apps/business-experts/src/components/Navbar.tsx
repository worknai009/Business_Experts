import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Calendar,
  ChevronDown,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Mail,
  Menu,
  Search,
  X,
  Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSite } from "../context/SiteContext";

const getBusinessAiUrl = () => {
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:5173";
  }
  return (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_BUSINESS_AI_URL || "https://analytics.businessexperts.asia";
};

type NavChild = { label: string; to: string; icon: typeof Mail; desc: string };
type NavItem = { label: string; to?: string; children?: NavChild[]; external?: boolean; isAi?: boolean };

const NAV: NavItem[] = [
  { label: "Overview", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Training Programs", to: "/training-programs" },
  {
    label: "Resources",
    children: [
      { label: "Events", to: "/events", icon: Calendar, desc: "Summits, meetups & workshops" },
      { label: "Memberships", to: "/memberships", icon: BadgeCheck, desc: "Join the ecosystem" },
      { label: "Blog", to: "/blog", icon: FileText, desc: "Insights from our experts" },
      { label: "Gallery", to: "/gallery", icon: ImageIcon, desc: "Moments from the ecosystem" }
    ]
  },
  { label: "About Us", to: "/about" },
  { label: "BusinessAI", to: getBusinessAiUrl(), isAi: true }
];

type NavbarProps = {
  onOpenSearch?: () => void;
  onOpenAiModal?: () => void;
};

export default function Navbar({ onOpenSearch, onOpenAiModal }: NavbarProps) {
  const settings = useSite();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  const brand = settings?.brand;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#080d1a]/90 backdrop-blur-xl shadow-xs"
          : "border-b border-transparent bg-white/70 dark:bg-[#080d1a]/70 backdrop-blur-md"
      }`}
    >
      <div className="container-x flex h-18 items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3">
          {brand?.logo ? (
            <img
              src={brand.logo}
              alt={brand.name || "Business Experts"}
              style={{ height: brand.logoHeight ? `${brand.logoHeight}px` : "36px" }}
              className="w-auto object-contain"
            />
          ) : (
            <span className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {brand?.name || "Business Experts"}
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setMenu(item.label)}
                onMouseLeave={() => setMenu(null)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                >
                  {item.label}
                  <ChevronDown
                    className={`size-3.5 transition-transform duration-200 ${menu === item.label ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {menu === item.label ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-2"
                    >
                      <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-lift">
                        {item.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => setMenu(null)}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-brand-soft/60 dark:hover:bg-slate-800"
                          >
                            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft dark:bg-emerald-950/40 text-brand dark:text-emerald-400 transition group-hover:bg-brand group-hover:text-white">
                              <child.icon className="size-4" />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100 transition group-hover:text-brand">
                                {child.label}
                              </span>
                              <span className="block text-xs text-slate-500 dark:text-slate-400">{child.desc}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : item.isAi ? (
              <button
                key={item.label}
                type="button"
                onClick={onOpenAiModal ? onOpenAiModal : () => window.open(getBusinessAiUrl(), "_blank")}
                className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/20 hover:bg-emerald-500/20 transition cursor-pointer"
              >
                <Sparkles className="size-3.5 text-emerald-500" />
                <span>{item.label}</span>
              </button>
            ) : item.external || item.to?.startsWith("http") ? (
              <a
                key={item.label}
                href={item.to}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              >
                {item.label}
                <ExternalLink className="size-3.5 opacity-60" />
              </a>
            ) : (
              <NavLink
                key={item.to}
                to={item.to!}
                className={({ isActive }) =>
                  `rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-brand/10 dark:bg-emerald-950/40 text-brand dark:text-emerald-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Right Actions: Search + Dark Mode + Join Button */}
        <div className="flex items-center gap-2.5">
          {/* Universal Search Button */}
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:border-brand hover:text-slate-800 dark:hover:text-white transition"
              title="Search ecosystem"
            >
              <Search className="size-3.5" />
              <span className="hidden sm:inline">Search…</span>
            </button>
          )}

          {/* Become a Member Primary CTA */}
          <Link to="/memberships" className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex font-bold text-xs">
            Join Ecosystem
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((value) => !value)}
            className="grid size-9 place-items-center rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open ? (
        <nav className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#080d1a] px-4 pb-6 pt-3 lg:hidden">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label} className="mt-2">
                <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {item.label}
                </p>
                {item.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                        isActive
                          ? "bg-brand/10 dark:bg-emerald-950/40 text-brand dark:text-emerald-400"
                          : "text-slate-700 dark:text-slate-300"
                      }`
                    }
                  >
                    <child.icon className="size-4 text-brand" /> {child.label}
                  </NavLink>
                ))}
              </div>
            ) : item.isAi ? (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (onOpenAiModal) onOpenAiModal();
                  else window.open(getBusinessAiUrl(), "_blank");
                }}
                className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/30 my-1"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="size-4 text-emerald-500" />
                  {item.label}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20">AI</span>
              </button>
            ) : item.external || item.to?.startsWith("http") ? (
              <a
                key={item.label}
                href={item.to}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <span>{item.label}</span>
                <ExternalLink className="size-4 text-slate-400" />
              </a>
            ) : (
              <NavLink
                key={item.to}
                to={item.to!}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 text-sm font-semibold ${
                    isActive
                      ? "bg-brand/10 dark:bg-emerald-950/40 text-brand dark:text-emerald-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>
      ) : null}
    </header>
  );
}
