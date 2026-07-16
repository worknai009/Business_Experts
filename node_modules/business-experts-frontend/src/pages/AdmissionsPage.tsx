import { CheckCircle2, Globe, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import InquiryForm from "../components/InquiryForm";
import PageHero from "../components/PageHero";
import { useSiteContent } from "../data/apiContent";

function AdmissionsPage() {
  const { admissionsCta, programBrand, programImages } = useSiteContent();

  return (
    <main>
      <PageHero
        crumb="Admissions"
        eyebrow={programBrand.company}
        title="Admissions Open"
        copy={admissionsCta.headline}
        image={programImages.contact}
      />

      <section className="inquiry-section">
        <div className="inquiry-grid">
          <div className="section-content">
            <p className="eyebrow">Admission Inquiry</p>
            <h2>
              Send an Inquiry for <span className="accent">Your Child</span>
            </h2>
            <p className="section-copy">
              Fill in the form and our team will call you back to understand your child&apos;s
              needs and recommend the right session.
            </p>
            <ul>
              <li>
                <CheckCircle2 size={16} /> Free Personal Development Assessment for your child
              </li>
              <li>
                <CheckCircle2 size={16} /> Personal Improvement Roadmap before enrolment
              </li>
              <li>
                <CheckCircle2 size={16} /> Guidance on choosing the right session format
              </li>
              <li>
                <CheckCircle2 size={16} /> Small batches - limited seats per session
              </li>
            </ul>
            <p className="section-copy">
              Prefer to talk right away? Call us at{" "}
              <a className="inline-link" href={admissionsCta.phoneHref}>
                {admissionsCta.phone}
              </a>
              .
            </p>
          </div>
          <InquiryForm />
        </div>
      </section>

      <section className="admissions-section">
        <div className="admissions-card">
          <p className="eyebrow">Book a Child Assessment</p>
          <h2>{admissionsCta.headline}</h2>
          <p className="section-copy">
            Book a Child Assessment today and get a Personal Improvement Roadmap for your child.
          </p>
          <div className="hero-actions">
            <a className="primary-btn" href={admissionsCta.phoneHref}>
              <Phone size={16} /> Call {admissionsCta.phone}
            </a>
            <Link to="/contact" className="outline-btn">
              Book a Child Assessment
            </Link>
          </div>
          <div className="admissions-contact">
            <p>
              <Phone size={14} /> {admissionsCta.phone}
            </p>
            <p>
              <Mail size={14} /> <a href={admissionsCta.emailHref}>{admissionsCta.email}</a>
            </p>
            <p>
              <Globe size={14} />{" "}
              <a href={admissionsCta.websiteHref} target="_blank" rel="noreferrer">
                {admissionsCta.website}
              </a>
            </p>
            <p>
              <MapPin size={14} /> {admissionsCta.address}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdmissionsPage;
