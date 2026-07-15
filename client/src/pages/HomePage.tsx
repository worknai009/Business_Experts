import { Link } from "react-router-dom";
import ServiceGrid from "../components/ServiceGrid";
import { images, stats, strengths, whyIndia } from "../data/siteContent";

function HomePage() {
  return (
    <main>
      <section className="home-hero dark-section">
        <div className="hero-copy">
          <p className="pill">Your Partner To Success</p>
          <h1>
            Your Business Success Starts in <span>India</span>
          </h1>
          <p>
            Empowering global investors to establish, grow, and succeed in India's dynamic market
            with 100% compliance.
          </p>
          <div className="hero-actions">
            <Link to="/services" className="primary-btn">Explore Services</Link>
            <Link to="/contact" className="secondary-btn">Free Consultation</Link>
          </div>
        </div>
        <div className="hero-panel">
          <img src={images.hero} alt="Business investors meeting in India" />
        </div>
      </section>

      <section className="split-section">
        <div className="section-media">
          <img className="feature-image" src={images.boardroom} alt="Business growth discussion" />
        </div>
        <div className="section-content">
          <p className="eyebrow">Who We Are</p>
          <h2>Business Expert Asia | Start, Invest & Grow</h2>
          <p>
            We provide end-to-end solutions for foreign companies and investors to establish their
            businesses in India, from incorporation and compliance to land, import-export, and growth.
          </p>
          <div className="stats">
            {stats.map((stat) => (
              <div key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="section-heading">
          <p className="eyebrow center">What We Offer</p>
          <h2>Comprehensive Solutions</h2>
          <p className="section-copy">End-to-end services tailored for business success in India.</p>
        </div>
        <ServiceGrid />
        <Link className="outline-btn" to="/services">View All Services</Link>
      </section>

      <section className="split-section">
        <div className="section-media">
          <img className="feature-image" src={images.india} alt="India opportunity landscape" />
        </div>
        <div className="section-content">
          <p className="eyebrow">Why India?</p>
          <h2>The Land of Opportunities</h2>
          <p>India has surpassed major economies to become a global powerhouse.</p>
          <ul>
            {whyIndia.map((item) => {
              const Icon = item.icon;
              return <li key={item.text}><Icon size={18} /> {item.text}</li>;
            })}
          </ul>
          <Link className="text-link" to="/who-we-are">Read Market Analysis +</Link>
        </div>
      </section>

      <section className="trusted dark-section">
        <div className="split-section trusted-inner">
          <div className="section-media">
            <img className="feature-image" src={images.investment} alt="Investment analysis table" />
          </div>
          <div className="section-content">
            <p className="eyebrow">Why Choose Us</p>
            <h2>Trusted by Investors Worldwide</h2>
            <p>Business Expert Asia is your single-window partner.</p>
            <ul>
              {strengths.map((item) => {
                const Icon = item.icon;
                return <li key={item.text}><Icon size={18} /> {item.text}</li>;
              })}
            </ul>
            <Link className="primary-btn" to="/contact">Start Your Journey</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
