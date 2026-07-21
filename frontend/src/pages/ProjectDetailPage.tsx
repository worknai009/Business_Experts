import { ArrowLeft, CalendarCheck2, CheckCircle2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, apiPost, formatDate, toEmbedUrl, type Project } from "../api";
import { Img, ProjectLinks } from "../components/Cards";
import Reveal from "../components/Reveal";
import RichText from "../components/RichText";
import { useSeo } from "../context/SiteContext";

const INQUIRY_ROLES = ["Investor", "Partner", "Other"] as const;
type InquiryRole = (typeof INQUIRY_ROLES)[number];
const ROLE_DESCRIPTOR: Record<InquiryRole, string> = {
  Investor: "an investor",
  Partner: "a partner",
  Other: "an interested party"
};

function ProjectInquiryForm({ project }: { project: Project }) {
  const [role, setRole] = useState<InquiryRole>("Investor");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  function update(field: keyof typeof form) {
    return (event: { target: { value: string } }) => setForm((value) => ({ ...value, [field]: event.target.value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    try {
      await apiPost("/contact", {
        ...form,
        type: "contact",
        company: role,
        subject: `Project inquiry: ${project.title} — ${role}`
      });
      setStatus("done");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
        <h2 className="mt-3 text-lg font-bold">Inquiry sent</h2>
        <p className="mt-1.5 text-sm">Thanks for your interest in {project.title} — our team will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <h2 className="text-lg font-bold">Interested in {project.title}?</h2>
      <p className="mt-1 text-sm text-slate-500">Send an inquiry as an investor, partner, or something else.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {INQUIRY_ROLES.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setRole(option)}
            className={`chip !px-4 !py-2 transition ${
              role === option ? "bg-brand text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input required placeholder="Full name *" className="input" value={form.name} onChange={update("name")} />
          <input type="email" required placeholder="Email *" className="input" value={form.email} onChange={update("email")} />
        </div>
        <input placeholder="Phone" className="input" value={form.phone} onChange={update("phone")} />
        <textarea
          rows={4}
          placeholder={`Tell us about your interest as ${ROLE_DESCRIPTOR[role]}…`}
          className="input resize-none"
          value={form.message}
          onChange={update("message")}
        />
        {status === "error" ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60">
          {status === "sending" ? "Sending…" : `Send ${role} Inquiry`}
        </button>
      </form>
    </div>
  );
}

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
                  src={toEmbedUrl(project.video)}
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

          <Reveal className="mt-10">
            <ProjectInquiryForm project={project} />
          </Reveal>
        </div>
      </div>
    </article>
  );
}
