import { Edit3, Image, Inbox, LayoutDashboard, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";

type Tab = "content" | "sessions" | "inquiries";

type SiteContent = {
  programImages: Record<string, string>;
  programBrand: Record<string, string | string[]>;
  programConcept: Record<string, string>;
  admissionsCta: Record<string, string>;
  heroStats: Array<{ value: string; label: string }>;
};

type ProgramSession = {
  _id?: string;
  title: string;
  duration: string;
  suitableFor: string;
  schedule?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
};

type Inquiry = {
  _id: string;
  parentName: string;
  phone: string;
  email?: string;
  childName: string;
  childAge?: number;
  program: string;
  message?: string;
  status?: "new" | "contacted" | "closed";
  adminNote?: string;
  createdAt?: string;
};

const blankSession: ProgramSession = {
  title: "",
  duration: "",
  suitableFor: "",
  schedule: "",
  description: "",
  image: "",
  isActive: true,
  sortOrder: 0
};

function App() {
  const [tab, setTab] = useState<Tab>("content");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [sessions, setSessions] = useState<ProgramSession[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [editingSession, setEditingSession] = useState<ProgramSession>(blankSession);
  const [message, setMessage] = useState("");

  const stats = useMemo(
    () => ({
      inquiries: inquiries.length,
      newInquiries: inquiries.filter((item) => item.status === "new" || !item.status).length,
      sessions: sessions.length
    }),
    [inquiries, sessions]
  );

  useEffect(() => {
    refreshAll();
  }, []);

  async function refreshAll() {
    const [contentResponse, sessionResponse, inquiryResponse] = await Promise.all([
      fetch("/api/site-content"),
      fetch("/api/admin/program-sessions"),
      fetch("/api/inquiries")
    ]);
    setContent(await contentResponse.json());
    setSessions(await sessionResponse.json());
    setInquiries(await inquiryResponse.json());
  }

  function updateContent(section: keyof SiteContent, key: string, value: string) {
    setContent((current) => {
      if (!current) {
        return current;
      }
      return {
        ...current,
        [section]: {
          ...(current[section] as Record<string, unknown>),
          [key]: section === "programBrand" && key === "focusChips" ? value.split(",").map((item) => item.trim()) : value
        }
      };
    });
  }

  async function saveContent() {
    if (!content) {
      return;
    }
    const response = await fetch("/api/admin/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content)
    });
    setContent(await response.json());
    showMessage("Frontend content saved.");
  }

  function updateSession(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = event.target;
    const checked = "checked" in event.target ? event.target.checked : undefined;
    setEditingSession((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : name === "sortOrder" ? Number(value) : value
    }));
  }

  async function saveSession(event: FormEvent) {
    event.preventDefault();
    const method = editingSession._id ? "PUT" : "POST";
    const url = editingSession._id
      ? `/api/admin/program-sessions/${editingSession._id}`
      : "/api/admin/program-sessions";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingSession)
    });
    if (!response.ok) {
      showMessage("Please fill title, duration and suitable for.");
      return;
    }
    setEditingSession(blankSession);
    await refreshAll();
    showMessage("Session saved.");
  }

  async function deleteSession(id?: string) {
    if (!id) {
      return;
    }
    await fetch(`/api/admin/program-sessions/${id}`, { method: "DELETE" });
    await refreshAll();
    showMessage("Session deleted.");
  }

  async function updateInquiry(inquiry: Inquiry, patch: Partial<Inquiry>) {
    await fetch(`/api/admin/inquiries/${inquiry._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch)
    });
    await refreshAll();
    showMessage("Inquiry updated.");
  }

  function showMessage(nextMessage: string) {
    setMessage(nextMessage);
    window.setTimeout(() => setMessage(""), 2600);
  }

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <LayoutDashboard />
          <div>
            <strong>Admin Panel</strong>
            <span>Business Experts</span>
          </div>
        </div>
        <button className={tab === "content" ? "active" : ""} onClick={() => setTab("content")}>
          <Image size={18} /> Frontend Data
        </button>
        <button className={tab === "sessions" ? "active" : ""} onClick={() => setTab("sessions")}>
          <Edit3 size={18} /> Program Sessions
        </button>
        <button className={tab === "inquiries" ? "active" : ""} onClick={() => setTab("inquiries")}>
          <Inbox size={18} /> Inquiries
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p>Control Center</p>
            <h1>{tab === "content" ? "Frontend Data & Images" : tab === "sessions" ? "Program Sessions" : "Inquiry Messages"}</h1>
          </div>
          {message && <span className="toast">{message}</span>}
        </header>

        <div className="metric-grid">
          <div>
            <span>Total Inquiries</span>
            <strong>{stats.inquiries}</strong>
          </div>
          <div>
            <span>New Messages</span>
            <strong>{stats.newInquiries}</strong>
          </div>
          <div>
            <span>Sessions</span>
            <strong>{stats.sessions}</strong>
          </div>
        </div>

        {tab === "content" && content && (
          <div className="panel">
            <div className="panel-head">
              <h2>Frontend Content</h2>
              <button className="primary" onClick={saveContent}>
                <Save size={17} /> Save
              </button>
            </div>
            <FieldGroup title="Images">
              {Object.entries(content.programImages).map(([key, value]) => (
                <label key={key}>
                  {key}
                  <input value={value} onChange={(event) => updateContent("programImages", key, event.target.value)} />
                </label>
              ))}
            </FieldGroup>
            <FieldGroup title="Brand">
              {Object.entries(content.programBrand).map(([key, value]) => (
                <label key={key}>
                  {key}
                  <input
                    value={Array.isArray(value) ? value.join(", ") : String(value)}
                    onChange={(event) => updateContent("programBrand", key, event.target.value)}
                  />
                </label>
              ))}
            </FieldGroup>
            <FieldGroup title="Admissions">
              {Object.entries(content.admissionsCta).map(([key, value]) => (
                <label key={key}>
                  {key}
                  <input value={String(value)} onChange={(event) => updateContent("admissionsCta", key, event.target.value)} />
                </label>
              ))}
            </FieldGroup>
            <FieldGroup title="Concept">
              {Object.entries(content.programConcept).map(([key, value]) => (
                <label key={key}>
                  {key}
                  <textarea value={value} onChange={(event) => updateContent("programConcept", key, event.target.value)} />
                </label>
              ))}
            </FieldGroup>
          </div>
        )}

        {tab === "sessions" && (
          <div className="two-column">
            <form className="panel session-form" onSubmit={saveSession}>
              <div className="panel-head">
                <h2>{editingSession._id ? "Edit Session" : "Add Session"}</h2>
                <button className="primary">
                  <Plus size={17} /> Save
                </button>
              </div>
              <label>
                Session Name
                <input name="title" required value={editingSession.title} onChange={updateSession} />
              </label>
              <label>
                Duration
                <input name="duration" required value={editingSession.duration} onChange={updateSession} />
              </label>
              <label>
                Suitable For
                <input name="suitableFor" required value={editingSession.suitableFor} onChange={updateSession} />
              </label>
              <label>
                Schedule
                <input name="schedule" value={editingSession.schedule || ""} onChange={updateSession} />
              </label>
              <label>
                Image URL
                <input name="image" value={editingSession.image || ""} onChange={updateSession} />
              </label>
              <label>
                Sort Order
                <input name="sortOrder" type="number" value={editingSession.sortOrder || 0} onChange={updateSession} />
              </label>
              <label>
                Description
                <textarea name="description" value={editingSession.description || ""} onChange={updateSession} />
              </label>
              <label className="check-row">
                <input
                  name="isActive"
                  type="checkbox"
                  checked={editingSession.isActive !== false}
                  onChange={updateSession}
                />
                Active on frontend
              </label>
            </form>

            <div className="panel">
              <div className="panel-head">
                <h2>All Sessions</h2>
              </div>
              <div className="list">
                {sessions.map((session) => (
                  <article key={session._id || session.title} className={!session.isActive ? "muted" : ""}>
                    <div>
                      <strong>{session.title}</strong>
                      <span>{session.duration} | {session.suitableFor}</span>
                    </div>
                    <button onClick={() => setEditingSession(session)}>
                      <Edit3 size={16} />
                    </button>
                    <button className="danger" onClick={() => deleteSession(session._id)}>
                      <Trash2 size={16} />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "inquiries" && (
          <div className="panel">
            <div className="panel-head">
              <h2>Inquiry Messages</h2>
            </div>
            <div className="inquiry-list">
              {inquiries.map((inquiry) => (
                <article key={inquiry._id}>
                  <div className="inquiry-main">
                    <strong>{inquiry.parentName}</strong>
                    <span>{inquiry.phone} {inquiry.email ? `| ${inquiry.email}` : ""}</span>
                    <p>
                      Child: {inquiry.childName} {inquiry.childAge ? `(${inquiry.childAge})` : ""} | Session: {inquiry.program}
                    </p>
                    {inquiry.message && <p>{inquiry.message}</p>}
                    {inquiry.createdAt && <small>{new Date(inquiry.createdAt).toLocaleString()}</small>}
                  </div>
                  <div className="inquiry-actions">
                    <select
                      value={inquiry.status || "new"}
                      onChange={(event) => updateInquiry(inquiry, { status: event.target.value as Inquiry["status"] })}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                    <textarea
                      placeholder="Admin note"
                      defaultValue={inquiry.adminNote}
                      onBlur={(event) => updateInquiry(inquiry, { adminNote: event.target.value })}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function FieldGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="field-group">
      <h3>{title}</h3>
      <div className="field-grid">{children}</div>
    </section>
  );
}

export default App;
