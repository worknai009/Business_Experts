import { ChevronDown, ChevronUp, Eye, EyeOff, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { api, type AnyDoc } from "./api";
import { cleanListFields, FieldRow } from "./fields";
import type { ResourceConfig } from "./resources";

export default function ResourceManager({ config }: { config: ResourceConfig }) {
  const [items, setItems] = useState<AnyDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AnyDoc | Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const base = `/admin/${config.key}`;

  async function refresh() {
    setLoading(true);
    try {
      setItems(await api.get<AnyDoc[]>(base));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setEditing(null);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.key]);

  function flash(message: string) {
    setNotice(message);
    setTimeout(() => setNotice(""), 2500);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      const payload = cleanListFields(editing as Record<string, unknown>, config.fields);
      const id = (editing as AnyDoc)._id;
      if (id) await api.put(`${base}/${id}`, payload);
      else await api.post(base, payload);
      setEditing(null);
      flash(`${config.singular} saved.`);
      await refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: AnyDoc) {
    if (!window.confirm(`Delete "${item[config.titleField] || config.singular}" permanently?`)) return;
    await api.delete(`${base}/${item._id}`);
    flash(`${config.singular} deleted.`);
    await refresh();
  }

  async function toggle(item: AnyDoc, field: "isPublished" | "isFeatured") {
    const current = field === "isPublished" ? item.isPublished !== false : Boolean(item[field]);
    await api.put(`${base}/${item._id}`, { [field]: !current });
    await refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    await api.patch(`${base}/reorder`, {
      items: next.map((item, itemIndex) => ({ id: item._id, order: itemIndex + 1 }))
    });
    await refresh();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">{config.plural}</h1>
          <p className="text-sm text-slate-500">
            {items.length} item{items.length === 1 ? "" : "s"} · changes go live on the website instantly
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setEditing({})}>
          <Plus className="size-4" /> Add {config.singular}
        </button>
      </div>

      {notice ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          {notice}
        </div>
      ) : null}

      {loading ? (
        <div className="grid h-40 place-items-center">
          <div className="size-8 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
        </div>
      ) : (
        <div className="card divide-y divide-slate-100">
          {items.map((item, index) => {
            const published = item.isPublished !== false;
            const image = config.imageField ? (item[config.imageField] as string) : "";
            return (
              <div key={item._id} className={`flex items-center gap-3 p-3.5 ${published ? "" : "opacity-50"}`}>
                <div className="flex flex-col gap-1">
                  <button type="button" className="icon-btn !size-6" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move up">
                    <ChevronUp className="size-3.5" />
                  </button>
                  <button type="button" className="icon-btn !size-6" disabled={index === items.length - 1} onClick={() => move(index, 1)} aria-label="Move down">
                    <ChevronDown className="size-3.5" />
                  </button>
                </div>
                {image ? (
                  <img src={image} alt="" className="size-12 shrink-0 rounded-lg border border-slate-100 object-cover" />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{String(item[config.titleField] || "Untitled")}</p>
                  {config.subtitleField && item[config.subtitleField] ? (
                    <p className="truncate text-xs text-slate-500">{String(item[config.subtitleField])}</p>
                  ) : null}
                </div>
                {config.hasFeature ? (
                  <button
                    type="button"
                    className="icon-btn"
                    title={item.isFeatured ? "Unfeature" : "Feature on homepage"}
                    onClick={() => toggle(item, "isFeatured")}
                  >
                    <Star className={`size-4 ${item.isFeatured ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                ) : null}
                <button
                  type="button"
                  className="icon-btn"
                  title={published ? "Hide from website" : "Publish"}
                  onClick={() => toggle(item, "isPublished")}
                >
                  {published ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </button>
                <button type="button" className="icon-btn" title="Edit" onClick={() => setEditing(item)}>
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  className="icon-btn hover:!border-rose-300 hover:!text-rose-600"
                  title="Delete"
                  onClick={() => remove(item)}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
          {!items.length ? (
            <p className="p-10 text-center text-sm text-slate-400">
              Nothing here yet — add your first {config.singular.toLowerCase()}.
            </p>
          ) : null}
        </div>
      )}

      {editing ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm" onClick={() => setEditing(null)}>
          <div
            className="h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <h2 className="text-lg font-bold">
                {(editing as AnyDoc)._id ? `Edit ${config.singular}` : `New ${config.singular}`}
              </h2>
              <button type="button" className="icon-btn" onClick={() => setEditing(null)} aria-label="Close">
                <X className="size-4" />
              </button>
            </div>
            <form onSubmit={save} className="grid gap-4 p-6 sm:grid-cols-2">
              {config.fields.map((field) => (
                <FieldRow
                  key={field.name}
                  field={field}
                  value={(editing as Record<string, unknown>)[field.name]}
                  onChange={(value) => setEditing((current) => ({ ...current, [field.name]: value }))}
                />
              ))}
              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-200 px-3.5 py-2.5">
                  <input
                    type="checkbox"
                    checked={(editing as AnyDoc).isPublished !== false}
                    onChange={(event) => setEditing((current) => ({ ...current, isPublished: event.target.checked }))}
                    className="size-4 accent-[var(--color-brand)]"
                  />
                  <span className="text-sm text-ink">Published (visible on the website)</span>
                </label>
              </div>
              {error ? <p className="text-sm text-rose-600 sm:col-span-2">{error}</p> : null}
              <div className="flex gap-3 sm:col-span-2">
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
