import { CheckCircle2 } from "lucide-react";
import PageHero from "../components/PageHero";
import {
  childLearnings,
  parentReasons,
  programBrand,
  programImages,
  trainingModules
} from "../data/perfectManContent";

function ModulesPage() {
  return (
    <main>
      <PageHero
        crumb="Modules"
        eyebrow="Training Modules"
        title="Six Modules. One Complete Transformation."
        copy="Every module combines practical activities, small-group interaction, and individual attention to build real-world skills."
        image={programImages.child}
      />

      <section className="modules-section">
        <div className="section-heading">
          <p className="eyebrow center">What We Train</p>
          <h2>Training Modules</h2>
        </div>
        <div className="module-grid">
          {trainingModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <article className="module-card" key={module.title}>
                <div className="module-head">
                  <span className="module-number">{index + 1}</span>
                  <Icon size={26} />
                </div>
                <h3>{module.title}</h3>
                <ul>
                  {module.points.map((point) => (
                    <li key={point}>
                      <CheckCircle2 size={16} /> {point}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="split-section">
        <div className="section-content">
          <p className="eyebrow">Perfect Child | {programBrand.ageGroup}</p>
          <h2>What Your Child Will Learn</h2>
          <div className="child-learning-list">
            {childLearnings.map((item, index) => (
              <div className="child-learning" key={item.title}>
                <span className="module-number">{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="section-media">
          <div className="parent-card">
            <h3>Why Parents Choose This Program</h3>
            <ul>
              {parentReasons.map((reason) => (
                <li key={reason}>
                  <CheckCircle2 size={16} /> {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ModulesPage;
