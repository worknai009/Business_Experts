import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Calendar,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Mail,
  Menu,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSite } from "../context/SiteContext";

type NavChild = { label: string; to: string; icon: typeof Mail; desc: string };
type NavItem = { label: string; to?: string; children?: NavChild[] };

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
  { label: "About Us", to: "/about" }
];

export default function Navbar() {
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

  const brandName = settings?.brand?.name || "Business Experts";

  const isParentActive = (item: NavItem) =>
    item.children?.some((child) => pathname === child.to || pathname.startsWith(`${child.to}/`)) || false;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "glass border-b !border-slate-200/70 shadow-soft"
          : "border-b border-transparent bg-white/60 backdrop-blur-sm"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-20">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          {settings?.brand?.logo ? (
            <img
              src={settings.brand.logo}
              alt={brandName}
              className="w-auto max-h-full"
              style={{ height: `${settings.brand.logoHeight || 64}px` }}
            />
          ) : (
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-deep font-display text-lg font-bold text-white">
              {brandName.charAt(0)}
            </span>
          )}
          <span className="truncate font-display text-lg font-bold text-ink">{brandName}</span>
        </Link>

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
                  onClick={() => setMenu((current) => (current === item.label ? null : item.label))}
                  className={`flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    isParentActive(item) || menu === item.label
                      ? "bg-brand-soft text-brand"
                      : "text-slate-600 hover:bg-slate-50 hover:text-ink"
                  }`}
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
                      className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3"
                    >
                      <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-2 shadow-lift">
                        {item.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => setMenu(null)}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-brand-soft"
                          >
                            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white">
                              <child.icon className="size-4" />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-ink transition group-hover:text-brand">
                                {child.label}
                              </span>
                              <span className="block text-xs text-slate-500">{child.desc}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to!}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    isActive ? "bg-brand-soft text-brand" : "text-slate-600 hover:bg-slate-50 hover:text-ink"
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/memberships" className="btn-primary hidden !px-5 !py-2.5 sm:inline-flex">
            Become a Member
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-xl border border-slate-200 text-ink lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-100 bg-white px-4 pb-6 pt-3 lg:hidden">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label} className="mt-2">
                <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  {item.label}
                </p>
                {item.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${
                        isActive ? "bg-brand-soft text-brand" : "text-slate-600"
                      }`
                    }
                  >
                    <child.icon className="size-4 text-brand" /> {child.label}
                  </NavLink>
                ))}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to!}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    isActive ? "bg-brand-soft text-brand" : "text-ink"
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
          <Link to="/memberships" className="btn-primary mt-4 w-full">
            Become a Member
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
