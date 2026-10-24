import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

export default function Testimonials() {
  const { content } = useSiteContent();
  const testData = content?.testimonials || {};

  const reviews = testData.reviews || [
    {
      name: "Rohit Sharma",
      role: "Entrepreneur",
      text: "BusinessAI helped me find a cloud kitchen opportunity. Today I am earning 1.5L/month.",
      initials: "RS",
    },
    {
      name: "Priya Mehta",
      role: "Small Business Owner",
      text: "The AI report is incredibly detailed and easy to understand. Highly recommended.",
      initials: "PM",
    },
    {
      name: "Aman Verma",
      role: "Investor",
      text: "I use BusinessAI to evaluate ideas before investing. It saves so much time.",
      initials: "AV",
    },
    {
      name: "Sneha Patil",
      role: "Student",
      text: "Perfect for learning how market analysis actually works before starting out.",
      initials: "SP",
    },
  ];

  const [start, setStart] = useState(0);
  const visible = 3;

  const prev = () => setStart((s) => (s - 1 + reviews.length) % reviews.length);
  const next = () => setStart((s) => (s + 1) % reviews.length);

  const shown = Array.from({ length: Math.min(visible, reviews.length) }, (_, i) => reviews[(start + i) % reviews.length]);

  return (
    <section className="landing-section py-10 sm:py-16">
      <div className="w-full max-w-full mx-auto px-2 sm:px-4 lg:px-6">

        <div className="text-center mb-10">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-2">
            {testData.eyebrow || "What Users Say"}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {testData.title || "Trusted by Thousands of Entrepreneurs"}
          </h2>
        </div>

        <div className="relative">
          {reviews.length > 3 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonials"
                className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-emerald-500 items-center justify-center transition shadow-lg cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonials"
                className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-emerald-500 items-center justify-center transition shadow-lg cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {shown.map((r, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all duration-300 relative flex flex-col justify-between shadow-xl"
              >
                <Quote size={32} className="absolute top-5 right-5 text-emerald-500/15 dark:text-emerald-500/10 pointer-events-none" />

                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-black text-sm shrink-0 shadow-xs overflow-hidden">
                      {r.avatar ? (
                        <img
                          src={r.avatar}
                          alt={r.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <span>{r.initials || r.name?.substring(0, 2).toUpperCase() || "AI"}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-black text-slate-900 dark:text-white truncate">{r.name}</div>
                      <div className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate">{r.role}</div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4 font-medium">"{r.text}"</p>
                </div>

                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-emerald-500 fill-emerald-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {reviews.length > 1 && (
            <div className="flex lg:hidden justify-center gap-1.5 mt-5">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setStart(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === start ? "w-6 bg-emerald-600 dark:bg-emerald-500" : "w-2 bg-slate-300 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
