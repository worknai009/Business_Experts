import { useEffect, useMemo, useState } from "react";
import { apiGet, type Project } from "../api";
import { ProjectCard } from "../components/Cards";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { useSeo } from "../context/SiteContext";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [category, setCategory] = useState("All");
  useSeo("Projects", "Explore the platforms and products built by our business ecosystem.");

  useEffect(() => {
    apiGet<Project[]>("/projects").then(setProjects).catch(() => {});
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category).filter(Boolean)))],
    [projects]
  );
  const visible = category === "All" ? projects : projects.filter((project) => project.category === category);

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Work that moves the ecosystem forward"
        subtitle="Platforms, products and initiatives we have designed, built and shipped."
      />
      <section className="section-pad">
        <div className="container-x">
          {categories.length > 2 ? (
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`chip !px-4 !py-2 transition ${
                    category === item ? "bg-brand text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {visible.map((project, index) => (
              <Reveal key={project._id} delay={(index % 3) * 0.08}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
          {!visible.length ? <p className="text-center text-slate-500">No projects published yet.</p> : null}
        </div>
      </section>
    </>
  );
}
