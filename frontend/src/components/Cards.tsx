import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Calendar, Check, Clock, ExternalLink, Github, MapPin, PlayCircle, Quote, Star, Users, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  formatDate,
  toEmbedUrl,
  toVideoThumb,
  toWatchUrl,
  type BlogPost,
  type Course,
  type EventItem,
  type Project,
  type SuccessStory,
  type Testimonial
} from "../api";

// Fixed-size clickable video preview — opens the video on its own site (YouTube/Vimeo)
// in a new tab instead of embedding it inline, so a disabled-embedding video (or any
// other iframe quirk) can never blow up the layout.
export function VideoThumb({ url, title, className }: { url: string; title: string; className?: string }) {
  const thumb = toVideoThumb(url);
  return (
    <a
      href={toWatchUrl(url)}
      target="_blank"
      rel="noreferrer"
      className={`group relative block overflow-hidden bg-ink ${className || ""}`}
      aria-label={`Watch ${title} on YouTube`}
    >
      {thumb ? (
        <img src={thumb} alt={title} loading="lazy" className="size-full object-cover opacity-80 transition group-hover:opacity-100" />
      ) : null}
      <span className="absolute inset-0 grid place-items-center bg-ink/30 transition group-hover:bg-ink/40">
        <PlayCircle className="size-16 text-white drop-shadow" />
      </span>
    </a>
  );
}

