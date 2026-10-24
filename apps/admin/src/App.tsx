import {
  Activity,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Box,
  Brain,
  Building2,
  Calendar,
  Cpu,
  CreditCard,
  Database,
  ExternalLink,
  FileCheck,
  FileText,
  FolderKanban,
  Globe,
  GraduationCap,
  Handshake,
  HelpCircle,
  Image,
  Inbox,
  IndianRupee,
  Landmark,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  MessageSquareQuote,
  Package,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Sparkles,
  Swords,
  Target,
  Ticket,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap
} from "lucide-react";
import { useState } from "react";
import { getToken, setToken } from "./api";
import BusinessAiManager from "./BusinessAiManager";
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
  successStories: Award,
  gallery: Image,
  blogs: FileText,
  faqs: HelpCircle,
  team: Users,
  partners: Handshake
};

// Two Complete Sections: Business Experts & BusinessAI
const NAV = [
  // ── SECTION 1: BUSINESS EXPERTS ──
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "Business Experts", group: "Overview" },
  { key: "be_settings", label: "Website Settings", icon: Settings, section: "Business Experts", group: "Overview" },
  ...RESOURCES.map((resource) => ({
    key: `be_${resource.key}`,
    resourceKey: resource.key,
    label: resource.plural,
    icon: RESOURCE_ICONS[resource.key] || Box,
    section: "Business Experts",
    group: "Content"
  })),
  { key: "messages", label: "Inquiries & Messages", icon: Inbox, section: "Business Experts", group: "Inbox" },
  { key: "subscribers", label: "Newsletter Subscribers", icon: Mail, section: "Business Experts", group: "Inbox" },

  // ── SECTION 2: BUSINESS AI (FULL CONTROL - ALL 26 MODULES) ──
  // 1. Command Center
  { key: "overview", label: "Overview", icon: LayoutDashboard, section: "BusinessAI (Full Control)", group: "Command Center" },
  { key: "notifications", label: "Notifications", icon: Bell, section: "BusinessAI (Full Control)", group: "Command Center" },
  { key: "activity", label: "Activity Feed", icon: Activity, section: "BusinessAI (Full Control)", group: "Command Center" },

  // 2. Users & Access
  { key: "users", label: "Users & Accounts", icon: Users, section: "BusinessAI (Full Control)", group: "Users & Access" },
  { key: "roles", label: "Roles & RBAC", icon: Shield, section: "BusinessAI (Full Control)", group: "Users & Access" },
  { key: "permissions", label: "Permissions", icon: Lock, section: "BusinessAI (Full Control)", group: "Users & Access" },

  // 3. Business Intelligence
  { key: "businesses", label: "Businesses (108+)", icon: Building2, section: "BusinessAI (Full Control)", group: "Business Intelligence" },
  { key: "industries", label: "Industries", icon: Package, section: "BusinessAI (Full Control)", group: "Business Intelligence" },
  { key: "cities", label: "Cities & Regions", icon: Globe, section: "BusinessAI (Full Control)", group: "Business Intelligence" },
  { key: "market-data", label: "Market Data", icon: TrendingUp, section: "BusinessAI (Full Control)", group: "Business Intelligence" },
  { key: "competitors", label: "Competitors", icon: Swords, section: "BusinessAI (Full Control)", group: "Business Intelligence" },
  { key: "govt-schemes", label: "Govt. Schemes", icon: Landmark, section: "BusinessAI (Full Control)", group: "Business Intelligence" },

  // 4. AI & Reports
  { key: "ai-prompts", label: "AI Prompts", icon: Brain, section: "BusinessAI (Full Control)", group: "AI & Reports" },
  { key: "ai-reports", label: "Generated Reports", icon: FileText, section: "BusinessAI (Full Control)", group: "AI & Reports" },
  { key: "ai-performance", label: "AI Performance", icon: Cpu, section: "BusinessAI (Full Control)", group: "AI & Reports" },

  // 5. Content & CMS
  { key: "landing-page", label: "Landing Page Manager", icon: Globe, section: "BusinessAI (Full Control)", group: "Content & CMS" },
  { key: "ai_blogs", label: "Blogs & CMS", icon: BookOpen, section: "BusinessAI (Full Control)", group: "Content & CMS" },
  { key: "ai_courses", label: "Courses & Hub", icon: Layers, section: "BusinessAI (Full Control)", group: "Content & CMS" },
  { key: "ai_testimonials", label: "Testimonials", icon: MessageSquare, section: "BusinessAI (Full Control)", group: "Content & CMS" },
  { key: "ai_faq", label: "FAQ & Support", icon: HelpCircle, section: "BusinessAI (Full Control)", group: "Content & CMS" },

  // 6. Billing & Revenue
  { key: "payments", label: "Payments", icon: CreditCard, section: "BusinessAI (Full Control)", group: "Billing & Revenue" },
  { key: "subscriptions", label: "Subscriptions", icon: ShoppingCart, section: "BusinessAI (Full Control)", group: "Billing & Revenue" },
  { key: "coupons", label: "Coupons", icon: Ticket, section: "BusinessAI (Full Control)", group: "Billing & Revenue" },

  // 7. Analytics
  { key: "user-analytics", label: "User Analytics", icon: BarChart3, section: "BusinessAI (Full Control)", group: "Analytics" },
  { key: "search-analytics", label: "Search Analytics", icon: Search, section: "BusinessAI (Full Control)", group: "Analytics" },
  { key: "conversion", label: "Conversion Funnel", icon: Target, section: "BusinessAI (Full Control)", group: "Analytics" },
  { key: "revenue-analytics", label: "Revenue Analytics", icon: IndianRupee, section: "BusinessAI (Full Control)", group: "Analytics" },

  // 8. System & Logs
  { key: "audit-logs", label: "Audit Logs", icon: Shield, section: "BusinessAI (Full Control)", group: "System & Logs" },
  { key: "ai_settings", label: "System Settings", icon: Settings, section: "BusinessAI (Full Control)", group: "System & Logs" }
];

