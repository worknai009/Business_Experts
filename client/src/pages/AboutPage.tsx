import { ArrowRight } from "lucide-react";
import PageHero from "../components/PageHero";
import {
  programBrand,
  programConcept,
  programImages,
  trainingModel,
  trainingModelNote
} from "../data/perfectManContent";

function AboutPage() {
  return (
    <main>
      <PageHero
        crumb="About"
        eyebrow={programBrand.company}
        title="About the Program"
        copy={programConcept.general}
        image={programImages.concept}
      />

      <section className="split-section">
        <div className="section-media">
          <img className="feature-image" src={programImages.child} alt="Children learning together" />
          <div className="media-accent" aria-hidden="true" />
        </div>
        <div className="section-content">
          <p className="eyebrow">Program Concept</p>
          <h2>{programBrand.tagline}</h2>
          <p>{programConcept.child}</p>
          <p>{programConcept.childApproach}</p>
          <p className="age-badge">For Children &amp; Young Adults | {programBrand.ageGroup}</p>
        </div>
      </section>

      <section className="training-model dark-section">
        <div className="section-heading">
          <p className="eyebrow">Training Model</p>
          <h2>Our Training Method</h2>
        </div>
        <div className="model-flow">
          {trainingModel.map((step, index) => {
            const Icon = step.icon;
            return (
              <div className="model-step-wrap" key={step.label}>
                <div className="model-step">
                  <span className="model-icon"><Icon size={26} /></span>
                  <strong>{step.label}</strong>
                </div>
                {index < trainingModel.length - 1 && <ArrowRight className="model-arrow" size={22} />}
              </div>
            );
          })}
        </div>
        <p className="model-note">{trainingModelNote}</p>
      </section>
    </main>
  );
}

export default AboutPage;
