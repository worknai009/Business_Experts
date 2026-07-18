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
    <article className="section-pad">
      <div className="container-x max-w-4xl">
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          <ArrowLeft className="size-4" /> All projects
        </Link>

        <Reveal className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            {project.logo ? <img src={project.logo} alt="" className="size-12 rounded-xl object-cover" /> : null}
            <span className="eyebrow">{project.category || "Project"}</span>
            <span className="chip bg-slate-100 text-slate-600">{project.status}</span>
            {project.completionDate ? (
              <span className="chip bg-emerald-50 text-emerald-600">
                <CalendarCheck2 className="size-3.5" /> {formatDate(project.completionDate)}
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{project.title}</h1>
          <p className="mt-3 text-lg">{project.shortDescription}</p>
          <ProjectLinks project={project} className="mt-6" />
        </Reveal>

        <Reveal className="mt-10">
          <Img src={project.coverImage} alt={project.title} className="aspect-video w-full rounded-2xl object-cover shadow-xl" />
        </Reveal>

        {project.video ? (
          <Reveal className="mt-8">
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

        <Reveal className="mt-10">
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
    </article>
  );
}
