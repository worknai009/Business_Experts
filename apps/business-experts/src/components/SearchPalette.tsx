import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  X,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Calendar,
  FileText,
  ArrowRight,
  Sparkles,
  Command
} from "lucide-react";
import { apiGet, type HomeData } from "../api";

type SearchResultItem = {
  id: string;
  title: string;
  category: "Service" | "Training" | "Project" | "Event" | "Blog";
  description?: string;
  url: string;
  icon: typeof Briefcase;
};

export default function SearchPalette({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<HomeData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load data when first opened
  useEffect(() => {
    if (open && !data) {
      apiGet<HomeData>("/home").then(setData).catch(() => {});
    }
  }, [open, data]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  // Global hotkey: Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) onClose();
        else onClose(); // parent will toggle
      }
      if (e.key === "Escape" && open) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Flatten items for search
  const allItems: SearchResultItem[] = useMemo(() => {
    if (!data) return [];
    const items: SearchResultItem[] = [];

    (data.services || []).forEach((s) => {
      items.push({
        id: `svc-${s._id || s.slug}`,
        title: s.title,
        category: "Service",
        description: s.description,
        url: `/services/${s.slug}`,
        icon: Briefcase
      });
    });

    (data.courses || []).forEach((c) => {
      items.push({
        id: `crs-${c._id || c.slug}`,
        title: c.title,
        category: "Training",
        description: c.shortDescription || c.description,
        url: `/training-programs/${c.slug}`,
        icon: GraduationCap
      });
    });

    (data.projects || []).forEach((p) => {
      items.push({
        id: `prj-${p._id || p.slug}`,
        title: p.title,
        category: "Project",
        description: p.shortDescription || p.fullDescription,
        url: `/projects/${p.slug}`,
        icon: FolderGit2
      });
    });

    (data.events || []).forEach((e) => {
      items.push({
        id: `evt-${e._id || e.title}`,
        title: e.title,
        category: "Event",
        description: e.venue || e.description,
        url: `/events`,
        icon: Calendar
      });
    });

    (data.blogs || []).forEach((b) => {
      items.push({
        id: `blg-${b._id || b.slug}`,
        title: b.title,
        category: "Blog",
        description: b.excerpt,
        url: `/blog/${b.slug}`,
        icon: FileText
      });
    });

    return items;
  }, [data]);

  // Filter items
  const filtered = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 7);
    const q = query.toLowerCase();
    return allItems
      .filter((item) => item.title.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q))
      .slice(0, 10);
  }, [allItems, query]);

  // Keyboard navigation
  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  }

  function handleSelect(item: SearchResultItem) {
    onClose();
    navigate(item.url);
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-5 py-4">
              <Search className="size-5 text-slate-400 dark:text-slate-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search services, startups, training, events, or blogs…"
                className="flex-1 bg-transparent text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-3 space-y-1">
              {filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No results found</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching for keywords like "consulting", "fintech", "startup", or "course".</p>
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-left transition ${
                        isSelected
                          ? "bg-brand/10 dark:bg-brand/20 text-brand dark:text-emerald-300"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`grid size-9 shrink-0 place-items-center rounded-xl transition ${
                            isSelected
                              ? "bg-brand text-white shadow-glow"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate text-slate-900 dark:text-slate-100">{item.title}</p>
                          {item.description ? (
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.description}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <ArrowRight className={`size-3.5 transition ${isSelected ? "text-brand translate-x-0.5" : "text-slate-300 dark:text-slate-600"}`} />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer shortcuts */}
            <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <Command className="size-3" /> Universal Ecosystem Search
              </span>
              <span className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
