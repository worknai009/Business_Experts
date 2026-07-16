import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { useProgramSessions, useSiteContent } from "../data/apiContent";
import { programFormats } from "../data/perfectManContent";

function ProgramsPage() {
  const { programBrand, programImages } = useSiteContent();
  const sessions = useProgramSessions();

  return (
    <main>
      <PageHero
        crumb="Sessions"
        eyebrow={`${programBrand.name} & ${programBrand.childName}`}
        title="Our Sessions"
        copy="Choose the pace that suits your child - daily sessions, weekends, a crash program, or a complete transformation journey."
        image={programImages.hero}
      />

      <section className="services-section">
        <div className="section-heading">
          <p className="eyebrow center">Session Structure</p>
          <h2>Flexible Formats for Every Schedule</h2>
        </div>
        <div className="format-grid">
          {programFormats.map((format) => {
            const Icon = format.icon;
            return (
              <div className="format-card" key={format.title}>
                <Icon size={30} />
                <h3>{format.title}</h3>
                <p>{format.schedule}</p>
              </div>
            );
          })}
        </div>

        <div className="section-heading program-options-heading">
          <p className="eyebrow center">Short-Duration Session Options</p>
          <h2>Pick the Right Session</h2>
        </div>
        <div className="program-table-wrap">
          <table className="program-table">
            <thead>
              <tr>
                <th>Session</th>
                <th>Duration</th>
                <th>Suitable For</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((option) => (
                <tr key={option._id || option.title}>
                  <td>{option.title}</td>
                  <td>{option.duration}</td>
                  <td>{option.suitableFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="hero-actions center-actions">
          <Link to="/admissions" className="primary-btn">
            View Admission Details
          </Link>
          <Link to="/modules" className="outline-btn">
            Explore Training Modules
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ProgramsPage;
