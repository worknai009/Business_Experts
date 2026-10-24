import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mail, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { apiPost } from "../api";

const RESEND_SECONDS = 45;

type Props = {
  email: string;
  onClose: () => void;
  onVerified: (otpToken: string) => void;
};

export default function OtpVerifyModal({ email, onClose, onVerified }: Props) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"sending" | "sent" | "verifying" | "error">("sending");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const sentOnce = useRef(false);

  async function sendCode() {
    setStatus("sending");
    setError("");
    try {
      await apiPost<{ ok: boolean; devCode?: string }>("/otp/send", { email });
      setStatus("sent");
      setCooldown(RESEND_SECONDS);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Could not send code.");
      setStatus("error");
    }
  }

  useEffect(() => {
    if (sentOnce.current) return;
    sentOnce.current = true;
    sendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function verify() {
    if (code.trim().length !== 6) return;
    setStatus("verifying");
    setError("");
    try {
      const result = await apiPost<{ ok: boolean; otpToken: string }>("/otp/verify", { email, code: code.trim() });
      onVerified(result.otpToken);
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "Verification failed.");
      setStatus("sent");
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", damping: 24, stiffness: 260 }}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-7 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-ink"
          >
            <X className="size-4" />
          </button>

          <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
            <ShieldCheck className="size-6" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-ink">Verify your email</h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
            <Mail className="size-3.5 shrink-0" />
            <span className="truncate">{email}</span>
          </p>

          {status === "sending" && !error ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" /> Sending verification code…
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-slate-500">Enter the 6-digit code we sent to your email.</p>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                onKeyDown={(event) => event.key === "Enter" && verify()}
                placeholder="••••••"
                className="input text-center text-2xl font-bold tracking-[0.5em]"
              />
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
              <button
                type="button"
                onClick={verify}
                disabled={code.trim().length !== 6 || status === "verifying"}
                className="btn-primary w-full disabled:opacity-50"
              >
                {status === "verifying" ? "Verifying…" : "Verify Code"}
              </button>
              <button
                type="button"
                onClick={sendCode}
                disabled={cooldown > 0 || status === "sending"}
                className="w-full text-center text-xs font-semibold text-brand disabled:text-slate-400"
              >
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
