import { ArrowRight, Megaphone, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";

export default function AnnouncementBar() {
  const settings = useSite();
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("announcement-dismissed") === "1");

  const announcement = settings?.announcement;
  if (!announcement?.enabled || !announcement.text || dismissed) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-brand-deep via-brand to-brand-dark text-white">
      <div className="container-x flex items-center justify-center gap-3 py-2.5 pr-10 text-center text-xs font-medium sm:text-sm">
        <Megaphone className="hidden size-4 shrink-0 sm:block" />
        <span>{announcement.text}</span>
        {announcement.link ? (
          <Link to={announcement.link} className="inline-flex shrink-0 items-center gap-1 font-semibold underline underline-offset-4">
            {announcement.linkLabel || "Learn more"} <ArrowRight className="size-3.5" />
          </Link>
        ) : null}
      </div>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          sessionStorage.setItem("announcement-dismissed", "1");
          setDismissed(true);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-white/15"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
