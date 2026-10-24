import { Bot, Phone, Search, Sparkles, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";

type MobileActionDockProps = {
  onOpenSearch: () => void;
  onOpenAiModal: () => void;
};

export default function MobileActionDock({ onOpenSearch, onOpenAiModal }: MobileActionDockProps) {
  const settings = useSite();
  const phone = settings?.contact?.phone?.replace(/\s/g, "");
  const whatsapp = settings?.contact?.whatsapp?.replace(/\D/g, "");

  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp}?text=Hi%20Business%20Experts,%20I%20would%20like%20to%20learn%20more%20about%20your%20services.`
    : null;

  return (
    <nav
      aria-label="Mobile Quick Actions"
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-[#080d1a]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="grid grid-cols-5 items-center justify-around text-center">
        {/* Quick Call */}
        {phone ? (
          <a
            href={`tel:${phone}`}
            className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-300 hover:text-brand transition"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200">
              <Phone className="size-4 text-emerald-600 dark:text-emerald-400" />
            </span>
            <span className="text-[10px] font-bold mt-1">Call</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-300 hover:text-brand transition"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200">
              <Search className="size-4" />
            </span>
            <span className="text-[10px] font-bold mt-1">Search</span>
          </button>
        )}

        {/* WhatsApp or Search */}
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-4" />
            </span>
            <span className="text-[10px] font-bold mt-1">WhatsApp</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-300 hover:text-brand transition"
          >
            <span className="grid size-8 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
              <Search className="size-4" />
            </span>
            <span className="text-[10px] font-bold mt-1">Search</span>
          </button>
        )}

        {/* AI Advisor Modal - Highlighted Center Action */}
        <button
          type="button"
          onClick={onOpenAiModal}
          className="flex flex-col items-center justify-center py-1 group"
        >
          <span className="grid size-10 -mt-3 place-items-center rounded-2xl bg-gradient-to-tr from-brand to-emerald-400 text-white shadow-glow group-active:scale-95 transition">
            <Bot className="size-5" />
          </span>
          <span className="text-[10px] font-extrabold text-brand dark:text-emerald-400 mt-0.5">AI Engine</span>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-300 hover:text-brand transition"
        >
          <span className="grid size-8 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <Search className="size-4" />
          </span>
          <span className="text-[10px] font-bold mt-1">Search</span>
        </button>

        {/* Join / Memberships */}
        <Link
          to="/memberships"
          className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-300 hover:text-brand transition"
        >
          <span className="grid size-8 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <UserPlus className="size-4 text-brand dark:text-emerald-400" />
          </span>
          <span className="text-[10px] font-bold mt-1">Join</span>
        </Link>
      </div>
    </nav>
  );
}
