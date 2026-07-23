import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Boxes,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock,
  Download,
  Gauge,
  GraduationCap,
  Infinity,
  Maximize2,
  Megaphone,
  MonitorSmartphone,
  Rocket,
  Settings,
  ShieldCheck,
  Timer,
  Users,
  type LucideIcon
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, formatDate, type Course } from "../api";
import { Img, VideoThumb } from "../components/Cards";
import Reveal from "../components/Reveal";
import { useSeo } from "../context/SiteContext";

const learnItems = [
  { icon: BriefcaseBusiness, title: "Business Strategy & Planning" },
  { icon: Megaphone, title: "Marketing & Brand Building" },
  { icon: Users, title: "Sales & Customer Acquisition" },
  { icon: Settings, title: "Operations & Automation" },
  { icon: CircleDollarSign, title: "Finance & Profit Optimization" },
  { icon: BarChart3, title: "Scale & Growth Strategies" }
];

const fallbackBenefits = [
  "Step-by-step actionable training",
  "Real-world case studies",
  "Worksheets & Templates",
  "Community Support",
  "Lifetime Access to Content",
  "Certificate of Completion"
];

const faqs = [
  "Who is this program for?",
  "How long will I get access?",
  "Is there a refund policy?",
  "Will I get a certificate?",
  "How can I contact support?"
];

function EnrollButton({ course, className = "" }: { course: Course; className?: string }) {
  const enrollTo = course.enrollLink || "/contact";
  if (course.enrollLink) {
    return (
      <a href={enrollTo} target="_blank" rel="noreferrer" className={className || "btn-primary"}>
        Enroll Now <ArrowRight className="size-4" />
      </a>
    );
  }

  return (
    <Link
      to="/contact"
      state={{ subject: `Training program enquiry: ${course.title}` }}
      className={className || "btn-primary"}
    >
      Enroll Now <ArrowRight className="size-4" />
    </Link>
  );
}