export default function App() {
  const [authed, setAuthed] = useState(Boolean(getToken()));
  const [active, setActive] = useState("dashboard");
  const [currentSection, setCurrentSection] = useState("Business Experts");
  const [menuOpen, setMenuOpen] = useState(false);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  const activeItem = NAV.find((item) => item.key === active);
  const resourceKey = active.startsWith("be_") ? active.replace("be_", "") : active;
  const resource = RESOURCES.find((item) => item.key === resourceKey);
  const activeLabel = activeItem?.label || "Dashboard";

  function navigate(key: string, sec?: string) {
    setActive(key);
    if (sec) setCurrentSection(sec);
    setMenuOpen(false);
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/10">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-dark font-display text-lg font-bold text-white shadow-sm">
          B
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold text-white">Unified Admin Console</p>
          <p className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase">Business Ecosystem</p>
        </div>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="grid grid-cols-2 gap-1 p-2 bg-white/5 border-b border-white/10">
        <button
          type="button"
          onClick={() => {
            setCurrentSection("Business Experts");
            setActive("dashboard");
          }}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
            currentSection === "Business Experts"
              ? "bg-brand text-white shadow-sm"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Building2 className="size-3.5" /> Experts
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentSection("BusinessAI (Full Control)");
            setActive("overview");
          }}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${
            currentSection === "BusinessAI (Full Control)"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Zap className="size-3.5" /> BusinessAI
        </button>
      </div>

      {/* Navigation Items for Active Section */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {Array.from(new Set(NAV.filter((item) => item.section === currentSection).map((item) => item.group))).map((group) => (
          <div key={group} className="mt-3.5">
            <p className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">{group}</p>
            {NAV.filter((item) => item.section === currentSection && item.group === group).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.key, item.section)}
                className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition ${
                  active === item.key
                    ? currentSection.includes("AI")
                      ? "bg-emerald-600 text-white font-bold"
                      : "bg-brand text-white font-bold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="size-3.5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer Links */}
      <div className="border-t border-white/10 p-3 space-y-0.5">
        <a
          href={currentSection.includes("AI")
            ? (import.meta.env.DEV ? "http://localhost:5173" : "https://analytics.businessexperts.asia")
            : (import.meta.env.DEV ? "http://localhost:5180" : "https://businessexperts.asia")}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-3.5" /> View {currentSection.includes("AI") ? "BusinessAI" : "Business Experts"}
        </a>
        <button
          type="button"
          onClick={() => {
            setToken(null);
            setAuthed(false);
          }}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-rose-300"
        >
          <LogOut className="size-3.5" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-ink lg:block">{sidebar}</aside>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
          <aside className="absolute inset-y-0 left-0 w-64 bg-ink" onClick={(event) => event.stopPropagation()}>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Header Bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:px-8">
          <button type="button" className="icon-btn lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu className="size-4" />
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                currentSection.includes("AI") ? "bg-emerald-100 text-emerald-800" : "bg-brand-soft text-brand"
              }`}
            >
              {currentSection.includes("AI") ? "⚡ BusinessAI" : "🏢 Business Experts"}
            </span>
            <span className="text-sm font-semibold text-ink">&bull; {activeLabel}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">Changes publish instantly</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Business Experts Views */}
          {active === "dashboard" ? <Dashboard onNavigate={(k) => navigate(k, "Business Experts")} /> : null}
          {active === "be_settings" ? <SettingsEditor /> : null}
          {active.startsWith("be_") && resource ? <ResourceManager config={resource} /> : null}
          {active === "messages" ? <Messages /> : null}
          {active === "subscribers" ? <Subscribers /> : null}

          {/* BusinessAI Views (All 26 Modules) */}
          {currentSection === "BusinessAI (Full Control)" ? (
            <BusinessAiManager activeView={active} onNavigate={(k) => navigate(k, "BusinessAI (Full Control)")} />
          ) : null}
        </main>
      </div>
    </div>
  );
}
