import PageHero from "../components/PageHero";
import { images, stats } from "../data/siteContent";

function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About Us"
        title="Built for Global Investors Entering India"
        copy="We combine legal, financial, real estate, compliance, and operating support so foreign businesses can enter India with clarity and confidence."
        image={images.handshake}
      />

      <section className="split-section">
        <div className="section-media">
          <img className="feature-image" src={images.team} alt="Consulting team discussion" />
        </div>
        <div className="section-content">
          <p className="eyebrow">Our Approach</p>
          <h2>Practical Strategy, Local Execution</h2>
          <p>
            We work as your on-ground partner from the first market entry decision to entity setup,
            approvals, factory readiness, operational vendor coordination, and expansion planning.
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
    </main>
  );
}

export default AboutPage;
