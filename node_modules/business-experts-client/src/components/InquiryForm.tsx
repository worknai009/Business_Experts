import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { admissionsCta, programOptions } from "../data/perfectManContent";

type Status = "idle" | "submitting" | "success" | "error";

const initialForm = {
  parentName: "",
  phone: "",
  email: "",
  childName: "",
  childAge: "",
  program: "",
  message: ""
};

function InquiryForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<Status>("idle");

  const update =
    (field: keyof typeof initialForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      if (status === "error") {
        setStatus("idle");
      }
    };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          childAge: form.childAge ? Number(form.childAge) : undefined
        })
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="inquiry-form form-success">
        <CheckCircle2 size={52} />
        <h3>Inquiry Received!</h3>
        <p>
          Thank you, <strong>{form.parentName}</strong>. Our team will call you shortly on{" "}
          <strong>{form.phone}</strong> to discuss the right program for {form.childName}.
        </p>
        <button
          type="button"
          className="outline-btn"
          onClick={() => {
            setForm(initialForm);
            setStatus("idle");
          }}
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <h3>Admission Inquiry Form</h3>
      <div className="form-row">
        <div className="field">
          <label htmlFor="parentName">
            Parent / Guardian Name <em>*</em>
          </label>
          <input
            id="parentName"
            required
            placeholder="Your full name"
            value={form.parentName}
            onChange={update("parentName")}
          />
        </div>
        <div className="field">
          <label htmlFor="phone">
            Phone Number <em>*</em>
          </label>
          <input
            id="phone"
            required
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            value={form.phone}
            onChange={update("phone")}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="email">Email (Optional)</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={update("email")}
        />
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="childName">
            Child&apos;s Name <em>*</em>
          </label>
          <input
            id="childName"
            required
            placeholder="Child's full name"
            value={form.childName}
            onChange={update("childName")}
          />
        </div>
        <div className="field">
          <label htmlFor="childAge">Child&apos;s Age</label>
          <input
            id="childAge"
            type="number"
            min={5}
            max={21}
            placeholder="8–18 years"
            value={form.childAge}
            onChange={update("childAge")}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="program">
          Interested Program <em>*</em>
        </label>
        <select id="program" required value={form.program} onChange={update("program")}>
          <option value="" disabled>
            Select a program
          </option>
          {programOptions.map((option) => (
            <option key={option.program} value={option.program}>
              {option.program} — {option.suitableFor}
            </option>
          ))}
          <option value="Not sure — need guidance">Not sure — need guidance</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="message">Message (Optional)</label>
        <textarea
          id="message"
          placeholder="Tell us about your child — confidence, stage fear, communication, discipline, or anything else we should know."
          value={form.message}
          onChange={update("message")}
        />
      </div>

      {status === "error" && (
        <p className="form-error">
          Something went wrong while sending your inquiry. Please try again, or call us directly at{" "}
          <a href={admissionsCta.phoneHref}>{admissionsCta.phone}</a>.
        </p>
      )}

      <button type="submit" className="primary-btn" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            Sending... <Loader2 size={17} className="spin" />
          </>
        ) : (
          <>
            Submit Inquiry <Send size={16} />
          </>
        )}
      </button>
      <p className="form-note">
        Our team will contact you within 24 hours to schedule your child&apos;s free assessment.
      </p>
    </form>
  );
}

export default InquiryForm;
