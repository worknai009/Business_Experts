import { CheckCircle2, ClipboardList, PhoneCall, Send } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { apiGet, apiPost, type Faq, type Membership } from "../api";
import FaqList from "../components/FaqList";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { useSeo } from "../context/SiteContext";

const STEPS = [
  { icon: ClipboardList, title: "Submit your inquiry", text: "Tell us who you are and which membership you want." },
  { icon: PhoneCall, title: "Our team contacts you", text: "We reach out within 1–2 business days with details." },
  { icon: CheckCircle2, title: "Become a member", text: "Complete onboarding and join the ecosystem." }
];

export default function MembershipsPage() {
  const location = useLocation();
  const preset = (location.state as { type?: string } | null)?.type || "";
  const [types, setTypes] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    membershipType: preset,
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  useSeo("Become a Member", "Send a membership inquiry and our team will contact you.");

  useEffect(() => {
    apiGet<Membership[]>("/memberships")
      .then((plans) => {
        const names = plans.map((plan) => plan.name);
        setTypes(names);
        setForm((current) =>
          current.membershipType || !names.length ? current : { ...current, membershipType: names[0] }
        );
      })
      .catch(() => {});
    apiGet<Faq[]>("/faqs").then(setFaqs).catch(() => {});
  }, []);

  function update(field: keyof typeof form) {
    return (event: { target: { value: string } }) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await apiPost("/contact", {
        ...form,
        type: "membership",
        subject: `Membership inquiry: ${form.membershipType}`
      });
      setStatus("done");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Memberships"
        title="Become a member of the ecosystem"
        subtitle="Whether you run a business, build a startup, invest, work as a professional or are a senior citizen — start with a simple inquiry and our team will guide you personally."
      />

      <section className="section-pad">
        <div className="container-x">
          <div className="mx-auto mb-14 grid max-w-4xl gap-6 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.08}>
                <div className="card h-full p-6 text-center">
                  <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-glow">
                    <step.icon className="size-5" />
                  </span>
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-brand">Step {index + 1}</p>
                  <h3 className="mt-1 text-base font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mx-auto max-w-2xl">
            <div className="card p-8 md:p-10">
              {status === "done" ? (
                <div className="py-12 text-center">
                  <CheckCircle2 className="mx-auto size-16 text-brand" />
                  <h2 className="mt-5 text-2xl font-bold">Inquiry received!</h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed md:text-base">
                    Thank you, {form.name.split(" ")[0] || "friend"}. Your membership inquiry has been submitted —
                    our team will contact you within 1–2 business days.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold md:text-2xl">Membership inquiry</h2>
                  <p className="mt-2 text-sm">
                    Fill in your details and our team will get in touch with everything you need to know.
                  </p>
                  <form onSubmit={submit} className="mt-7 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input required placeholder="Full name *" className="input" value={form.name} onChange={update("name")} />
                      <input type="email" required placeholder="Email *" className="input" value={form.email} onChange={update("email")} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input placeholder="Phone" className="input" value={form.phone} onChange={update("phone")} />
                      <input placeholder="Company / organisation" className="input" value={form.company} onChange={update("company")} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Membership type *
                      </label>
                      <select required className="input" value={form.membershipType} onChange={update("membershipType")}>
                        {types.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Tell us briefly about yourself or your business"
                      className="input resize-none"
                      value={form.message}
                      onChange={update("message")}
                    />
                    {status === "error" ? <p className="text-sm text-rose-600">{error}</p> : null}
                    <button type="submit" disabled={status === "sending"} className="btn-primary w-full !py-4">
                      {status === "sending" ? "Submitting…" : (
                        <>
                          Submit Inquiry <Send className="size-4" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {faqs.length ? (
        <section className="section-pad bg-mist">
          <div className="container-x">
            <SectionHeading eyebrow="FAQ" title="Membership questions, answered" />
            <FaqList faqs={faqs} />
          </div>
        </section>
      ) : null}
    </>
  );
}
