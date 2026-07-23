import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { apiPost } from "../api";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { useSeo, useSite } from "../context/SiteContext";
import { useOtpGate } from "../context/useOtpGate";

export default function ContactPage() {
  const settings = useSite();
  const location = useLocation();
  const presetSubject = (location.state as { subject?: string } | null)?.subject || "";
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: presetSubject, message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const { verify, otpModal } = useOtpGate();
  useSeo("Contact", "Talk to our team about memberships, investments and business support.");

  const contact = settings?.contact;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.email.trim()) {
      setError("An email is required to verify your inquiry.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    const otpToken = await verify(form.email.trim());
    if (!otpToken) {
      setStatus("idle");
      return;
    }
    try {
      await apiPost("/contact", { ...form, type: "contact", otpToken });
      setStatus("done");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
      setStatus("error");
    }
  }

  function update(field: keyof typeof form) {
    return (event: { target: { value: string } }) => setForm((value) => ({ ...value, [field]: event.target.value }));
  }

  const infoItems = [
    contact?.email && { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    contact?.phone && { icon: Phone, label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
    contact?.whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: contact.whatsapp,
      href: `https://wa.me/${contact.whatsapp.replace(/[^\d]/g, "")}`
    },
    contact?.address && { icon: MapPin, label: "Office", value: contact.address },
    contact?.hours && { icon: Clock, label: "Hours", value: contact.hours }
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your growth"
        subtitle="Questions about memberships, investment opportunities or business support? We reply within one business day."
      />
      <section className="section-pad">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="space-y-4">
              {infoItems.map((item) => (
                <div key={item.label} className="card flex items-start gap-4 p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="mt-0.5 block text-sm font-semibold text-ink hover:text-brand">
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-sm font-semibold text-ink">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
              {contact?.mapEmbed ? (
                <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                  <iframe
                    src={contact.mapEmbed}
                    title="Office location"
                    className="h-64 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <div className="card p-8">
              {status === "done" ? (
                <div className="py-14 text-center">
                  <CheckCircle2 className="mx-auto size-14 text-emerald-500" />
                  <h2 className="mt-4 text-xl font-bold">Message sent</h2>
                  <p className="mt-2 text-sm">Thank you for reaching out — our team will get back to you shortly.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold">Send us a message</h2>
                  <form onSubmit={submit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input required placeholder="Full name *" className="input" value={form.name} onChange={update("name")} />
                      <input type="email" required placeholder="Email *" className="input" value={form.email} onChange={update("email")} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input placeholder="Phone" className="input" value={form.phone} onChange={update("phone")} />
                      <input placeholder="Subject" className="input" value={form.subject} onChange={update("subject")} />
                    </div>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can we help? *"
                      className="input resize-none"
                      value={form.message}
                      onChange={update("message")}
                    />
                    {status === "error" ? <p className="text-sm text-rose-600">{error}</p> : null}
                    <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60">
                      {status === "sending" ? "Sending…" : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>
      {otpModal}
    </>
  );
}
