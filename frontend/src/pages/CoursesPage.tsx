import { ArrowRight, Calendar, Clock, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, formatDate, type Course, type SuccessStory } from "../api";
import { Img, SuccessStoryCard } from "../components/Cards";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { useSeo } from "../context/SiteContext";

function CourseListItem({ course }: { course: Course }) {
  return (
    <Link
      to={`/training-programs/${course.slug}`}
      className="group grid grid-cols-[132px_1fr] overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-soft transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lift sm:grid-cols-[180px_1fr] lg:grid-cols-[210px_1fr]"
    >
      <div className="h-full min-h-36 overflow-hidden bg-mist">
        <Img
          src={course.image}
          alt={course.title}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex min-w-0 flex-col p-3 sm:p-4">
        <div className="flex flex-wrap gap-2">
          <span className="chip bg-brand-soft text-brand">{course.category || "Business Training"}</span>
          <span className="chip bg-slate-100 text-slate-600">{course.level}</span>
          {course.mode ? <span className="chip bg-slate-100 text-slate-600">{course.mode}</span> : null}
        </div>
        <h2 className="mt-2 text-base font-bold leading-tight transition group-hover:text-brand sm:text-lg">
          {course.title}
        </h2>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 sm:text-sm">
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
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
          {course.shortDescription}
        </p>
        {course.highlights?.length ? (
          <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
            {course.highlights.slice(0, 3).map((highlight) => (
              <span key={highlight} className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                {highlight}
              </span>
            ))}
          </div>
        ) : null}
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-brand sm:text-sm">
          Read More <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

const ALL = "All";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [category, setCategory] = useState(ALL);
  const [level, setLevel] = useState(ALL);
  const [duration, setDuration] = useState(ALL);
  const [query, setQuery] = useState("");
  useSeo("Training Programs", "Practical business training programs led by experienced founders, investors and experts.");

  useEffect(() => {
    apiGet<Course[]>("/courses").then(setCourses).catch(() => {});
    apiGet<SuccessStory[]>("/success-stories").then(setStories).catch(() => {});
  }, []);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(courses.map((course) => course.category).filter(Boolean)))],
    [courses]
  );
  const levels = useMemo(
    () => [ALL, ...Array.from(new Set(courses.map((course) => course.level).filter(Boolean)))],
    [courses]
  );
  const durations = useMemo(
    () => [ALL, ...Array.from(new Set(courses.map((course) => course.duration).filter(Boolean)))],
    [courses]
  );

  const filtersActive = category !== ALL || level !== ALL || duration !== ALL || query.trim() !== "";

  function clearFilters() {
    setCategory(ALL);
    setLevel(ALL);
    setDuration(ALL);
    setQuery("");
  }

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return courses.filter((course) => {
      if (category !== ALL && course.category !== category) return false;
      if (level !== ALL && course.level !== level) return false;
      if (duration !== ALL && course.duration !== duration) return false;
      if (!normalized) return true;
      return [course.title, course.category, course.shortDescription, course.description, ...(course.highlights || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [category, courses, duration, level, query]);

  return (
    <>
      <section className="bg-ink py-10 text-white md:py-14">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="chip bg-white/10 text-white/85">Training Programs</span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight !text-white md:text-4xl">
              Explore Our Latest Training Programs
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              Hands-on programs designed by founders, investors and experts to help you build and grow.
            </p>
            <label className="mt-6 flex max-w-xl overflow-hidden rounded-xl bg-white shadow-lift">
              <span className="grid w-12 shrink-0 place-items-center text-slate-400">
                <Search className="size-5" />
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 px-1 py-3 text-sm text-ink outline-none"
                placeholder="Search training programs..."
              />
              <span className="grid shrink-0 place-items-center bg-brand px-5 text-sm font-bold text-white">
                Search
              </span>
            </label>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <select
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                className="rounded-lg border-0 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white outline-none [&>option]:text-ink"
              >
                {levels.map((item) => (
                  <option key={item} value={item}>
                    {item === ALL ? "All Levels" : item}
                  </option>
                ))}
              </select>
              <select
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="rounded-lg border-0 bg-white/10 px-3.5 py-2 text-sm font-semibold text-white outline-none [&>option]:text-ink"
              >
                {durations.map((item) => (
                  <option key={item} value={item}>
                    {item === ALL ? "Any Duration" : item}
                  </option>
                ))}
              </select>
              {filtersActive ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-semibold text-white/70 underline-offset-2 hover:text-white hover:underline"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad !pt-10">
        <div className="container-x max-w-3xl">
          <h2 className="text-xl font-bold">All Training Programs</h2>
          {categories.length > 2 ? (
            <div className="mb-8 mt-5 flex flex-wrap gap-2">
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
          <div className="mt-6 space-y-4">
            {visible.map((course, index) => (
              <Reveal key={course._id} delay={Math.min(index, 4) * 0.06}>
                <CourseListItem course={course} />
              </Reveal>
            ))}
          </div>
          {!visible.length ? <p className="py-12 text-center text-slate-500">No training programs found.</p> : null}
        </div>
      </section>

      {stories.length ? (
        <section className="section-pad bg-mist">
          <div className="container-x">
            <SectionHeading
              eyebrow="Success Stories"
              title="Where our trainees are today"
              subtitle="Real outcomes from founders and professionals who went through our training programs."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
              {stories.map((story, index) => (
                <Reveal key={story._id} delay={(index % 3) * 0.08}>
                  <SuccessStoryCard story={story} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
