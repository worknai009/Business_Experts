import { ArrowRight, GraduationCap, Phone, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import {
  admissionsCta,
  positioningQuote,
  programBrand,
  programConcept,
  programFormats,
  programImages,
  programOutcomes
} from "../data/perfectManContent";

const heroStats = [
  { value: "8–18", label: "Age Group (Years)" },
  { value: "6+", label: "Training Modules" },
  { value: "4", label: "Flexible Formats" },
  { value: "1:1", label: "Personal Assessment" }
];

function HomePage() {
  return (
    <main>
      <section className="program-hero dark-section">
        <span className="blob blob-a" aria-hidden="true" />
        <span className="blob blob-b" aria-hidden="true" />
        <div className="hero-copy">
          <p className="pill">
            <Sparkles size={13} /> {programBrand.company}
          </p>
          <p className="program-tagline">{programBrand.tagline}</p>
          <h1>
            {programBrand.name} <span>&amp; {programBrand.childName}</span>
          </h1>
          <p className="program-subtitle">{programBrand.subtitle}</p>
          <p>{programBrand.taglineSub}</p>
          <div className="program-chips">
            {programBrand.focusChips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
          <div className="hero-actions">
            <Link to="/contact" className="primary-btn">
              Join Now <ArrowRight size={17} />
            </Link>
            <a className="secondary-btn" href={admissionsCta.phoneHref}>
              <Phone size={16} /> {admissionsCta.phone}
            </a>
          </div>
          <p className="hero-meta">
            <Users size={16} /> For Children &amp; Young Adults · {programBrand.ageGroup}
          </p>
        </div>
        <div className="hero-panel">
          <img src={programImages.hero} alt="Confident children learning together" />
          <div className="hero-float-card">
            <GraduationCap />
            <div>
              <strong>Personal Improvement Roadmap</strong>
              <span>for every child, from day one</span>
            </div>
          </div>
          <div className="hero-badge">
            <span className="pulse-dot" /> Admissions Open
          </div>
        </div>
      </section>

      <section className="stats-band">
        <div className="stats-card">
          {heroStats.map((stat) => (
            <div className="stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="split-section home-concept">
        <div className="section-media">
          <img
            className="feature-image"
            src={programImages.concept}
            alt="Child building confidence through guided learning"
          />
          <div className="media-accent" aria-hidden="true" />
        </div>
        <div className="section-content">
          <p className="eyebrow">Program Concept</p>
          <h2>
            Identify. Improve. <span className="accent">Transform.</span>
          </h2>
          <p>{programConcept.general}</p>
          <p>{programConcept.child}</p>
          <Link to="/about" className="text-link">
            Learn more about the program <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div className="marquee-group" key={copy}>
              {[...programBrand.focusChips, "Practical Training", "Activity-Based Learning"].map(
                (item) => (
                  <span key={`${copy}-${item}`}>
                    {item} <em>✦</em>
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <section className="services-section">
        <div className="section-heading">
          <p className="eyebrow">Program Structure</p>
          <h2>Flexible Formats for Every Schedule</h2>
          <p className="section-copy">
            Daily sessions, weekends, a crash course, or a complete transformation journey — pick
            the pace that suits your child.
          </p>
        </div>
        <div className="format-grid">
          {programFormats.map((format) => {
            const Icon = format.icon;
            return (
              <div className="format-card" key={format.title}>
                <Icon />
                <h3>{format.title}</h3>
                <p>{format.schedule}</p>
              </div>
            );
          })}
        </div>
        <div className="hero-actions center-actions">
          <Link to="/programs" className="primary-btn">
            Explore All Programs <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <section className="outcomes-section dark-section">
        <div className="section-heading">
          <p className="eyebrow">The Result</p>
          <h2>Your Child Will Become</h2>
        </div>
        <div className="outcome-grid">
          {programOutcomes.map((outcome) => {
            const Icon = outcome.icon;
            return (
              <div className="outcome-tile" key={outcome.label}>
                <span className="outcome-icon">
                  <Icon size={26} />
                </span>
                <strong>{outcome.label}</strong>
              </div>
            );
          })}
        </div>
        <blockquote className="positioning-quote">
          “{positioningQuote}”
          <cite>
            {programBrand.company} — {programBrand.name} | {programBrand.positioning}
          </cite>
        </blockquote>
      </section>

      <section className="admissions-section">
        <div className="admissions-card">
          <p className="eyebrow">Admissions Open</p>
          <h2>{admissionsCta.headline}</h2>
          <p className="section-copy">
            Explore our programs and training modules, or book a Child Assessment today.
          </p>
          <div className="hero-actions">
            <Link to="/admissions" className="primary-btn">
              Admission Details <ArrowRight size={17} />
            </Link>
            <Link to="/modules" className="outline-btn">
              See Training Modules
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
