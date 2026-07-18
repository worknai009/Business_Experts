import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Faq } from "../api";

export default function FaqList({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((faq) => {
        const open = openId === faq._id;
        return (
          <div key={faq._id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpenId(open ? null : faq._id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-display text-sm font-semibold text-ink md:text-base">{faq.question}</span>
              <ChevronDown className={`size-5 shrink-0 text-brand transition duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="px-6 pb-5 text-sm leading-relaxed">{faq.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
