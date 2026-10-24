import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "./api";
import { FieldInput, type Field } from "./fields";

type Settings = Record<string, any>;

const TABS = [
  "Brand",
  "Hero",
  "Announcement",
  "Popup",
  "Business Story",
  "Homepage Sections",
  "Contact",
  "Social",
  "Footer",
  "SEO",
  "Theme"
] as const;

type Tab = (typeof TABS)[number];

function getPath(object: Settings, path: string) {
  return path.split(".").reduce((value, key) => (value == null ? value : value[key]), object);
}

function setPath(object: Settings, path: string, value: unknown): Settings {
  const keys = path.split(".");
  const next = { ...object };
  let cursor: Settings = next;
  keys.slice(0, -1).forEach((key) => {
    cursor[key] = { ...(cursor[key] || {}) };
    cursor = cursor[key];
  });
  cursor[keys[keys.length - 1]] = value;
  return next;
}

type SettingField = Field & { path: string };

const FORMS: Record<Tab, SettingField[]> = {
  Brand: [
    { path: "brand.name", name: "name", label: "Website name", type: "text", half: true },
    { path: "brand.tagline", name: "tagline", label: "Tagline", type: "text", half: true },
    { path: "brand.logo", name: "logo", label: "Logo", type: "image", hint: "Shown in the navbar and footer; leave empty for a monogram" },
    { path: "brand.logoHeight", name: "logoHeight", label: "Logo size (px)", type: "number", half: true, hint: "Navbar logo height in pixels — e.g. 48 small, 64 normal, 80 large" },
    { path: "brand.favicon", name: "favicon", label: "Favicon", type: "image" }
  ],
  Hero: [
    { path: "hero.badge", name: "badge", label: "Badge text", type: "text" },
    { path: "hero.title", name: "title", label: "Title", type: "text" },
    { path: "hero.subtitle", name: "subtitle", label: "Subtitle", type: "textarea" },
    { path: "hero.image", name: "image", label: "Hero image", type: "image" },
    { path: "hero.primaryCta.label", name: "pl", label: "Primary button label", type: "text", half: true },
    { path: "hero.primaryCta.url", name: "pu", label: "Primary button link", type: "text", half: true },
    { path: "hero.secondaryCta.label", name: "sl", label: "Secondary button label", type: "text", half: true },
    { path: "hero.secondaryCta.url", name: "su", label: "Secondary button link", type: "text", half: true }
  ],
  Announcement: [
    { path: "announcement.enabled", name: "enabled", label: "Announcement bar", type: "checkbox", hint: "Show the announcement bar" },
    { path: "announcement.text", name: "text", label: "Text", type: "text" },
    { path: "announcement.link", name: "link", label: "Link", type: "text", half: true },
    { path: "announcement.linkLabel", name: "linkLabel", label: "Link label", type: "text", half: true }
  ],
  Popup: [
    { path: "popup.enabled", name: "enabled", label: "Popup", type: "checkbox", hint: "Show a popup once per visit" },
    { path: "popup.title", name: "title", label: "Title", type: "text" },
    { path: "popup.message", name: "message", label: "Message", type: "textarea" },
    { path: "popup.image", name: "image", label: "Image", type: "image" },
    { path: "popup.buttonLabel", name: "buttonLabel", label: "Button label", type: "text", half: true },
    { path: "popup.buttonLink", name: "buttonLink", label: "Button link", type: "text", half: true }
  ],
  "Business Story": [
    { path: "businessStory.enabled", name: "enabled", label: "Business Story", type: "checkbox", hint: "Show the story video on the About Us page" },
    { path: "businessStory.title", name: "title", label: "Title", type: "text", half: true },
    { path: "businessStory.video", name: "video", label: "Video URL", type: "text", half: true, placeholder: "Paste a YouTube or Vimeo link", hint: "Any YouTube/Vimeo link works — share, watch, or embed URL" },
    { path: "businessStory.description", name: "description", label: "Description", type: "textarea" }
  ],
  "Homepage Sections": [],
  Contact: [
    { path: "contact.email", name: "email", label: "Email", type: "text", half: true },
    { path: "contact.phone", name: "phone", label: "Phone", type: "text", half: true },
    { path: "contact.whatsapp", name: "whatsapp", label: "WhatsApp", type: "text", half: true },
    { path: "contact.hours", name: "hours", label: "Office hours", type: "text", half: true },
    { path: "contact.address", name: "address", label: "Office address", type: "textarea" },
    { path: "contact.mapEmbed", name: "mapEmbed", label: "Google Maps embed URL", type: "text", hint: "Google Maps → Share → Embed a map → copy the src URL" }
  ],
  Social: [
    { path: "social.facebook", name: "facebook", label: "Facebook", type: "text", half: true },
    { path: "social.instagram", name: "instagram", label: "Instagram", type: "text", half: true },
    { path: "social.linkedin", name: "linkedin", label: "LinkedIn", type: "text", half: true },
    { path: "social.twitter", name: "twitter", label: "X / Twitter", type: "text", half: true },
    { path: "social.youtube", name: "youtube", label: "YouTube", type: "text", half: true }
  ],
  Footer: [
    { path: "footer.about", name: "about", label: "Company information", type: "textarea" },
    { path: "footer.copyright", name: "copyright", label: "Copyright line", type: "text", hint: "{year} is replaced with the current year" },
    { path: "footer.newsletterEnabled", name: "ne", label: "Newsletter", type: "checkbox", hint: "Show the newsletter signup" },
    { path: "footer.newsletterTitle", name: "nt", label: "Newsletter title", type: "text", half: true },
    { path: "footer.newsletterText", name: "nx", label: "Newsletter text", type: "text", half: true }
  ],
  SEO: [
    { path: "seo.title", name: "title", label: "Default page title", type: "text" },
    { path: "seo.description", name: "description", label: "Meta description", type: "textarea" },
    { path: "seo.keywords", name: "keywords", label: "Keywords", type: "text" },
    { path: "seo.ogImage", name: "ogImage", label: "Social share image", type: "image" }
  ],
  Theme: [
    { path: "theme.primary", name: "primary", label: "Primary color", type: "text", half: true, hint: "e.g. #059669" },
    { path: "theme.dark", name: "dark", label: "Dark / text color", type: "text", half: true, hint: "e.g. #0B1220" },
    { path: "theme.gray", name: "gray", label: "Soft background color", type: "text", half: true, hint: "e.g. #F4F6FA" }
  ]
};

