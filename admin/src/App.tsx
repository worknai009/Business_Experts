import {
  Box,
  Calendar,
  CreditCard,
  ExternalLink,
  FileText,
  FolderKanban,
  GraduationCap,
  Handshake,
  HelpCircle,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  Settings,
  Sparkles,
  Users,
  X
} from "lucide-react";
import { useState } from "react";
import { getToken, setToken } from "./api";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Messages from "./Messages";
import ResourceManager from "./ResourceManager";
import { RESOURCES } from "./resources";
import SettingsEditor from "./SettingsEditor";
import Subscribers from "./Subscribers";

const RESOURCE_ICONS: Record<string, typeof Box> = {
  services: Sparkles,
  projects: FolderKanban,
  courses: GraduationCap,
  events: Calendar,
  memberships: CreditCard,
  testimonials: MessageSquareQuote,
  gallery: Image,
  blogs: FileText,
  faqs: HelpCircle,
  team: Users,
  partners: Handshake
};

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { key: "settings", label: "Website Settings", icon: Settings, group: "Overview" },
  ...RESOURCES.map((resource) => ({
    key: resource.key,
    label: resource.plural,
    icon: RESOURCE_ICONS[resource.key] || Box,
    group: "Content"
  })),
  { key: "messages", label: "Messages", icon: Inbox, group: "Inbox" },
  { key: "subscribers", label: "Subscribers", icon: Mail, group: "Inbox" }
];

const GROUPS = ["Overview", "Content", "Inbox"];

export default function App() {
  const [authed, setAuthed] = useState(Boolean(getToken()));
  const [active, setActive] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  const resource = RESOURCES.find((item) => item.key === active);
  const activeLabel = NAV.find((item) => item.key === active)?.label || "";

  function navigate(key: string) {
    setActive(key);
    setMenuOpen(false);
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-dark font-display text-lg font-bold text-white">
          B
        </span>
        <div>
          <p className="font-display text-sm font-bold text-white">Business Experts</p>
          <p className="text-[11px] text-slate-400">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {GROUPS.map((group) => (
          <div key={group} className="mt-4">
            <p className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">{group}</p>
            {NAV.filter((item) => item.group === group).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.key)}
                className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition ${
                  active === item.key ? "bg-brand text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="size-4 shrink-0" /> {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-4" /> View Website
        </a>
        <button
          type="button"
          onClick={() => {
            setToken(null);
            setAuthed(false);
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-rose-300"
        >
          <LogOut className="size-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 bg-ink lg:block">{sidebar}</aside>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
          <aside className="absolute inset-y-0 left-0 w-64 bg-ink" onClick={(event) => event.stopPropagation()}>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-8">
          <button type="button" className="icon-btn lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu className="size-4" />
          </button>
          <span className="text-sm font-semibold text-ink">{activeLabel}</span>
          <span className="ml-auto text-xs text-slate-400">Changes publish instantly</span>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {active === "dashboard" ? <Dashboard onNavigate={navigate} /> : null}
          {active === "settings" ? <SettingsEditor /> : null}
          {resource ? <ResourceManager config={resource} /> : null}
          {active === "messages" ? <Messages /> : null}
          {active === "subscribers" ? <Subscribers /> : null}
        </main>
      </div>
    </div>
  );
}
