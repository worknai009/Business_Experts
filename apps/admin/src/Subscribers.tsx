import { Download, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "./api";

type Subscriber = { _id: string; email: string; createdAt: string };

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  async function refresh() {
    setSubscribers(await api.get<Subscriber[]>("/admin/subscribers"));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function remove(subscriber: Subscriber) {
    if (!window.confirm(`Remove ${subscriber.email} from the newsletter?`)) return;
    await api.delete(`/admin/subscribers/${subscriber._id}`);
    await refresh();
  }

  function exportCsv() {
    const csv = ["email,subscribed_at", ...subscribers.map((row) => `${row.email},${row.createdAt}`)].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "subscribers.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Newsletter Subscribers</h1>
          <p className="text-sm text-slate-500">{subscribers.length} subscriber{subscribers.length === 1 ? "" : "s"}</p>
        </div>
        <button type="button" className="btn-secondary" onClick={exportCsv} disabled={!subscribers.length}>
          <Download className="size-4" /> Export CSV
        </button>
      </div>
      <div className="card divide-y divide-slate-100">
        {subscribers.map((subscriber) => (
          <div key={subscriber._id} className="flex items-center gap-3 p-4">
            <span className="flex-1 text-sm font-medium text-ink">{subscriber.email}</span>
            <span className="text-xs text-slate-400">{new Date(subscriber.createdAt).toLocaleDateString("en-IN")}</span>
            <button
              type="button"
              className="icon-btn hover:!border-rose-300 hover:!text-rose-600"
              onClick={() => remove(subscriber)}
              aria-label="Remove subscriber"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        {!subscribers.length ? <p className="p-10 text-center text-sm text-slate-400">No subscribers yet.</p> : null}
      </div>
    </div>
  );
}
