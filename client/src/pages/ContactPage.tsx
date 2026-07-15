import { Mail, MapPin } from "lucide-react";
import PageHero from "../components/PageHero";
import { images } from "../data/siteContent";

function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Start Your India Business Journey"
        copy="Share your goals and our team will help you choose the right setup, compliance, and investment pathway."
        image={images.contact}
      />

      <section className="contact-grid">
        <div className="contact-card">
          <MapPin size={28} />
          <h3>Office</h3>
          <p>300 GF, Green Tower, Airport Road, Bangaluru, Karnataka 560065</p>
        </div>
        <div className="contact-card">
          <Mail size={28} />
          <h3>Email</h3>
          <p>info@business-expert.asia</p>
        </div>
      </section>
    </main>
  );
}

export default ContactPage;
