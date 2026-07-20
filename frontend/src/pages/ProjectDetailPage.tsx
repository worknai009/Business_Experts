import { ArrowLeft, CalendarCheck2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, formatDate, type Project } from "../api";
import { Img, ProjectLinks } from "../components/Cards";
import Reveal from "../components/Reveal";
import RichText from "../components/RichText";
import { useSeo } from "../context/SiteContext";

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [missing, setMissing] = useState(false);
  useSeo(project?.title || "Project", project?.shortDescription);

  useEffect(() => {
    setProject(null);
    setMissing(false);
    apiGet<Project>(`/projects/${slug}`)
      .then(setProject)
      .catch(() => setMissing(true));
  }, [slug]);

  if (missing) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <Link to="/projects" className="btn-primary mt-6">Back to projects</Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="size-10 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
      </div>
    );
  }

  return (
    <article>
      <section className="relative h-[52vh] min-h-[380px] overflow-hidden bg-ink md:h-[60vh]">
        <Img
          src={project.coverImage}
          alt={project.title}
          className="absolute inset-0 size-full object-cover opacity-70"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" aria-hidden />

        <div className="container-x absolute inset-x-0 bottom-0 pb-10 pt-16 text-white">
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white">
            <ArrowLeft className="size-4" /> All projects
          </Link>

          <Reveal className="mt-4">
            <div className="flex flex-wrap items-center gap-3">
              {project.logo ? <img src={project.logo} alt="" className="size-12 rounded-xl bg-white object-cover p-1" /> : null}
              <span className="chip bg-white/15 text-white backdrop-blur">{project.category || "Project"}</span>
              <span className="chip bg-white/15 text-white backdrop-blur">{project.status}</span>
              {project.completionDate ? (
                <span className="chip bg-white/15 text-white backdrop-blur">
                  <CalendarCheck2 className="size-3.5" /> {formatDate(project.completionDate)}
                </span>
              ) : null}
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight !text-white md:text-5xl">{project.title}</h1>
            <p className="mt-3 max-w-2xl text-lg text-white/85">{project.shortDescription}</p>
            <ProjectLinks project={project} className="mt-6" />
          </Reveal>
        </div>
      </section>

      <div className="section-pad">
        <div className="container-x max-w-4xl">
          {project.video ? (
            <Reveal>
              <div className="aspect-video overflow-hidden rounded-2xl shadow-lg">
                <iframe
                  src={project.video}
                  title={`${project.title} video`}
                  className="size-full"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </Reveal>
          ) : null}

          <Reveal className={project.video ? "mt-10" : ""}>
            <RichText text={project.fullDescription || project.shortDescription} />
          </Reveal>

          {project.technologies?.length ? (
            <Reveal className="mt-8">
              <h2 className="text-lg font-bold">Technologies</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="chip bg-brand-soft text-brand">{tech}</span>
                ))}
              </div>
            </Reveal>
          ) : null}

          {project.gallery?.length ? (
            <Reveal className="mt-10">
              <h2 className="text-lg font-bold">Gallery</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {project.gallery.map((image) => (
                  <Img key={image} src={image} alt={project.title} className="aspect-[3/2] w-full rounded-xl object-cover" />
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </article>
  );
}
