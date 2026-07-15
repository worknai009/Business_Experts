import PageHero from "../components/PageHero";
import ServiceGrid from "../components/ServiceGrid";
import { images } from "../data/siteContent";

function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title="Everything You Need to Start and Scale in India"
        copy="From registrations and government approvals to land, FDI, import-export, factory setup, and growth advisory."
        image={images.factory}
      />
      <section className="services-section">
        <div className="section-heading">
          <p className="eyebrow center">Our Solutions</p>
          <h2>End-to-End Business Support</h2>
          <p className="section-copy">
            Choose focused support or a complete market-entry execution plan.
          </p>
        </div>
        <ServiceGrid />
      </section>
    </main>
  );
}

export default ServicesPage;
