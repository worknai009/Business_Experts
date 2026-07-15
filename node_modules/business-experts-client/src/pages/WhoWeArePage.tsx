import PageHero from "../components/PageHero";
import { images, strengths, whyIndia } from "../data/siteContent";

function WhoWeArePage() {
  return (
    <main>
      <PageHero
        eyebrow="Who We Are"
        title="Your India Market Entry Partner"
        copy="We are a multidisciplinary advisory and execution team helping investors convert India opportunity into compliant, operational businesses."
        image={images.india}
      />

      <section className="split-section">
        <div className="section-media">
          <img className="feature-image" src={images.investment} alt="Investment planning" />
        </div>
        <div className="section-content">
          <p className="eyebrow">India Advantage</p>
          <h2>Why Investors Choose India</h2>
          <ul>
            {whyIndia.map((item) => {
              const Icon = item.icon;
              return <li key={item.text}><Icon size={18} /> {item.text}</li>;
            })}
          </ul>
        </div>
      </section>

      <section className="trusted dark-section">
        <div className="split-section trusted-inner">
          <div className="section-content">
            <p className="eyebrow">Our Strength</p>
            <h2>Clear Advice, Reliable Execution</h2>
            <ul>
              {strengths.map((item) => {
                const Icon = item.icon;
                return <li key={item.text}><Icon size={18} /> {item.text}</li>;
              })}
            </ul>
          </div>
          <div className="section-media">
            <img className="feature-image" src={images.boardroom} alt="Business advisory meeting" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default WhoWeArePage;
