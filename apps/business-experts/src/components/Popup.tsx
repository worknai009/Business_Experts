import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../context/SiteContext";

export default function Popup() {
  const settings = useSite();
  const [open, setOpen] = useState(false);

  const popup = settings?.popup;

  useEffect(() => {
    if (!popup?.enabled || sessionStorage.getItem("popup-shown") === "1") return;
    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("popup-shown", "1");
    }, 2500);
    return () => clearTimeout(timer);
  }, [popup?.enabled]);

  if (!popup?.enabled) return null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {popup.image ? <img src={popup.image} alt="" className="h-44 w-full object-cover" /> : null}
            <button
              type="button"
              aria-label="Close popup"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 text-ink shadow"
            >
              <X className="size-4" />
            </button>
            <div className="p-7">
              <h3 className="text-xl font-bold">{popup.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{popup.message}</p>
              {popup.buttonLabel ? (
                <Link to={popup.buttonLink || "/"} onClick={() => setOpen(false)} className="btn-primary mt-5 w-full">
                  {popup.buttonLabel}
                </Link>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
