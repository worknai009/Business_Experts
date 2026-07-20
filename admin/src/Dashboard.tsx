import {
  Bell,
  Calendar,
  FileText,
  FolderKanban,
  Mail,
  MessageSquareQuote,
  TrendingUp,
  Users,
  UsersRound
} from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "./api";

type Stats = {
  counts: {
    members: number;
    investors: number;
    projects: number;
    events: number;
    services: number;
    blogs: number;
    testimonials: number;
    subscribers: number;
    newMessages: number;
  };
  recentMessages: {
    _id: string;
    name: string;
    email?: string;
    subject?: string;
    message?: string;
    type: string;
    membershipType?: string;
    status: string;
    createdAt: string;
  }[];
  monthly: { label: string; contact: number; membership: number }[];
};

const SERIES = [
  { key: "contact" as const, label: "Contact inquiries", color: "var(--color-chart-1)" },
  { key: "membership" as const, label: "Membership applications", color: "var(--color-chart-2)" }
];

/** Grouped bar chart: monthly inquiries by type. Palette validated for CVD safety. */
function MonthlyChart({ monthly }: { monthly: Stats["monthly"] }) {
  const [hover, setHover] = useState<{ month: number; series: number } | null>(null);
  const width = 560;
  const height = 220;
  const pad = { top: 14, right: 8, bottom: 26, left: 30 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const max = Math.max(4, ...monthly.flatMap((month) => [month.contact, month.membership]));
  const ticks = [0, Math.ceil(max / 2), max];
  const groupW = plotW / monthly.length;
  const barW = Math.min(22, groupW / 3);

  return (
    <div>
      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        {SERIES.map((series) => (
          <span key={series.key} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ background: series.color }} /> {series.label}
          </span>
        ))}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 w-full" role="img" aria-label="Monthly inquiries by type">
        {ticks.map((tick) => {
          const y = pad.top + plotH - (tick / max) * plotH;
          return (
            <g key={tick}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#E2E8F0" strokeWidth="1" />
              <text x={pad.left - 8} y={y + 3.5} textAnchor="end" fontSize="10" fill="#94A3B8">
                {tick}
              </text>
            </g>
          );
        })}
        {monthly.map((month, monthIndex) => {
          const groupX = pad.left + monthIndex * groupW + groupW / 2;
          return (
            <g key={month.label}>
              {SERIES.map((series, seriesIndex) => {
                const value = month[series.key];
                const barH = (value / max) * plotH;
                const x = groupX + (seriesIndex - 1) * barW + (seriesIndex - 0.5) * 2;
                const y = pad.top + plotH - barH;
                const active = hover?.month === monthIndex && hover?.series === seriesIndex;
                return (
                  <g key={series.key}>
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={Math.max(barH, value ? 2 : 0)}
                      rx="3"
                      fill={series.color}
                      opacity={hover && !active ? 0.45 : 1}
                    />
                    {active ? (
                      <g>
                        <rect x={x + barW / 2 - 34} y={Math.max(2, y - 26)} width="68" height="20" rx="6" fill="#0B1220" />
                        <text x={x + barW / 2} y={Math.max(2, y - 26) + 13.5} textAnchor="middle" fontSize="10" fill="#fff">
                          {value} in {month.label}
                        </text>
                      </g>
                    ) : null}
                    <rect
                      x={x - 3}
                      y={pad.top}
                      width={barW + 6}
                      height={plotH}
                      fill="transparent"
                      onMouseEnter={() => setHover({ month: monthIndex, series: seriesIndex })}
                      onMouseLeave={() => setHover(null)}
                    />
                  </g>
                );
              })}
              <text x={groupX} y={height - 8} textAnchor="middle" fontSize="10" fill="#64748B">
                {month.label}
              </text>
            </g>
          );
        })}
        <line
          x1={pad.left}
          x2={width - pad.right}
          y1={pad.top + plotH}
          y2={pad.top + plotH}
          stroke="#CBD5E1"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-brand-soft text-brand",
  contacted: "bg-amber-50 text-amber-600",
  closed: "bg-slate-100 text-slate-500"
};

export default function Dashboard({ onNavigate }: { onNavigate: (key: string) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get<Stats>("/admin/stats").then(setStats).catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="grid h-64 place-items-center">
        <div className="size-8 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
      </div>
    );
  }

  const tiles = [
    { label: "Total Members", value: stats.counts.members, icon: Users, hint: "membership applications" },
    { label: "Total Investors", value: stats.counts.investors, icon: TrendingUp, hint: "investor applications" },
    { label: "Projects", value: stats.counts.projects, icon: FolderKanban },
    { label: "Events", value: stats.counts.events, icon: Calendar },
    { label: "Blog Posts", value: stats.counts.blogs, icon: FileText },
    { label: "Testimonials", value: stats.counts.testimonials, icon: MessageSquareQuote },
    { label: "Subscribers", value: stats.counts.subscribers, icon: Mail }
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500">Everything happening across your platform.</p>
        </div>
        {stats.counts.newMessages ? (
          <button
            type="button"
            onClick={() => onNavigate("messages")}
            className="btn-secondary !border-brand/30 !text-brand"
          >
            <Bell className="size-4" /> {stats.counts.newMessages} new message{stats.counts.newMessages === 1 ? "" : "s"}
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{tile.label}</span>
              <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand">
                <tile.icon className="size-4.5" />
              </span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-ink">{tile.value}</p>
            {tile.hint ? <p className="mt-0.5 text-xs text-slate-400">{tile.hint}</p> : null}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <div className="card p-6 xl:col-span-3">
          <h2 className="text-base font-bold">Inquiries — last 6 months</h2>
          <div className="mt-4">
            <MonthlyChart monthly={stats.monthly} />
          </div>
        </div>

        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Recent activity</h2>
            <button type="button" className="text-xs font-semibold text-brand" onClick={() => onNavigate("messages")}>
              View all
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {stats.recentMessages.slice(0, 6).map((message) => (
              <div key={message._id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                  {message.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{message.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {message.type === "membership"
                      ? `Applied: ${message.membershipType || "Membership"}`
                      : message.subject || message.message || "Contact inquiry"}
                  </p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_COLORS[message.status] || STATUS_COLORS.new}`}>
                  {message.status}
                </span>
              </div>
            ))}
            {!stats.recentMessages.length ? (
              <p className="py-8 text-center text-sm text-slate-400">No inquiries yet.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
