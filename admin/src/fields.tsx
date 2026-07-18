import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { uploadFile } from "./api";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "checkbox"
  | "select"
  | "date"
  | "image"
  | "images"
  | "list";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  hint?: string;
  half?: boolean;
  required?: boolean;
};

type FieldProps = {
  field: Field;
  value: unknown;
  onChange: (value: unknown) => void;
};

function ImageInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function pickFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadFile(file));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        {value ? (
          <img src={value} alt="" className="size-11 shrink-0 rounded-lg border border-slate-200 object-cover" />
        ) : null}
        <input
          className="input"
          placeholder="Paste image URL or upload →"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="btn-secondary shrink-0 !px-3"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          title="Upload file"
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/mp4,video/webm"
          className="hidden"
          onChange={(event) => pickFile(event.target.files?.[0])}
        />
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function ImagesInput({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function pickFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push(await uploadFile(file));
      onChange([...value, ...urls]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {value.map((url, index) => (
          <div key={`${url}-${index}`} className="group relative">
            <img src={url} alt="" className="size-16 rounded-lg border border-slate-200 object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}
              className="absolute -right-1.5 -top-1.5 hidden size-5 place-items-center rounded-full bg-rose-500 text-white group-hover:grid"
              aria-label="Remove image"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="grid size-16 place-items-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-brand hover:text-brand disabled:opacity-50"
          aria-label="Add images"
        >
          {busy ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            void pickFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>
      <textarea
        rows={2}
        className="input mt-2 font-mono !text-xs"
        placeholder="…or paste image URLs, one per line"
        value={value.join("\n")}
        onChange={(event) => onChange(event.target.value.split("\n").map((line) => line.trim()).filter(Boolean))}
      />
    </div>
  );
}

export function FieldInput({ field, value, onChange }: FieldProps) {
  switch (field.type) {
    case "textarea":
      return (
        <textarea
          rows={3}
          className="input resize-y"
          placeholder={field.placeholder}
          value={(value as string) || ""}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "richtext":
      return (
        <textarea
          rows={10}
          className="input resize-y"
          placeholder={field.placeholder || "Supports paragraphs (blank line) and **bold** text"}
          value={(value as string) || ""}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "number":
      return (
        <input
          type="number"
          className="input"
          placeholder={field.placeholder}
          value={value === undefined || value === null ? "" : String(value)}
          onChange={(event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))}
        />
      );
    case "checkbox":
      return (
        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(event.target.checked)}
            className="size-4 accent-[var(--color-brand)]"
          />
          <span className="text-sm text-ink">{field.hint || field.label}</span>
        </label>
      );
    case "select":
      return (
        <select className="input" value={(value as string) || ""} onChange={(event) => onChange(event.target.value)}>
          {(field.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    case "date": {
      const dateValue = value ? new Date(value as string).toISOString().slice(0, 10) : "";
      return (
        <input
          type="date"
          className="input"
          value={dateValue}
          onChange={(event) => onChange(event.target.value ? new Date(event.target.value).toISOString() : null)}
        />
      );
    }
    case "image":
      return <ImageInput value={(value as string) || ""} onChange={onChange} />;
    case "images":
      return <ImagesInput value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />;
    case "list":
      return (
        <textarea
          rows={3}
          className="input"
          placeholder={field.placeholder || "One item per line"}
          value={Array.isArray(value) ? (value as string[]).join("\n") : ""}
          onChange={(event) => onChange(event.target.value.split("\n"))}
        />
      );
    default:
      return (
        <input
          className="input"
          placeholder={field.placeholder}
          value={(value as string) || ""}
          onChange={(event) => onChange(event.target.value)}
        />
      );
  }
}

export function FieldRow({ field, value, onChange }: FieldProps) {
  return (
    <div className={field.half ? "" : "sm:col-span-2"}>
      {field.type !== "checkbox" ? (
        <label className="label">
          {field.label}
          {field.required ? <span className="text-rose-500"> *</span> : null}
        </label>
      ) : (
        <span className="label">{field.label}</span>
      )}
      <FieldInput field={field} value={value} onChange={onChange} />
      {field.hint && field.type !== "checkbox" ? <p className="mt-1 text-xs text-slate-400">{field.hint}</p> : null}
    </div>
  );
}

/** Strip empty strings out of list fields before saving. */
export function cleanListFields(payload: Record<string, unknown>, fields: Field[]) {
  const next = { ...payload };
  for (const field of fields) {
    if ((field.type === "list" || field.type === "images") && Array.isArray(next[field.name])) {
      next[field.name] = (next[field.name] as string[]).map((item) => item.trim()).filter(Boolean);
    }
  }
  return next;
}
