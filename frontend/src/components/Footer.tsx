import { ArrowRight, Globe, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useProgramSessions, useSiteContent } from "../data/apiContent";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Sessions", to: "/programs" },
  { label: "Modules", to: "/modules" },
  { label: "Admissions", to: "/admissions" },
  { label: "Contact", to: "/contact" }
];

function Footer() {
  const { admissionsCta, programBrand } = useSiteContent();
  const sessions = useProgramSessions();

  return (
    <footer>
      <div className="footer-cta">
        <div>
          <h3>{programBrand.transformLine}</h3>
          <p>Book a Child Assessment today and get a Personal Improvement Roadmap.</p>
        </div>
        <Link to="/contact" className="footer-cta-btn">
          Enroll Now <ArrowRight size={17} />
        </Link>
      </div>
      <div className="footer-main">
        <div className="footer-brand">
          <div className="logo-box">
            <div className="logo-mark">
              <span className="logo-orbit" />
              <span className="logo-core">PM</span>
            </div>
            <span className="logo-text">
              <strong>Perfect Man</strong>
              <small>by Excelsus</small>
            </span>
          </div>
          <p className="footer-blurb">
            {programBrand.subtitle} - {programBrand.positioning}. {programBrand.tagline}
          </p>
          <p>
            <MapPin size={15} /> {admissionsCta.address}
          </p>
          <p>
            <Phone size={15} /> <a href={admissionsCta.phoneHref}>{admissionsCta.phone}</a>
          </p>
          <p>
            <Mail size={15} /> <a href={admissionsCta.emailHref}>{admissionsCta.email}</a>
          </p>
          <p>
            <Globe size={15} />{" "}
            <a href={admissionsCta.websiteHref} target="_blank" rel="noreferrer">
              {admissionsCta.website}
            </a>
          </p>
        </div>
        <div>
          <h3>Quick Links</h3>
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
          <a href={admissionsCta.phoneHref}>Book an Assessment</a>
        </div>
        <div>
          <h3>Our Sessions</h3>
          {sessions.map((option) => (
            <p key={option._id || option.title}>{option.title}</p>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} {programBrand.company} - {programBrand.name}. All rights
        reserved.
      </div>
    </footer>
  );
}

export default Footer;