function HeroFact({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-bold text-white/90 sm:text-sm">
      <Icon className="size-4 text-emerald-300" /> {text}
    </span>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 border-slate-200 px-3 py-3 sm:border-r last:border-r-0">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
        <Icon className="size-3.5" />
      </span>
      <div>
        <p className="text-[11px] font-semibold text-slate-500">{label}</p>
        <p className="mt-0.5 text-xs font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}

function LearnTile({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex min-h-14 items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand ring-1 ring-brand/10">
        <Icon className="size-3.5" />
      </span>
      <p className="text-xs font-bold leading-snug text-ink sm:text-sm">{title}</p>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function CurriculumRow({
  item,
  index
}: {
  item: string;
  index: number;
}) {
  const lessonCount = index % 4 === 3 ? 5 : 4;
  const title = /^module\s+\d+/i.test(item.trim()) ? item : `Module ${index + 1}: ${item}`;

  return (
    <li className="program-curriculum-row">
      <div className="program-curriculum-row-inner">
        <span className="program-curriculum-number">{index + 1}</span>
        <span className="program-curriculum-name">{title}</span>
        <span className="program-curriculum-lessons">{lessonCount} Lessons</span>
        <ChevronDown className="program-curriculum-chevron" />
      </div>
    </li>
  );
}

export default function CourseDetailPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [missing, setMissing] = useState(false);
  useSeo(course?.title || "Training Program", course?.shortDescription);

  useEffect(() => {
    setCourse(null);
    setMissing(false);
    apiGet<Course>(`/courses/${slug}`)
      .then(setCourse)
      .catch(() => setMissing(true));
    window.scrollTo({ top: 0 });
  }, [slug]);

  const aboutParagraphs = useMemo(() => {
    const text = course?.description || course?.shortDescription || "";
    return text.split(/\n{2,}/).filter(Boolean).slice(0, 3);
  }, [course]);

  if (missing) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-bold">Training program not found</h1>
        <Link to="/training-programs" className="btn-primary mt-6">
          All training programs
        </Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="size-10 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
      </div>
    );
  }

  const heroImage = course.heroImage || course.image;
  const moduleCount = course.syllabus?.length || 0;
  const lessonsCount = moduleCount ? moduleCount * 4 : 32;
  const resourceCount = Math.max(course.highlights?.length || 0, 10);
  const priceText = course.priceLabel || course.priceClass || "Free";
  const benefits = (course.highlights?.length ? course.highlights : fallbackBenefits).slice(0, 6);
  const instructorName = course.instructorName || "Business Experts Team";
  const instructorRole = course.instructorRole || "Entrepreneur | Business Consultant";
  const instructorBio =
    course.instructorBio || "Helping businesses grow with proven strategies, tools, and mentorship.";

  return (
    <article className="program-detail-page">
      <section className="program-hero-wrap">
        <Reveal>
          <div className="program-hero">
            <div className="program-hero-media">
              <Img src={heroImage} alt={course.title} className="size-full object-cover opacity-75" />
            </div>
            <div className="program-hero-overlay" />
            <div className="pointer-events-none absolute bottom-6 right-7 hidden h-32 w-[38%] items-end gap-3 lg:flex">
              {[18, 34, 48, 62, 78, 96].map((height, index) => (
                <span
                  key={height}
                  className="w-9 rounded-t bg-brand/55 shadow-[0_0_28px_rgba(5,150,105,0.35)]"
                  style={{ height: `${height}%`, opacity: 0.35 + index * 0.08 }}
                />
              ))}
              <div className="absolute bottom-8 left-0 h-px w-full origin-left rotate-[-21deg] bg-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.75)]" />
            </div>

            <div className="program-hero-content">
              <div className="program-breadcrumb">
                <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <Link to="/" className="hover:text-brand">Home</Link>
                  <span>/</span>
                  <Link to="/training-programs" className="hover:text-brand">Training Programs</Link>
                  <span>/</span>
                  <span className="text-ink">{course.title}</span>
                </nav>
              </div>
              <span className="chip bg-brand text-white !px-3 !py-1">{course.category || "Training Program"}</span>
              <h1 className="mt-3 text-2xl font-bold leading-tight !text-white md:text-[34px]">{course.title}</h1>
              <p className="mt-3 max-w-lg text-sm font-medium leading-6 text-white/90">{course.shortDescription}</p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                <HeroFact icon={BookOpen} text={`${moduleCount || 8} Modules`} />
                <HeroFact icon={GraduationCap} text={`${lessonsCount}+ Lessons`} />
                <HeroFact icon={Boxes} text={`${resourceCount}+ Resources`} />
                <HeroFact icon={Award} text="Certificate" />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <EnrollButton course={course} className="btn-primary !rounded-lg !px-5 !py-2" />
                <Link
                  to="/contact"
                  state={{ subject: `Brochure request: ${course.title}` }}
                  className="btn-secondary !rounded-lg !border-white/25 !bg-white/10 !px-5 !py-2 !text-white backdrop-blur hover:!bg-white/15"
                >
                  <Download className="size-4" /> Download Brochure
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="program-shell program-main-wrap">
        <div className="program-main-card">
          <div className="grid border-b border-slate-200 sm:grid-cols-2 lg:grid-cols-5">
            <Metric icon={Timer} label="Program Duration" value={course.duration || "8 Weeks"} />
            <Metric icon={Clock} label="Weekly Commitment" value="3-4 Hours" />
            <Metric icon={Gauge} label="Skill Level" value={course.level || "All Levels"} />
            <Metric icon={BadgeCheck} label="Certificate" value="Yes, Included" />
            <Metric icon={Infinity} label="Access" value="Lifetime Access" />
          </div>

          <div className="program-card-body">
            <div className="program-content-grid">
              <div>
                <Reveal>
                  <h2 className="text-lg font-bold">About the Program</h2>
                  <div className="mt-4 space-y-3">
                    {aboutParagraphs.map((paragraph, index) => (
                      <p key={index} className="text-sm leading-6 text-slate-600">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <ul className="mt-5 grid gap-2.5">
                    {benefits.slice(0, 4).map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
                        <Check className="mt-0.5 size-4 shrink-0 rounded-full bg-brand text-white" /> {highlight}
                      </li>
                    ))}
                  </ul>
                </Reveal>

              </div>

              <aside className="lg:sticky lg:top-24 lg:self-start">
                <Reveal>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
                    <p className="text-sm font-bold text-ink">Program Fee</p>
                    <div className="mt-2 flex items-end gap-2.5">
                      <span className="font-display text-xl font-bold text-brand">{priceText}</span>
                      {course.priceLabel && course.priceClass ? (
                        <span className="chip bg-brand-soft pb-1 text-brand">{course.priceClass}</span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                      {course.startDate ? `Next batch starts ${formatDate(course.startDate)}.` : "Limited seats available."}
                    </p>
                    <EnrollButton course={course} className="btn-primary mt-4 w-full !rounded-lg !py-2" />
                    <ul className="mt-4 space-y-2.5 text-xs font-medium text-slate-600 sm:text-sm">
                      <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-brand" /> 30-Day Money Back Guarantee</li>
                      <li className="flex items-center gap-2"><Infinity className="size-4 text-brand" /> Lifetime Access</li>
                      <li className="flex items-center gap-2"><Award className="size-4 text-brand" /> Certificate of Completion</li>
                      <li className="flex items-center gap-2"><MonitorSmartphone className="size-4 text-brand" /> Access on Mobile & Desktop</li>
                    </ul>
                  </div>
                </Reveal>
              </aside>
            </div>

            <Reveal className="mt-8">
              <h2 className="text-lg font-bold">What You Will Learn</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {learnItems.map((item) => (
                  <LearnTile key={item.title} icon={item.icon} title={item.title} />
                ))}
              </div>
            </Reveal>

            {course.video ? (
              <Reveal className="mt-8">
                <h2 className="text-lg font-bold">Program Preview</h2>
                <VideoThumb
                  url={course.video}
                  title={`${course.title} intro`}
                  className="mt-6 aspect-video w-full overflow-hidden rounded-2xl shadow-lift"
                />
              </Reveal>
            ) : null}

            {course.syllabus?.length ? (
              <Reveal className="program-curriculum-block">
                <div className="program-curriculum-head">
                  <h2 className="program-curriculum-title">Program Curriculum</h2>
                  <span className="program-curriculum-expand">
                    Expand All <Maximize2 className="size-4" />
                  </span>
                </div>
                <ol className="program-curriculum-list">
                  {course.syllabus.map((item, index) => (
                    <CurriculumRow key={`${item}-${index}`} item={item} index={index} />
                  ))}
                </ol>
              </Reveal>
            ) : null}

            <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 lg:grid-cols-3">
              <Reveal>
                <div className="h-full rounded-xl border border-slate-200 bg-white p-5 text-center shadow-soft">
                  {course.instructorImage ? (
                    <Img
                      src={course.instructorImage}
                      alt={instructorName}
                      className="mx-auto size-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="mx-auto grid size-20 place-items-center rounded-full bg-brand-deep text-lg font-bold text-white">
                      {initials(instructorName)}
                    </span>
                  )}
                  <h2 className="mt-4 text-base font-bold">Your Instructor</h2>
                  <p className="mt-1.5 text-sm font-bold text-ink">{instructorName}</p>
                  <p className="mt-1 text-sm text-slate-500">{instructorRole}</p>
                  <p className="mt-3 text-sm leading-relaxed">{instructorBio}</p>
                </div>
              </Reveal>

              <Reveal delay={0.06}>
                <div className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
                  <h2 className="text-base font-bold">Program Benefits</h2>
                  <ul className="mt-4 space-y-2.5">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2.5 text-sm font-medium text-slate-700">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand" /> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
                  <h2 className="text-base font-bold">Frequently Asked Questions</h2>
                  <div className="mt-4 space-y-2">
                    {faqs.map((question) => (
                      <details key={question} className="group rounded-lg bg-slate-50">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-3.5 py-2.5 text-xs font-bold text-ink sm:text-sm">
                          {question}
                          <ChevronDown className="size-4 shrink-0 text-slate-400 transition group-open:rotate-180" />
                        </summary>
                        <p className="px-3.5 pb-3.5 text-sm leading-relaxed text-slate-600">
                          Contact our team and we will guide you with the right details for this program.
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="program-shell program-cta-wrap">
        <div className="flex flex-col gap-5 rounded-xl bg-[#071426] p-5 text-white shadow-lift md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand text-white">
              <Rocket className="size-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold !text-white">Ready to Accelerate Your Business Growth?</h2>
              <p className="mt-2 text-sm text-white/70">Join entrepreneurs who are already growing with us.</p>
            </div>
          </div>
          <EnrollButton course={course} className="btn-primary shrink-0 !rounded-lg !px-5 !py-2.5" />
        </div>
      </section>
    </article>
  );
}
