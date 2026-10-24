import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  User,
  X
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { apiGet, apiPost, type HomeData } from "../api";
import { useSite } from "../context/SiteContext";

type Sender = "bot" | "user";

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
  isCallbackForm?: boolean;
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

  // Callback form state
  const [callbackName, setCallbackName] = useState("");
  const [callbackContact, setCallbackContact] = useState("");
  const [callbackSent, setCallbackSent] = useState(false);
  const [callbackBusy, setCallbackBusy] = useState(false);

  const brandName = settings?.brand?.name || "Business Experts";
  const contact = settings?.contact;

  useEffect(() => {
    apiGet<HomeData>("/home")
      .then(setData)
      .catch(() => {});
  }, []);

  // Initialize with instant greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: nextId(),
          sender: "bot",
          text: `Hi there! 👋 Welcome to ${brandName}. How can our team help your business grow today?`,
          actions: mainMenu()
        }
      ]);
    }
  }, [brandName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function mainMenu(): QuickAction[] {
    return [
      { label: "Our Services", topic: "services" },
      { label: "Training Programs", topic: "training" },
      { label: "Our Projects", topic: "projects" },
      { label: "Talk to an Expert", topic: "expert" }
    ];
  }

  function pushBot(text: string, actions?: QuickAction[], isCallbackForm?: boolean) {
    setMessages((prev) => [...prev, { id: nextId(), sender: "bot", text, actions, isCallbackForm }]);
  }

  function handleQuickAction(action: QuickAction) {
    setMessages((prev) => [...prev, { id: nextId(), sender: "user", text: action.label }]);
    if (action.topic) {
      setTimeout(() => {
        const reply = answerFor(action.topic!);
        pushBot(reply.text, reply.actions, reply.isCallbackForm);
      }, 300);
    } else {
      action.action?.();
    }
  }

  function answerFor(raw: string): { text: string; actions?: QuickAction[]; isCallbackForm?: boolean } {
    const q = raw.toLowerCase();

    if (/\b(hi|hello|hey|namaste)\b/.test(q)) {
      return { text: `Hello! How can I help you today?`, actions: mainMenu() };
    }

    if (/\b(expert|advisor|talk|consultant|callback|call back|contact)\b/.test(q)) {
      return {
        text: `We would love to connect you directly with one of our business advisors! Leave your contact details below, and our team will get back to you shortly:`,
        isCallbackForm: true,
        actions: mainMenu()
      };
    }

    const matchedService = (data?.services || []).find((s) => q.includes(s.title.toLowerCase()));
    if (matchedService) {
      return {
        text: `${matchedService.title}: ${matchedService.description || "One of our core services."}`,
        actions: [{ label: "Inquire about this service", topic: "expert" }, ...mainMenu()]
      };
    }

    const matchedCourse = (data?.courses || []).find((c) => q.includes(c.title.toLowerCase()));
    if (matchedCourse) {
      return {
        text: `${matchedCourse.title}: ${matchedCourse.shortDescription || matchedCourse.description || "One of our flagship training programs."}${
          matchedCourse.priceLabel ? ` Pricing: ${matchedCourse.priceLabel}.` : ""
        }`,
        actions: [{ label: "Enroll / Inquire", topic: "expert" }, ...mainMenu()]
      };
    }

    const matchedProject = (data?.projects || []).find((p) => q.includes(p.title.toLowerCase()));
    if (matchedProject) {
      return {
        text: `${matchedProject.title}: ${matchedProject.shortDescription || "One of our delivered portfolio projects."}`,
        actions: mainMenu()
      };
    }

    if (/\bservices?\b/.test(q)) {
      const names = (data?.services || []).slice(0, 8).map((s) => s.title);
      const list = names.length
        ? ` We offer: ${names.join(", ")}.`
        : " Our team offers a range of business consulting and growth services.";
      return { text: `Here's what we offer.${list}`, actions: mainMenu() };
    }

    if (/\b(training|trainings|course|courses|program|programs|workshop|workshops)\b/.test(q)) {
      const names = (data?.courses || []).slice(0, 8).map((c) => c.title);
      const list = names.length
        ? ` Popular programs: ${names.join(", ")}.`
        : " Our team runs executive mentorship and professional training tracks.";
      return { text: `We run several training programs to accelerate your career or team.${list}`, actions: mainMenu() };
    }

    if (/\b(project|projects|portfolio)\b/.test(q)) {
      const names = (data?.projects || []).slice(0, 6).map((p) => p.title);
      const list = names.length ? ` Some of our portfolio work: ${names.join(", ")}.` : "";
      return { text: `We've delivered high-impact projects across multiple industries.${list}`, actions: mainMenu() };
    }

    if (/price|pricing|cost|fee|charge/.test(q)) {
      return {
        text: `Pricing varies by specific business scope and program tier. You can speak directly with our team for a tailored quote.${
          contact?.phone ? ` Call us at ${contact.phone}.` : ""
        }${contact?.email ? ` Or email ${contact.email}.` : ""}`,
        isCallbackForm: true,
        actions: mainMenu()
      };
    }

    if (/member/.test(q)) {
      const names = (data?.memberships || []).slice(0, 5).map((m) => m.name);
      const list = names.length ? ` Plans include: ${names.join(", ")}.` : "";
      return {
        text: `Our memberships give you ongoing access to the ${brandName} ecosystem — summits, investor networks, and resources.${list}`,
        actions: mainMenu()
      };
    }

    if (/event|summit|meetup/.test(q)) {
      const names = (data?.events || []).slice(0, 5).map((e) => e.title);
      const list = names.length ? ` Upcoming: ${names.join(", ")}.` : "";
      return { text: `We regularly host executive summits, pitch days and founder workshops.${list}`, actions: mainMenu() };
    }

    return {
      text: `Thanks for asking! Our advisors can give you detailed insights on this. Would you like to speak to an expert or browse our services?`,
      actions: [{ label: "Talk to an Expert", topic: "expert" }, ...mainMenu()]
    };
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: nextId(), sender: "user", text }]);
    setInput("");
    setTimeout(() => {
      const reply = answerFor(text);
      pushBot(reply.text, reply.actions, reply.isCallbackForm);
    }, 350);
  }

  async function handleCallbackSubmit(e: FormEvent) {
    e.preventDefault();
    if (!callbackContact.trim()) return;
    setCallbackBusy(true);
    try {
      await apiPost("/inquiries", {
        name: callbackName.trim() || "Website Visitor",
        email: callbackContact.includes("@") ? callbackContact.trim() : `${callbackContact.trim()}@callback.phone`,
        phone: callbackContact.includes("@") ? "" : callbackContact.trim(),
        message: "Callback request from Instant Chat Widget",
        type: "expert_callback"
      }).catch(() => {});
      setCallbackSent(true);
      pushBot(`Thank you, ${callbackName || "friend"}! Your request has been logged. An expert advisor will reach out to you at ${callbackContact} shortly.`);
    } finally {
      setCallbackBusy(false);
    }
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex h-[520px] w-[calc(100vw-32px)] sm:w-[380px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-brand to-brand-deep px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="grid size-9 place-items-center rounded-xl bg-white/20 backdrop-blur-sm text-white">
                    <Sparkles className="size-4" />
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">{brandName} Assistant</h3>
                  <p className="text-[11px] text-white/80">Instant Help • Online</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close chat"
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-lg text-white/80 hover:bg-white/15 hover:text-white transition"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto bg-slate-50 dark:bg-slate-950/60 p-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[85%]">
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                        m.sender === "user"
                          ? "rounded-br-sm bg-brand text-white font-medium"
                          : "rounded-bl-sm border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {m.text}

                      {/* Optional Inline Callback Form */}
                      {m.isCallbackForm && !callbackSent && (
                        <form onSubmit={handleCallbackSubmit} className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                          <input
                            type="text"
                            placeholder="Your Name (Optional)"
                            value={callbackName}
                            onChange={(e) => setCallbackName(e.target.value)}
                            className="input !py-1.5 !text-xs !rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Your Phone or Email *"
                            value={callbackContact}
                            onChange={(e) => setCallbackContact(e.target.value)}
                            className="input !py-1.5 !text-xs !rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                          />
                          <button
                            type="submit"
                            disabled={callbackBusy}
                            className="btn-primary !py-1.5 !text-xs !rounded-lg w-full flex items-center justify-center gap-1.5 font-bold"
                          >
                            {callbackBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Phone className="size-3.5" />}
                            <span>Request Expert Callback</span>
                          </button>
                        </form>
                      )}

                      {m.isCallbackForm && callbackSent && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="size-3.5" /> Callback Request Submitted
                        </div>
                      )}
                    </div>

                    {m.actions?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.actions.map((action) => (
                          <button
                            key={action.label}
                            type="button"
                            onClick={() => handleQuickAction(action)}
                            className="rounded-full border border-brand/20 dark:border-brand/40 bg-brand-soft/70 dark:bg-emerald-950/30 px-3 py-1 text-xs font-semibold text-brand dark:text-emerald-300 transition hover:bg-brand hover:text-white"
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

            {/* Quick Chips & Input Footer */}
            <div className="border-t border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <div className="mb-2 flex flex-wrap gap-1">
                <QuickChip icon={Briefcase} label="Services" onClick={() => handleQuickAction({ label: "Our Services", topic: "services" })} />
                <QuickChip icon={GraduationCap} label="Programs" onClick={() => handleQuickAction({ label: "Training Programs", topic: "training" })} />
                <QuickChip icon={Calendar} label="Events" onClick={() => handleQuickAction({ label: "Events", topic: "events" })} />
                <QuickChip icon={Phone} label="Advisor" onClick={() => handleQuickAction({ label: "Talk to an Expert", topic: "expert" })} />
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
                  placeholder="Ask any question about our ecosystem…"
                  className="input !py-2.5 !text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-white"
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
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-white shadow-glow"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="size-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="size-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

function QuickChip({
  icon: Icon,
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
      className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition hover:border-brand hover:bg-brand-soft hover:text-brand dark:hover:bg-slate-700"
    >
      <Icon className="size-3 text-brand" />
      {label}
    </button>
  );
}
