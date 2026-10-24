import { Mail, Phone, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "./api";

type Message = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  type: "contact" | "membership";
  membershipType?: string;
  company?: string;
  status: "new" | "contacted" | "closed";
  adminNote?: string;
  createdAt: string;
};

const STATUS_OPTIONS: Message["status"][] = ["new", "contacted", "closed"];
const STATUS_COLORS: Record<string, string> = {
  new: "bg-brand-soft text-brand",
  contacted: "bg-amber-50 text-amber-600",
  closed: "bg-slate-100 text-slate-500"
};
const INQUIRY_ROLES = ["Investor", "Partner", "Other"];

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<"all" | "contact" | "membership">("all");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      setMessages(await api.get<Message[]>("/admin/messages"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function setStatus(message: Message, status: Message["status"]) {
    await api.patch(`/admin/messages/${message._id}`, { status });
    setMessages((current) => current.map((item) => (item._id === message._id ? { ...item, status } : item)));
  }

  async function saveNote(message: Message, adminNote: string) {
    await api.patch(`/admin/messages/${message._id}`, { adminNote });
  }

  async function remove(message: Message) {
    if (!window.confirm(`Delete the message from "${message.name}"?`)) return;
    await api.delete(`/admin/messages/${message._id}`);
    await refresh();
  }

  const visible = filter === "all" ? messages : messages.filter((message) => message.type === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Messages & Applications</h1>
          <p className="text-sm text-slate-500">Contact inquiries and membership applications from the website.</p>
        </div>
        <div className="flex gap-1.5">
          {(["all", "contact", "membership"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium capitalize transition ${
                filter === option ? "bg-brand text-white" : "bg-white text-slate-600 hover:text-brand"
              }`}
            >
              {option === "all" ? "All" : option === "contact" ? "Contact" : "Memberships"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid h-40 place-items-center">
          <div className="size-8 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((message) => (
            <div key={message._id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold">{message.name}</h2>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLORS[message.status]}`}>
                      {message.status}
                    </span>
                    {message.type === "membership" ? (
                      <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-600">
                        {message.membershipType || "Membership"}
                      </span>
                    ) : null}
                    {message.company && INQUIRY_ROLES.includes(message.company) ? (
                      <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-600">
                        {message.company} Inquiry
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {message.email ? (
                      <a href={`mailto:${message.email}`} className="inline-flex items-center gap-1 hover:text-brand">
                        <Mail className="size-3.5" /> {message.email}
                      </a>
                    ) : null}
                    {message.phone ? (
                      <a href={`tel:${message.phone}`} className="inline-flex items-center gap-1 hover:text-brand">
                        <Phone className="size-3.5" /> {message.phone}
                      </a>
                    ) : null}
                    {message.company && !INQUIRY_ROLES.includes(message.company) ? <span>{message.company}</span> : null}
                    <span>{new Date(message.createdAt).toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="input !w-auto !py-1.5 text-xs"
                    value={message.status}
                    onChange={(event) => setStatus(message, event.target.value as Message["status"])}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="icon-btn hover:!border-rose-300 hover:!text-rose-600"
                    onClick={() => remove(message)}
                    aria-label="Delete message"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              {message.subject ? <p className="mt-3 text-sm font-semibold text-ink">{message.subject}</p> : null}
              {message.message ? <p className="mt-1 text-sm leading-relaxed">{message.message}</p> : null}
              <input
                className="input mt-3 !py-2 text-xs"
                placeholder="Internal note (saved on blur)"
                defaultValue={message.adminNote || ""}
                onBlur={(event) => saveNote(message, event.target.value)}
              />
            </div>
          ))}
          {!visible.length ? (
            <p className="card p-10 text-center text-sm text-slate-400">No messages yet.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
