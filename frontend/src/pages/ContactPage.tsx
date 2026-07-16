import { Globe, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "../components/PageHero";
import { useSiteContent } from "../data/apiContent";

function ContactPage() {
  const { admissionsCta, programImages } = useSiteContent();

  return (
    <main>
      <PageHero
        crumb="Contact"
        eyebrow="Contact"
        title="Book a Child Assessment / Enroll Now"
        copy="Give your child skills for life, not just marks. Call us or visit the centre to book a Personal Development Assessment and choose the right session."
        image={programImages.contact}
      />

      <section className="contact-grid">
        <div className="contact-card">
          <MapPin size={28} />
          <h3>Training Centre</h3>
          <p>{admissionsCta.address}</p>
        </div>
        <div className="contact-card">
          <Phone size={28} />
          <h3>Call Us</h3>
          <p>
            <a href={admissionsCta.phoneHref}>{admissionsCta.phone}</a>
          </p>
        </div>
        <div className="contact-card">
          <Mail size={28} />
          <h3>Email &amp; Website</h3>
          <p>
            <a href={admissionsCta.emailHref}>{admissionsCta.email}</a>
          </p>
          <p>
            <Globe size={14} />{" "}
            <a href={admissionsCta.websiteHref} target="_blank" rel="noreferrer">
              {admissionsCta.website}
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

export default ContactPage;