export default function SettingsEditor() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [tab, setTab] = useState<Tab>("Brand");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    api.get<Settings>("/admin/settings").then(setSettings).catch(() => {});
  }, []);

  async function save() {
    if (!settings) return;
    setSaving(true);
    try {
      const { _id, createdAt, updatedAt, __v, ...payload } = settings;
      setSettings(await api.put<Settings>("/admin/settings", payload));
      setNotice("Settings saved — live on the website.");
      setTimeout(() => setNotice(""), 2500);
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return (
      <div className="grid h-64 place-items-center">
        <div className="size-8 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
      </div>
    );
  }

  const heroStats: { value: string; label: string }[] = settings.hero?.stats || [];
  const footerLinks: { label: string; url: string }[] = settings.footer?.links || [];
  const sections: { key: string; label: string; enabled: boolean }[] = settings.sections || [];

  function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSettings((current) => ({ ...current, sections: next }));
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Website Settings</h1>
          <p className="text-sm text-slate-500">Hero, branding, contact details, SEO, theme — everything on the site.</p>
        </div>
        <button type="button" className="btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {notice ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          {notice}
        </div>
      ) : null}

      <div className="mb-5 flex flex-wrap gap-1.5">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
              tab === item ? "bg-brand text-white" : "bg-white text-slate-600 hover:text-brand"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="card grid gap-4 p-6 sm:grid-cols-2">
        {FORMS[tab].map((field) => (
          <div key={field.path} className={field.half ? "" : "sm:col-span-2"}>
            {field.type !== "checkbox" ? <label className="label">{field.label}</label> : <span className="label">{field.label}</span>}
            <FieldInput
              field={field}
              value={getPath(settings, field.path)}
              onChange={(value) => setSettings((current) => setPath(current!, field.path, value))}
            />
            {field.hint && field.type !== "checkbox" ? <p className="mt-1 text-xs text-slate-400">{field.hint}</p> : null}
          </div>
        ))}

        {tab === "Hero" ? (
          <div className="sm:col-span-2">
            <label className="label">Hero stats</label>
            <div className="space-y-2">
              {heroStats.map((stat, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    className="input"
                    placeholder="Value (e.g. 500+)"
                    value={stat.value || ""}
                    onChange={(event) => {
                      const next = [...heroStats];
                      next[index] = { ...next[index], value: event.target.value };
                      setSettings((current) => setPath(current!, "hero.stats", next));
                    }}
                  />
                  <input
                    className="input"
                    placeholder="Label (e.g. Members)"
                    value={stat.label || ""}
                    onChange={(event) => {
                      const next = [...heroStats];
                      next[index] = { ...next[index], label: event.target.value };
                      setSettings((current) => setPath(current!, "hero.stats", next));
                    }}
                  />
                  <button
                    type="button"
                    className="icon-btn shrink-0 self-center hover:!border-rose-300 hover:!text-rose-600"
                    onClick={() =>
                      setSettings((current) =>
                        setPath(current!, "hero.stats", heroStats.filter((_, itemIndex) => itemIndex !== index))
                      )
                    }
                    aria-label="Remove stat"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSettings((current) => setPath(current!, "hero.stats", [...heroStats, { value: "", label: "" }]))}
              >
                <Plus className="size-4" /> Add stat
              </button>
            </div>
          </div>
        ) : null}

        {tab === "Footer" ? (
          <div className="sm:col-span-2">
            <label className="label">Useful links</label>
            <div className="space-y-2">
              {footerLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    className="input"
                    placeholder="Label"
                    value={link.label || ""}
                    onChange={(event) => {
                      const next = [...footerLinks];
                      next[index] = { ...next[index], label: event.target.value };
                      setSettings((current) => setPath(current!, "footer.links", next));
                    }}
                  />
                  <input
                    className="input"
                    placeholder="URL (e.g. /projects)"
                    value={link.url || ""}
                    onChange={(event) => {
                      const next = [...footerLinks];
                      next[index] = { ...next[index], url: event.target.value };
                      setSettings((current) => setPath(current!, "footer.links", next));
                    }}
                  />
                  <button
                    type="button"
                    className="icon-btn shrink-0 self-center hover:!border-rose-300 hover:!text-rose-600"
                    onClick={() =>
                      setSettings((current) =>
                        setPath(current!, "footer.links", footerLinks.filter((_, itemIndex) => itemIndex !== index))
                      )
                    }
                    aria-label="Remove link"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  setSettings((current) => setPath(current!, "footer.links", [...footerLinks, { label: "", url: "" }]))
                }
              >
                <Plus className="size-4" /> Add link
              </button>
            </div>
          </div>
        ) : null}

        {tab === "Homepage Sections" ? (
          <div className="sm:col-span-2">
            <p className="mb-3 text-sm text-slate-500">
              Drag sections into the order you want with the arrows, or hide them entirely. The hero always stays on top.
            </p>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
              {sections.map((section, index) => (
                <div key={section.key} className="flex items-center gap-3 p-3">
                  <div className="flex gap-1">
                    <button type="button" className="icon-btn !size-7" disabled={index === 0} onClick={() => moveSection(index, -1)} aria-label="Move up">
                      <ChevronUp className="size-3.5" />
                    </button>
                    <button type="button" className="icon-btn !size-7" disabled={index === sections.length - 1} onClick={() => moveSection(index, 1)} aria-label="Move down">
                      <ChevronDown className="size-3.5" />
                    </button>
                  </div>
                  <span className="flex-1 text-sm font-semibold text-ink">{section.label || section.key}</span>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">
                    <input
                      type="checkbox"
                      checked={section.enabled !== false}
                      onChange={(event) => {
                        const next = [...sections];
                        next[index] = { ...next[index], enabled: event.target.checked };
                        setSettings((current) => ({ ...current, sections: next }));
                      }}
                      className="size-4 accent-[var(--color-brand)]"
                    />
                    Visible
                  </label>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
