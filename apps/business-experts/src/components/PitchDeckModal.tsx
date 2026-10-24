import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  UploadCloud,
  CheckCircle2,
  Loader2,
  TrendingUp,
  FileText,
  Briefcase,
  DollarSign
} from "lucide-react";
import { apiPost } from "../api";

export default function PitchDeckModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Form Fields
  const [startupName, setStartupName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("Fintech & Banking");
  const [stage, setStage] = useState("Early Revenue / Seed");
  const [raisingAmount, setRaisingAmount] = useState("₹50L - ₹2Cr");
  const [deckLink, setDeckLink] = useState("");
  const [founderName, setFounderName] = useState("");
  const [founderEmail, setFounderEmail] = useState("");
  const [founderPhone, setFounderPhone] = useState("");
  const [summary, setSummary] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      await apiPost("/inquiries", {
        name: founderName.trim(),
        email: founderEmail.trim(),
        phone: founderPhone.trim(),
        message: `PITCH DECK SUBMISSION:
Startup: ${startupName}
Website: ${website}
Industry: ${industry}
Stage: ${stage}
Raising: ${raisingAmount}
Deck URL: ${deckLink}
Summary: ${summary}`,
        type: "pitch_deck"
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit pitch deck.");
    } finally {
      setBusy(false);
    }
  }

  function handleReset() {
    setSubmitted(false);
    setStep(1);
    setStartupName("");
    setWebsite("");
    setDeckLink("");
    setFounderName("");
    setFounderEmail("");
    setFounderPhone("");
    setSummary("");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090f1d] shadow-2xl z-10 text-slate-800 dark:text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4.5">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-brand/10 text-brand dark:bg-emerald-950/40 dark:text-emerald-400">
                  <TrendingUp className="size-4" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold">Submit Startup Pitch Deck</h3>
                  <p className="text-[11px] text-slate-400">Direct review by our investment committee</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid size-8 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="size-4" />
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="grid size-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-500 mx-auto">
                  <CheckCircle2 className="size-9" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Deck Received Successfully!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Our venture scouts review every submission within 3–5 business days. If there is a syndicate match, we will invite you to an introductory partner screening.
                </p>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-primary !py-2.5 !px-6 !rounded-xl !text-xs font-bold"
                >
                  Close &amp; Back to Platform
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800">{error}</p>}

                {step === 1 ? (
                  <div className="space-y-3.5">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Startup / Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={startupName}
                          onChange={(e) => setStartupName(e.target.value)}
                          placeholder="e.g. Apex AI"
                          className="input !py-2 !text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Website / Pitch URL
                        </label>
                        <input
                          type="text"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://yourstartup.com"
                          className="input !py-2 !text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Industry / Domain
                        </label>
                        <select
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="input !py-2 !text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        >
                          <option>Fintech &amp; Banking</option>
                          <option>SaaS &amp; Enterprise AI</option>
                          <option>Healthcare &amp; Life Sciences</option>
                          <option>Consumer / D2C Brands</option>
                          <option>Logistics &amp; Supply Chain</option>
                          <option>CleanTech &amp; Energy</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Target Round Size
                        </label>
                        <select
                          value={raisingAmount}
                          onChange={(e) => setRaisingAmount(e.target.value)}
                          className="input !py-2 !text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        >
                          <option>₹25L - ₹50L (Pre-Seed)</option>
                          <option>₹50L - ₹2Cr (Seed Round)</option>
                          <option>₹2Cr - ₹10Cr (Pre-Series A)</option>
                          <option>₹10Cr+ (Growth / Series A)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        One-Line Elevator Pitch
                      </label>
                      <input
                        type="text"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="What problem are you solving and for whom?"
                        className="input !py-2 !text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={!startupName.trim()}
                      onClick={() => setStep(2)}
                      className="btn-primary !py-2.5 !w-full !rounded-xl !text-xs font-bold mt-2"
                    >
                      Next: Deck &amp; Founder Contacts ➔
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Pitch Deck Link (Google Drive / DocSend / Notion) *
                      </label>
                      <input
                        type="url"
                        required
                        value={deckLink}
                        onChange={(e) => setDeckLink(e.target.value)}
                        placeholder="https://drive.google.com/... or https://docsend.com/..."
                        className="input !py-2 !text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Make sure link permissions allow view access.</p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Founder Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={founderName}
                          onChange={(e) => setFounderName(e.target.value)}
                          placeholder="Your full name"
                          className="input !py-2 !text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                          Founder Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={founderEmail}
                          onChange={(e) => setFounderEmail(e.target.value)}
                          placeholder="founder@domain.com"
                          className="input !py-2 !text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="text"
                          required
                          value={founderPhone}
                          onChange={(e) => setFounderPhone(e.target.value)}
                          placeholder="+91..."
                          className="input !py-2 !text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn-secondary !py-2 !px-4 !rounded-xl !text-xs font-bold"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={busy || !deckLink.trim() || !founderName.trim() || !founderEmail.trim()}
                        className="btn-primary !py-2.5 !flex-1 !rounded-xl !text-xs font-bold flex items-center justify-center gap-2"
                      >
                        {busy ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
                        <span>Submit Deck to Investment Panel</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