export function VideoModal({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] grid place-items-center bg-ink/85 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <X className="size-5" />
        </button>
        <motion.div
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <iframe src={toEmbedUrl(url)} title={title} className="size-full" allowFullScreen loading="lazy" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function Img({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  if (!src) {
    return <div className={`bg-gradient-to-br from-brand-soft to-slate-100 ${className || ""}`} aria-hidden />;
  }
  return <img src={src} alt={alt} loading="lazy" className={className} />;
}

// Fits tall/irregular source images (e.g. full-page screenshots) fully inside a fixed frame instead of cropping into them.
export function FramedImg({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  if (!src) {
    return <div className={`bg-gradient-to-br from-brand-soft to-slate-100 ${className || ""}`} aria-hidden />;
  }
  return (
    <div className={`grid place-items-center bg-slate-100 ${className || ""}`}>
      <img src={src} alt={alt} loading="lazy" className="size-full object-contain" />
    </div>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`size-4 ${value <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
        />
      ))}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-600",
  "In Progress": "bg-amber-50 text-amber-600",
  Planned: "bg-slate-100 text-slate-600"
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="card group flex h-full flex-col">
      <div className="relative aspect-[3/2] shrink-0 overflow-hidden">
        <FramedImg
          src={project.coverImage}
          alt={project.title}
          className="size-full transition duration-500 group-hover:scale-105"
        />
        <span className={`chip absolute left-4 top-4 ${STATUS_STYLES[project.status] || STATUS_STYLES.Planned}`}>
          {project.status}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand">{project.category}</span>
        <h3 className="mt-2 line-clamp-1 text-lg font-bold transition group-hover:text-brand">{project.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed">{project.shortDescription}</p>
        {project.technologies?.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="chip bg-slate-100 text-slate-600">{tech}</span>
            ))}
          </div>
        ) : null}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
          View case study <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function ProjectLinks({ project, className }: { project: Project; className?: string }) {
  if (!project.liveUrl && !project.githubUrl) return null;
  return (
    <div className={`flex flex-wrap gap-3 ${className || ""}`}>
      {project.liveUrl ? (
        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary !py-2.5">
          <ExternalLink className="size-4" /> Live Preview
        </a>
      ) : null}
      {project.githubUrl ? (
        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary !py-2.5">
          <Github className="size-4" /> Source Code
        </a>
      ) : null}
    </div>
  );
}

export function CourseCard({ course }: { course: Course }) {
  const enrollTo = course.enrollLink || "/contact";
  const external = Boolean(course.enrollLink);
  const [showVideo, setShowVideo] = useState(false);
  return (
    <div className="card group flex flex-col">
      <div className="relative aspect-[3/2] overflow-hidden">
        <Img
          src={course.image}
          alt={course.title}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="chip absolute left-4 top-4 bg-brand text-white">{course.level}</span>
        {course.mode ? (
          <span className="chip absolute right-4 top-4 bg-white/90 text-slate-700 backdrop-blur">{course.mode}</span>
        ) : null}
        {course.video ? (
          <button
            type="button"
            onClick={() => setShowVideo(true)}
            className="absolute inset-0 grid place-items-center bg-ink/20 opacity-0 transition group-hover:opacity-100"
            aria-label={`Watch intro video for ${course.title}`}
          >
            <PlayCircle className="size-14 text-white drop-shadow" />
          </button>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand">
          {course.category || "Business Training"}
        </span>
        <h3 className="mt-2 text-lg font-bold transition group-hover:text-brand">{course.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed line-clamp-3">{course.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
          {course.duration ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-brand" /> {course.duration}
            </span>
          ) : null}
          {course.startDate ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4 text-brand" /> Next batch: {formatDate(course.startDate)}
            </span>
          ) : null}
        </div>
        {course.highlights?.length ? (
          <ul className="mt-4 space-y-1.5">
            {course.highlights.slice(0, 3).map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" /> {highlight}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="font-display text-xl font-bold text-ink">
            {course.priceLabel || (course.price ? `₹${course.price.toLocaleString("en-IN")}` : "Free")}
          </span>
          <div className="flex items-center gap-3">
            {course.video ? (
              <button type="button" onClick={() => setShowVideo(true)} className="btn-ghost !py-2">
                <PlayCircle className="size-4" /> Watch Intro
              </button>
            ) : null}
            {external ? (
              <a href={enrollTo} target="_blank" rel="noreferrer" className="btn-ghost !py-2">
                Enroll Now <ArrowUpRight className="size-4" />
              </a>
            ) : (
              <Link to="/contact" state={{ subject: `Training program enquiry: ${course.title}` }} className="btn-ghost !py-2">
                Enroll Now <ArrowUpRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
      {showVideo && course.video ? (
        <VideoModal url={course.video} title={`${course.title} intro`} onClose={() => setShowVideo(false)} />
      ) : null}
    </div>
  );
}

export function EventCard({ event }: { event: EventItem }) {
  const date = event.date ? new Date(event.date) : null;
  return (
    <div className="card group flex flex-col md:flex-row">
      <div className="relative aspect-[3/2] shrink-0 overflow-hidden md:aspect-auto md:w-2/5">
        <Img src={event.banner} alt={event.title} className="size-full object-cover transition duration-500 group-hover:scale-105" />
        {date ? (
          <div className="absolute left-4 top-4 overflow-hidden rounded-xl bg-white text-center shadow-lg">
            <div className="bg-brand px-4 py-1 text-[11px] font-bold uppercase text-white">
              {date.toLocaleString("en", { month: "short" })}
            </div>
            <div className="px-4 py-1.5 font-display text-xl font-bold text-ink">{date.getDate()}</div>
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <h3 className="text-xl font-bold">{event.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed line-clamp-3">{event.description}</p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
          {date ? (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4 text-brand" /> {formatDate(event.date)} {event.time ? `· ${event.time}` : ""}
            </span>
          ) : null}
          {event.venue ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4 text-brand" /> {event.venue}
            </span>
          ) : null}
          {event.seats ? (
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4 text-brand" /> {event.seats} seats
            </span>
          ) : null}
        </div>
        {event.registrationLink ? (
          <a href={event.registrationLink} target="_blank" rel="noreferrer" className="btn-primary mt-5 self-start !py-2.5">
            Register Now <ArrowUpRight className="size-4" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="card relative flex h-full flex-col p-7">
      <Quote className="absolute right-6 top-6 size-10 text-brand/10" aria-hidden />
      <Stars rating={testimonial.rating} />
      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">“{testimonial.review}”</p>
      {testimonial.videoUrl ? (
        <a
          href={testimonial.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
        >
          <PlayCircle className="size-4" /> Watch video review
        </a>
      ) : null}
      <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
        <Img src={testimonial.image} alt={testimonial.name} className="size-11 rounded-full object-cover" />
        <div>
          <p className="text-sm font-bold text-ink">{testimonial.name}</p>
          <p className="text-xs text-slate-500">
            {[testimonial.role, testimonial.company].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SuccessStoryCard({ story }: { story: SuccessStory }) {
  const [showVideo, setShowVideo] = useState(false);
  return (
    <div className="card group flex h-full flex-col">
      <div className="relative aspect-[3/2] shrink-0 overflow-hidden">
        <Img
          src={story.image}
          alt={story.name}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        {story.video ? (
          <button
            type="button"
            onClick={() => setShowVideo(true)}
            className="absolute inset-0 grid place-items-center bg-ink/20 opacity-0 transition group-hover:opacity-100"
            aria-label={`Watch ${story.name}'s success story`}
          >
            <PlayCircle className="size-14 text-white drop-shadow" />
          </button>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {story.trainingProgram ? (
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">{story.trainingProgram}</span>
        ) : null}
        <h3 className="mt-2 text-lg font-bold">{story.name}</h3>
        {story.achievement ? (
          <p className="mt-1 text-sm font-semibold text-emerald-600">{story.achievement}</p>
        ) : null}
        <p className="mt-2 flex-1 text-sm leading-relaxed line-clamp-4">{story.story}</p>
        {story.video ? (
          <button
            type="button"
            onClick={() => setShowVideo(true)}
            className="btn-ghost mt-4 self-start !py-2"
          >
            <PlayCircle className="size-4" /> Watch Success Story
          </button>
        ) : null}
      </div>
      {showVideo && story.video ? (
        <VideoModal url={story.video} title={`${story.name}'s success story`} onClose={() => setShowVideo(false)} />
      ) : null}
    </div>
  );
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link to={`/blog/${post.slug}`} className="card group flex flex-col">
      <div className="aspect-[3/2] overflow-hidden">
        <Img src={post.banner} alt={post.title} className="size-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="chip bg-brand-soft text-brand">{post.category || "Insights"}</span>
          <span>{formatDate(post.publishDate)}</span>
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug transition group-hover:text-brand">{post.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
          Read article <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
