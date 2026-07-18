import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send, Twitter, Youtube } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { apiPost } from "../api";
import { useSite } from "../context/SiteContext";

const SOCIAL_ICONS = { facebook: Facebook, instagram: Instagram, linkedin: Linkedin, twitter: Twitter, youtube: Youtube };

export default function Footer() {
  const settings = useSite();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function subscribe(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    try {
      await apiPost("/newsletter", { email });
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  const brandName = settings?.brand?.name || "Business Experts";
  const footer = settings?.footer;
  const contact = settings?.contact;
  const copyright = (footer?.copyright || `© {year} ${brandName}. All rights reserved.`).replace(
    "{year}",
    String(new Date().getFullYear())
  );

  return (
    <footer className="relative bg-ink text-slate-300">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-70"
        aria-hidden
      />
      <div className="container-x grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            {settings?.brand?.logo ? (
              <img src={settings.brand.logo} alt={brandName} className="h-9 w-auto" />
            ) : (
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-deep font-display text-lg font-bold text-white">
                {brandName.charAt(0)}
              </span>
            )}
            <span className="font-display text-lg font-bold text-white">{brandName}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{footer?.about}</p>
          <div className="mt-5 flex gap-2">
            {Object.entries(SOCIAL_ICONS).map(([key, IconComponent]) => {
              const url = settings?.social?.[key];
              if (!url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={key}
                  className="grid size-9 place-items-center rounded-lg bg-white/5 text-slate-300 transition hover:bg-brand hover:text-white"
                >
                  <IconComponent className="size-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Useful Links</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {(footer?.links || []).map((link) => (
              <li key={`${link.label}-${link.url}`}>
                <Link to={link.url} className="text-slate-400 transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            {contact?.email ? (
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
                <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a>
              </li>
            ) : null}
            {contact?.phone ? (
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-white">{contact.phone}</a>
              </li>
            ) : null}
            {contact?.address ? (
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>{contact.address}</span>
              </li>
            ) : null}
          </ul>
        </div>

        {footer?.newsletterEnabled !== false ? (
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
              {footer?.newsletterTitle || "Newsletter"}
            </h4>
            <p className="mt-4 text-sm text-slate-400">{footer?.newsletterText}</p>
            <form onSubmit={subscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-brand"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                disabled={status === "sending"}
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white transition hover:bg-brand-dark disabled:opacity-60"
              >
                <Send className="size-4" />
              </button>
            </form>
            {status === "done" ? <p className="mt-2 text-xs text-emerald-400">Subscribed — welcome aboard!</p> : null}
            {status === "error" ? <p className="mt-2 text-xs text-rose-400">Please enter a valid email.</p> : null}
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-500 sm:flex-row">
          <span>{copyright}</span>
          <span>{settings?.brand?.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
