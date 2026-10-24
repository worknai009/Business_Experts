import { Brain, Database, Server, Cpu, Globe, ShieldCheck } from "lucide-react";

const tech = [
  [Brain, "OpenAI", "AI Intelligence"],
  [Server, "Spring Boot", "Backend API"],
  [Cpu, "FastAPI", "AI Engine"],
  [Globe, "React", "Frontend"],
  [Database, "MySQL", "Database"],
  [ShieldCheck, "Tailwind CSS", "Modern UI"],
];

export default function TrustedTech() {
  return (
    <section className="reference-section reference-tech" id="solutions">
      <div className="reference-section-inner">
        <div className="reference-section-heading">
          <p className="reference-section-eyebrow">POWERED BY MODERN TECHNOLOGIES</p>
          <h2>Built With Industry-Leading Tools</h2>
          <p>Our platform combines modern web technologies with AI to provide fast, reliable, and insightful business analysis.</p>
        </div>
        <div className="reference-tech-grid">
          {tech.map(([Icon, title, desc]) => (
            <article className="reference-tech-card" key={title}>
              <div className="reference-tech-icon"><Icon size={22}/></div>
              <div><h3>{title}</h3><p>{desc}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
