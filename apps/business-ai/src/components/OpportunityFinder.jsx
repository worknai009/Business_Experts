import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChefHat, GraduationCap, Leaf } from "lucide-react";
import PhotoCard from "./PhotoCard";
import { useSiteContent } from "../context/SiteContentContext";

const icons = [ChefHat, GraduationCap, Leaf];

export default function OpportunityFinder() {
  const navigate = useNavigate();
  const { content } = useSiteContent();
  const oppData = content?.opportunityFinder || {};

  const [interest, setInterest] = useState("");
  const [experience, setExperience] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");

  const submit = (e) => {
    e.preventDefault();
    navigate("/business-finder", {
      state: { interest, experience: experience || "Beginner", budget, location },
    });
  };

  const opportunities = (oppData.opportunities || [
    {
      name: "Cloud Kitchen",
      tag: "High Potential",
      invest: "₹8L – ₹15L",
      img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&h=350&fit=crop&q=80",
    },
    {
      name: "Online Tutoring",
      tag: "High Potential",
      invest: "₹5L – ₹15L",
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=350&fit=crop&q=80",
    },
    {
      name: "Eco-Friendly Store",
      tag: "High Potential",
      invest: "₹5L – ₹12L",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=350&fit=crop&q=80",
    },
  ]).map((op, i) => ({
    ...op,
    icon: icons[i % icons.length]
  }));

  const metrics = oppData.metrics || [
    { label: "AI Match", value: "96%", accent: false },
    { label: "Market Demand", value: "High", accent: true },
    { label: "Investment Range", value: "₹8L – ₹15L", accent: false },
    { label: "Profit Potential", value: "30% – 45%", accent: true },
  ];

  const fieldCls =
    "w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none font-semibold";

  return (
    <section id="opportunities" className="landing-section w-full py-10 sm:py-16">
      <div className="w-full max-w-full mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

          {/* ══ LEFT: search form ══ */}
          <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between backdrop-blur-xl">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-2">
                {oppData.title || "Find opportunities that fit"}{" "}
                <span className="text-emerald-600 dark:text-emerald-400">{oppData.highlight || "your reality."}</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {oppData.subtitle || "Enter your details and let our AI find the best opportunities for you."}
              </p>

              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus-within:border-emerald-500 transition block shadow-inner">
                    <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                      Your Interest
                    </span>
                    <input
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      placeholder="e.g. Food, Technology, Fashion"
                      className={fieldCls}
                    />
                  </label>

                  <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus-within:border-emerald-500 transition block shadow-inner">
                    <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                      Experience Level
                    </span>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className={`${fieldCls} cursor-pointer`}
                    >
                      <option value="" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Select experience</option>
                      <option value="Beginner" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Beginner</option>
                      <option value="Intermediate" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Intermediate</option>
                      <option value="Experienced" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Experienced</option>
                    </select>
                  </label>

                  <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus-within:border-emerald-500 transition block shadow-inner">
                    <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                      Budget Range
                    </span>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className={`${fieldCls} cursor-pointer`}
                      required
                    >
                      <option value="" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Select budget range</option>
                      <option value="200000" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">Under ₹2L</option>
                      <option value="500000" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">₹2L – ₹5L</option>
                      <option value="1000000" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">₹5L – ₹10L</option>
                      <option value="2500000" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">₹10L – ₹25L</option>
                      <option value="5000000" className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">₹25L+</option>
                    </select>
                  </label>

                  <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus-within:border-emerald-500 transition block shadow-inner">
                    <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                      Preferred Location
                    </span>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter location"
                      className={fieldCls}
                      required
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full h-13 sm:h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/30 transition transform active:scale-[0.99] cursor-pointer mt-2"
                >
                  <Search size={20} />
                  <span>{oppData.ctaLabel || "Find Opportunities"}</span>
                </button>
              </form>
            </div>

            <div className="flex items-center gap-4 mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
              <div className="flex -space-x-2.5">
                {["RS", "PM", "AV", "SP"].map((i) => (
                  <span
                    key={i}
                    className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border-2 border-white dark:border-slate-900 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center justify-center shadow-md"
                  >
                    {i}
                  </span>
                ))}
                <span className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-900 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center shadow-md">
                  {oppData.trustedCount || "+12K"}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                {oppData.trustedText || "Trusted by entrepreneurs and businesses worldwide"}
              </span>
            </div>
          </div>

          {/* ══ RIGHT: top opportunities ══ */}
          <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{oppData.listTitle || "Top Opportunities For You"}</h3>
                <button
                  type="button"
                  onClick={() => navigate("/business-finder")}
                  className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition cursor-pointer flex items-center gap-1"
                >
                  View All &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
                {opportunities.map(({ icon: Icon, name, tag, invest, img }) => (
                  <div
                    key={name}
                    className="rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 transition flex flex-col shadow-lg"
                  >
                    <PhotoCard src={img} alt={name} icon={Icon} className="aspect-[16/10] w-full" />
                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate leading-snug">
                          {name}
                        </div>
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{tag}</div>
                      </div>
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                          Invest. Range
                        </div>
                        <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 mt-0.5">{invest}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 rounded-2xl bg-slate-100/90 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 divide-x divide-y sm:divide-y-0 divide-slate-200 dark:divide-slate-800 shadow-inner overflow-hidden">
              {metrics.map((m) => (
                <div key={m.label} className="p-4 sm:p-5 text-center">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 leading-tight">
                    {m.label}
                  </div>
                  <div
                    className={`text-base sm:text-xl font-black ${
                      m.accent ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
