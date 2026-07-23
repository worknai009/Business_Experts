import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  GraduationCap,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  X
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { apiGet, apiPost, type HomeData } from "../api";
import { useSite } from "../context/SiteContext";

type Sender = "bot" | "user";
type Stage = "identity" | "otp" | "chat";

type QuickAction = {
  label: string;
  topic?: string;
  action?: () => void;
};

type Message = {
  id: number;
  sender: Sender;
  text: string;
  actions?: QuickAction[];
};

let messageId = 0;
const nextId = () => ++messageId;

export default function ChatWidget() {
  const settings = useSite();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<HomeData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [stage, setStage] = useState<Stage>("identity");
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const brandName = settings?.brand?.name || "Business Experts";
  const contact = settings?.contact;

  useEffect(() => {
    apiGet<HomeData>("/home")
      .then(setData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (stage === "chat" && messages.length === 0) {
      setMessages([
        {
          id: nextId(),
          sender: "bot",
          text: `Hi ${visitorName.split(" ")[0] || "there"}! I'm the ${brandName} assistant. How can I help you today?`,
          actions: mainMenu()
        }
      ]);
    }
  }, [stage, brandName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  async function submitIdentity(event: FormEvent) {
    event.preventDefault();
    if (!visitorName.trim() || !visitorEmail.trim()) return;
    setOtpBusy(true);
    setOtpError("");
    try {
      await apiPost<{ ok: boolean; devCode?: string }>("/otp/send", { email: visitorEmail.trim() });
      setStage("otp");
      setResendCooldown(45);
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : "Could not send code.");
    } finally {
      setOtpBusy(false);
    }
  }

  async function resendOtp() {
    if (resendCooldown > 0) return;
    setOtpBusy(true);
    setOtpError("");
    try {
      await apiPost<{ ok: boolean; devCode?: string }>("/otp/send", { email: visitorEmail.trim() });
      setResendCooldown(45);
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : "Could not resend code.");
    } finally {
      setOtpBusy(false);
    }
  }

  async function submitOtp(event: FormEvent) {
    event.preventDefault();
    if (otpCode.trim().length !== 6) return;
    setOtpBusy(true);
    setOtpError("");
    try {
      await apiPost<{ ok: boolean; otpToken: string }>("/otp/verify", {
        email: visitorEmail.trim(),
        code: otpCode.trim()
      });
      setStage("chat");
    } catch (error) {
      setOtpError(error instanceof Error ? error.message : "Incorrect code.");
    } finally {
      setOtpBusy(false);
    }
  }

  function mainMenu(): QuickAction[] {
    return [
      { label: "Our Services", topic: "services" },
      { label: "Training Programs", topic: "training" },
      { label: "Our Projects", topic: "projects" },
      { label: "Contact Us", topic: "contact" }
    ];
  }

  function pushBot(text: string, actions?: QuickAction[]) {
    setMessages((prev) => [...prev, { id: nextId(), sender: "bot", text, actions }]);
  }

  function handleQuickAction(action: QuickAction) {
    setMessages((prev) => [...prev, { id: nextId(), sender: "user", text: action.label }]);
    if (action.topic) {
      setTimeout(() => {
        const reply = answerFor(action.topic!);
        pushBot(reply.text, reply.actions);
      }, 300);
    } else {
      action.action?.();
    }
  }

  function answerFor(raw: string): { text: string; actions?: QuickAction[] } {
    const q = raw.toLowerCase();

    if (/\b(hi|hello|hey|namaste)\b/.test(q)) {
      return { text: `Hello! How can I help you today?`, actions: mainMenu() };
    }

    // Check if the question names a specific service/course/project we actually have
    // before falling back to generic keyword categories — avoids misclassifying an
    // unrelated name (e.g. a word that happens to contain "class" or "work").
    const matchedService = (data?.services || []).find((s) => q.includes(s.title.toLowerCase()));
    if (matchedService) {
      return {
        text: `${matchedService.title}: ${matchedService.description || "One of our core services."}`,
        actions: mainMenu()
      };
    }

    const matchedCourse = (data?.courses || []).find((c) => q.includes(c.title.toLowerCase()));
    if (matchedCourse) {
      return {
        text: `${matchedCourse.title}: ${matchedCourse.shortDescription || matchedCourse.description || "One of our training programs."}${
          matchedCourse.priceLabel ? ` Pricing: ${matchedCourse.priceLabel}.` : ""
        }`,
        actions: mainMenu()
      };
    }

    const matchedProject = (data?.projects || []).find((p) => q.includes(p.title.toLowerCase()));
    if (matchedProject) {
      return {
        text: `${matchedProject.title}: ${matchedProject.shortDescription || "One of our delivered projects."}`,
        actions: mainMenu()
      };
    }

    if (/\bservices?\b/.test(q)) {
      const names = (data?.services || []).slice(0, 8).map((s) => s.title);
      const list = names.length
        ? ` We offer: ${names.join(", ")}.`
        : " Our team offers a range of business consulting and support services.";
      return { text: `Here's what we offer.${list}`, actions: mainMenu() };
    }

    if (/\b(training|trainings|course|courses|program|programs|workshop|workshops)\b/.test(q)) {
      const names = (data?.courses || []).slice(0, 8).map((c) => c.title);
      const list = names.length
        ? ` Popular programs: ${names.join(", ")}.`
        : " Our team can share the current training schedule with you.";
      return { text: `We run several training programs to help you grow.${list}`, actions: mainMenu() };
    }

    if (/\b(project|projects|portfolio)\b/.test(q)) {
      const names = (data?.projects || []).slice(0, 6).map((p) => p.title);
      const list = names.length ? ` Some of our work: ${names.join(", ")}.` : "";
      return { text: `We've delivered projects across several industries.${list}`, actions: mainMenu() };
    }

    if (/price|pricing|cost|fee|charge/.test(q)) {
      return {
        text: `Pricing varies by service or program. Ask me about a specific service or training program, or reach our team directly for exact quotes.${
          contact?.phone ? ` You can call ${contact.phone}.` : ""
        }${contact?.email ? ` Or email ${contact.email}.` : ""}`,
        actions: mainMenu()
      };
    }

    if (/member/.test(q)) {
      const names = (data?.memberships || []).slice(0, 5).map((m) => m.name);
      const list = names.length ? ` Plans include: ${names.join(", ")}.` : "";
      return {
        text: `Our memberships give you ongoing access to the ${brandName} ecosystem — events, resources and more.${list}`,
        actions: mainMenu()
      };
    }

    if (/event|summit|meetup/.test(q)) {
      const names = (data?.events || []).slice(0, 5).map((e) => e.title);
      const list = names.length ? ` Upcoming: ${names.join(", ")}.` : "";
      return { text: `We regularly host events, summits and workshops.${list}`, actions: mainMenu() };
    }

    if (/blog|article|news/.test(q)) {
      return { text: `We publish insights and updates from our experts regularly.`, actions: mainMenu() };
    }

    if (/about|who are you|company/.test(q)) {
      return {
        text: `${brandName} is a business ecosystem connecting founders, investors, professionals and communities to help businesses grow.`,
        actions: mainMenu()
      };
    }

    if (/contact|phone|email|call|reach|address|whatsapp|talk/.test(q)) {
      const bits: string[] = [];
      if (contact?.phone) bits.push(`call us at ${contact.phone}`);
      if (contact?.email) bits.push(`email ${contact.email}`);
      if (contact?.whatsapp) bits.push(`WhatsApp ${contact.whatsapp}`);
      const via = bits.length ? ` You can ${bits.join(", ")}.` : "";
      const addr = contact?.address ? ` Our office: ${contact.address}.` : "";
      return { text: `We'd love to hear from you!${via}${addr}`, actions: mainMenu() };
    }

    if (/thank/.test(q)) {
      return { text: `You're welcome! Anything else I can help with?`, actions: mainMenu() };
    }

    return {
      text: `I couldn't find anything about that on our site. For anything specific, our team can help directly${
        contact?.phone ? ` — call ${contact.phone}` : ""
      }${contact?.email ? ` or email ${contact.email}` : ""}. Meanwhile, here's what I can help with:`,
      actions: mainMenu()
    };
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: nextId(), sender: "user", text }]);
    setInput("");
    const reply = answerFor(text);
    setTimeout(() => pushBot(reply.text, reply.actions), 350);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="flex h-[32rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-brand to-brand-deep px-5 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-full bg-white/15">
                  <Sparkles className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-bold leading-tight">{brandName} Assistant</p>
                  <p className="text-xs text-white/80">Usually replies instantly</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                className="grid size-8 shrink-0 place-items-center rounded-full text-white/90 transition hover:bg-white/15"
              >
                <X className="size-4" />
              </button>
            </div>

            {stage === "identity" ? (
              <div className="flex-1 overflow-y-auto bg-mist px-5 py-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <User className="size-5" />
                </span>
                <h4 className="mt-3 text-base font-bold text-ink">Let's get started</h4>
                <p className="mt-1 text-sm text-slate-500">
                  Share your name and email so we can verify you before chatting.
                </p>
                <form onSubmit={submitIdentity} className="mt-4 space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={visitorName}
                    onChange={(event) => setVisitorName(event.target.value)}
                    className="input"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your email"
                    value={visitorEmail}
                    onChange={(event) => setVisitorEmail(event.target.value)}
                    className="input"
                  />
                  {otpError ? <p className="text-sm text-rose-600">{otpError}</p> : null}
                  <button type="submit" disabled={otpBusy} className="btn-primary w-full disabled:opacity-60">
                    {otpBusy ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Sending code…
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </form>
              </div>
            ) : stage === "otp" ? (
              <div className="flex-1 overflow-y-auto bg-mist px-5 py-6">
                <span className="grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <ShieldCheck className="size-5" />
                </span>
                <h4 className="mt-3 text-base font-bold text-ink">Verify your email</h4>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the 6-digit code we sent to <span className="font-semibold text-ink">{visitorEmail}</span>.
                </p>
                <form onSubmit={submitOtp} className="mt-4 space-y-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoFocus
                    maxLength={6}
                    value={otpCode}
                    onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, ""))}
                    placeholder="••••••"
                    className="input text-center text-2xl font-bold tracking-[0.5em]"
                  />
                  {otpError ? <p className="text-sm text-rose-600">{otpError}</p> : null}
                  <button
                    type="submit"
                    disabled={otpBusy || otpCode.trim().length !== 6}
                    className="btn-primary w-full disabled:opacity-60"
                  >
                    {otpBusy ? "Verifying…" : "Verify & Start Chat"}
                  </button>
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={resendCooldown > 0 || otpBusy}
                    className="w-full text-center text-xs font-semibold text-brand disabled:text-slate-400"
                  >
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage("identity")}
                    className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600"
                  >
                    Change email
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-mist px-4 py-4">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className="max-w-[85%]">
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                            m.sender === "user"
                              ? "rounded-br-sm bg-brand text-white"
                              : "rounded-bl-sm border border-slate-200/70 bg-white text-ink"
                          }`}
                        >
                          {m.text}
                        </div>
                        {m.actions?.length ? (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {m.actions.map((action) => (
                              <button
                                key={action.label}
                                type="button"
                                onClick={() => handleQuickAction(action)}
                                className="rounded-full border border-brand/25 bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 bg-white p-3">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    <QuickChip icon={Briefcase} label="Services" onClick={() => handleQuickAction({ label: "Our Services", topic: "services" })} />
                    <QuickChip icon={GraduationCap} label="Training" onClick={() => handleQuickAction({ label: "Training Programs", topic: "training" })} />
                    <QuickChip icon={Calendar} label="Events" onClick={() => handleQuickAction({ label: "Events", topic: "events" })} />
                    {contact?.phone ? (
                      <QuickChip icon={Phone} label="Call" onClick={() => window.open(`tel:${contact.phone.replace(/\s/g, "")}`)} />
                    ) : null}
                    {contact?.email ? (
                      <QuickChip icon={Mail} label="Email" onClick={() => window.open(`mailto:${contact.email}`)} />
                    ) : null}
                  </div>
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSend();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      placeholder="Type your question…"
                      className="input !py-2.5"
                    />
                    <button
                      type="submit"
                      aria-label="Send message"
                      disabled={!input.trim()}
                      className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand text-white transition hover:bg-brand-dark disabled:opacity-40"
                    >
                      <Send className="size-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-white shadow-glow"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "chat"}
            initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

function QuickChip({
  icon: IconCmp,
  label,
  onClick
}: {
  icon: typeof Briefcase;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-brand/30 hover:bg-brand-soft hover:text-brand"
    >
      <IconCmp className="size-3.5" />
      {label}
    </button>
  );
}
