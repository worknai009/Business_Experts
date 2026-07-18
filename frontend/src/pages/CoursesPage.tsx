import { useEffect, useMemo, useState } from "react";
import { apiGet, type Course } from "../api";
import { CourseCard } from "../components/Cards";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { useSeo } from "../context/SiteContext";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [category, setCategory] = useState("All");
  useSeo("Training Programs", "Practical business training programs led by experienced founders, investors and experts.");

  useEffect(() => {
    apiGet<Course[]>("/courses").then(setCourses).catch(() => {});
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(courses.map((course) => course.category).filter(Boolean)))],
    [courses]
  );
  const visible = category === "All" ? courses : courses.filter((course) => course.category === category);

  return (
    <>
      <PageHero
        eyebrow="Training Programs"
        title="Business training that actually works"
        subtitle="Hands-on programs designed by founders, investors and experts — learn what it really takes to build and grow."
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
            {visible.map((course, index) => (
              <Reveal key={course._id} delay={(index % 3) * 0.08}>
                <CourseCard course={course} />
              </Reveal>
            ))}
          </div>
          {!visible.length ? <p className="text-center text-slate-500">No training programs published yet.</p> : null}
        </div>
      </section>
    </>
  );
}
