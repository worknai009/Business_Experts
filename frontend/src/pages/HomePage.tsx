import {
  ArrowRight,
  Award,
  BarChart3,
  Clock,
  Cog,
  Lightbulb,
  Mail,
  Phone,
  Target,
  TrendingUp,
  Users
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { apiGet, type HomeData, type Service } from "../api";
import {
  BlogCard,
  CourseCard,
  EventCard,
  Img,
  ProjectCard,
  TestimonialCard
} from "../components/Cards";
import FaqList from "../components/FaqList";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { useSeo } from "../context/SiteContext";
import Hero from "../home/Hero";

const WHY_US = [
  {
    icon: TrendingUp,
    title: "Result-Driven Strategies",
    description: "Every plan is built around measurable outcomes for your business."
  },
  {
    icon: Award,
    title: "Experienced Team",
    description: "Seasoned experts, mentors and investors guiding you at every step."
  },
  {
    icon: Lightbulb,
    title: "Creative & Innovative Ideas",
    description: "Fresh thinking that helps your brand stand out in the market."
  },
  {
    icon: Clock,
    title: "Timely Delivery & Transparent Pricing",
    description: "Clear commitments, honest pricing and on-time execution — always."
  }
];

const PROCESS = [
  { icon: Users, title: "Understand Your Needs" },
  { icon: Target, title: "Plan Strategically" },
  { icon: Cog, title: "Execute Effectively" },
  { icon: BarChart3, title: "Deliver Results" }
];

function Grid({ children, cols = 3 }: { children: ReactNode; cols?: 2 | 3 }) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${cols === 3 ? "lg:grid-cols-3" : ""} md:gap-8`}>{children}</div>
  );
}

function ViewAll({ to, label }: { to: string; label: string }) {
  return (
    <Reveal className="mt-10 text-center">
      <Link to={to} className="btn-secondary">
        {label} <ArrowRight className="size-4" />
      </Link>
    </Reveal>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <Link to={`/services/${service.slug}`} className="card group flex h-full flex-col">
      <div className="aspect-[16/9] overflow-hidden">
        <Img
          src={service.image}
          alt={service.title}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="relative flex flex-1 flex-col p-4">
        <span className="absolute -top-5 left-4 grid size-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-glow ring-4 ring-white">
          <Icon name={service.icon} className="size-4" />
        </span>
        <h3 className="mt-3.5 text-base font-bold transition group-hover:text-brand">{service.title}</h3>
        <p className="mt-1.5 flex-1 text-xs leading-relaxed">{service.description}</p>
        {service.features?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {service.features.map((feature) => (
              <span key={feature} className="chip !px-2 !py-0.5 !text-[11px] bg-brand-soft text-brand">{feature}</span>
            ))}
          </div>
        ) : null}
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand">
          Learn more <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function ServicesCarousel({ services }: { services: Service[] }) {
  const [start, setStart] = useState(0);
  const perPage = 3;
  const canSlide = services.length > perPage;

  const visible = useMemo(() => {
    if (!canSlide) return services.slice(0, perPage);
    return Array.from({ length: perPage }, (_, offset) => services[(start + offset) % services.length]);
  }, [canSlide, services, start]);

  return (
    <>
      <div className="flex items-end justify-between gap-6">
        <SectionHeading
          eyebrow="What We Do"
          title="Services built for every stage of growth"
          subtitle="From first-time founders to established enterprises and community members — the ecosystem supports everyone."
          align="left"
        />
        {canSlide ? (
          <button
            type="button"
            onClick={() => setStart((current) => (current + 1) % services.length)}
            aria-label="Show next services"
            className="mb-1 hidden size-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-brand shadow-soft transition hover:bg-brand hover:text-white sm:flex"
          >
            <ArrowRight className="size-5" />
          </button>
        ) : null}
      </div>
      <div className="overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={start}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <Grid>
              {visible.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </Grid>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  useSeo();

  useEffect(() => {
    apiGet<HomeData>("/home").then(setData).catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <div className="size-10 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
      </div>
    );
  }

  const { settings } = data;

  const sections: Record<string, ReactNode> = {
    services: data.services.length ? (
      <section key="services" id="services" className="section-pad bg-mist">
        <div className="container-x">
          <ServicesCarousel services={data.services} />
        </div>
      </section>
    ) : null,

    whyus: (
      <section key="whyus" className="section-pad">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Smart solutions for a better tomorrow"
            subtitle="We combine strategy, creativity and execution to help your business grow with confidence."
          />
          <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {WHY_US.map((item, index) => (
              <Reveal key={item.title} delay={(index % 4) * 0.08}>
                <div className="card h-full p-7 text-center">
                  <span className="mx-auto grid size-16 place-items-center rounded-full border-2 border-brand/70 bg-brand-soft text-brand ring-4 ring-brand/10">
                    <item.icon className="size-7" />
                  </span>
                  <h3 className="mt-5 text-base font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-brand to-brand-deep px-9 py-3.5 font-display text-lg font-bold text-white shadow-glow">
              Your Growth, Our Commitment!
            </span>
          </Reveal>

          <Reveal className="mt-14">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-deep via-brand to-brand-dark px-8 py-14 text-center text-white shadow-lift md:px-16">
              <div className="bg-dots pointer-events-none absolute inset-0 opacity-60" aria-hidden />
              <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-white/10 blur-3xl" aria-hidden />
              <div className="pointer-events-none absolute -bottom-24 -right-20 size-80 rounded-full bg-brand-deep/60 blur-3xl" aria-hidden />
              <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100/80">
                We Help Businesses
              </p>
              <h3 className="relative mt-3 font-display text-3xl font-bold !text-white md:text-[2.6rem]">
                Grow, <span className="text-amber-300">Connect</span> & Succeed
              </h3>
              <p className="relative mt-3 text-emerald-100/90">With smart strategies and creative solutions</p>
              <div className="relative mx-auto mt-11 grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4">
                {PROCESS.map((step, index) => (
                  <Reveal key={step.title} delay={index * 0.08}>
                    <div className="flex flex-col items-center">
                      <span className="grid size-16 place-items-center rounded-full bg-white text-brand-deep shadow-lg ring-4 ring-amber-300/60">
                        <step.icon className="size-7" />
                      </span>
                      <p className="mt-3.5 text-xs font-bold uppercase tracking-wide text-white">{step.title}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
              <p className="relative mt-11 font-display text-xl italic text-amber-300">
                Together, We Build a Better Future!
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    ),

    projects: data.projects.length ? (
      <section key="projects" className="section-pad">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our Work"
            title="Projects powering the ecosystem"
            subtitle="Platforms and products we have built to connect businesses, investors and communities."
          />
          <Grid>
            {data.projects.slice(0, 3).map((project, index) => (
              <Reveal key={project._id} delay={(index % 3) * 0.08} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </Grid>
          <ViewAll to="/projects" label="View all projects" />
        </div>
      </section>
    ) : null,

    courses: data.courses?.length ? (
      <section key="courses" className="section-pad">
        <div className="container-x">
          <SectionHeading
            eyebrow="Business Training"
            title="Training programs that turn ideas into businesses"
            subtitle="Practical training programs led by founders, investors and industry experts — built for real-world results."
          />
          <Grid>
            {data.courses.slice(0, 3).map((course, index) => (
              <Reveal key={course._id} delay={(index % 3) * 0.08}>
                <CourseCard course={course} />
              </Reveal>
            ))}
          </Grid>
          <ViewAll to="/training-programs" label="Explore all training programs" />
        </div>
      </section>
    ) : null,

    events: data.events.length ? (
      <section key="events" className="section-pad">
        <div className="container-x">
          <SectionHeading
            eyebrow="Upcoming Events"
            title="Meet the ecosystem in person"
            subtitle="Summits, meetups and workshops where founders, investors and professionals connect."
          />
          <div className="mx-auto max-w-4xl space-y-6">
            {data.events.map((event, index) => (
              <Reveal key={event._id} delay={index * 0.08}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
          <ViewAll to="/events" label="See all events" />
        </div>
      </section>
    ) : null,

    memberships: (
      <section key="memberships" className="section-pad bg-mist">
        <div className="container-x">
          <Reveal>
            <div className="gradient-border mx-auto max-w-4xl rounded-[2rem] p-10 text-center shadow-lift md:p-14">
              <span className="eyebrow">
                <span className="size-1 rounded-full bg-brand" />
                Memberships
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl text-balance text-3xl font-bold tracking-tight md:text-[2.4rem] md:leading-[1.15]">
                Become a member of the ecosystem
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-500 md:text-lg">
                Start with a simple inquiry — our team will contact you personally and guide you through
                the membership that fits you best.
              </p>
              {data.memberships.length ? (
                <div className="mt-7 flex flex-wrap justify-center gap-2">
                  {data.memberships.map((plan) => (
                    <span key={plan._id} className="chip border border-slate-200 bg-white text-slate-600">
                      {plan.name}
                    </span>
                  ))}
                </div>
              ) : null}
              <Link to="/memberships" className="btn-primary mt-9 !rounded-2xl !px-9 !py-4 !text-base">
                Apply for Membership <ArrowRight className="size-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    ),

    testimonials: data.testimonials.length ? (
      <section key="testimonials" className="section-pad">
        <div className="container-x">
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by founders, businesses & investors"
            subtitle="Real results from members across the ecosystem."
          />
          <Grid>
            {data.testimonials.map((testimonial, index) => (
              <Reveal key={testimonial._id} delay={(index % 3) * 0.08} className="h-full">
                <TestimonialCard testimonial={testimonial} />
              </Reveal>
            ))}
          </Grid>
        </div>
      </section>
    ) : null,

    gallery: data.gallery.length ? (
      <section key="gallery" className="section-pad bg-mist">
        <div className="container-x">
          <SectionHeading
            eyebrow="Gallery"
            title="Moments from the ecosystem"
            subtitle="Highlights from our summits, workshops and community programs."
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {data.gallery.slice(0, 8).map((item, index) => (
              <Reveal key={item._id} delay={(index % 4) * 0.06}>
                <Link to="/gallery" className="group block overflow-hidden rounded-2xl">
                  <Img
                    src={item.thumbnail || item.url}
                    alt={item.title || "Gallery image"}
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
          <ViewAll to="/gallery" label="Open full gallery" />
        </div>
      </section>
    ) : null,

    blog: data.blogs.length ? (
      <section key="blog" className="section-pad">
        <div className="container-x">
          <SectionHeading
            eyebrow="Insights"
            title="Latest from the blog"
            subtitle="Strategy, funding and networking insights from our experts."
          />
          <Grid>
            {data.blogs.map((post, index) => (
              <Reveal key={post._id} delay={(index % 3) * 0.08}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </Grid>
          <ViewAll to="/blog" label="Read all articles" />
        </div>
      </section>
    ) : null,

    partners: data.partners.length ? (
      <section key="partners" className="border-y border-slate-200/60 bg-white py-14">
        <div className="container-x">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Trusted by partners & sponsors
            </p>
          </Reveal>
        </div>
        <div className="relative mt-9 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-16 pr-16 hover:[animation-play-state:paused]">
            {[...data.partners, ...data.partners, ...data.partners, ...data.partners].map((partner, index) => (
              <a
                key={`${partner._id}-${index}`}
                href={partner.url || "#"}
                target="_blank"
                rel="noreferrer"
                title={partner.name}
                className="shrink-0"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  loading="lazy"
                  className="h-11 w-auto opacity-55 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    ) : null,

    faq: data.faqs.length ? (
      <section key="faq" className="section-pad bg-mist">
        <div className="container-x">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            subtitle="Everything you need to know about the platform and memberships."
          />
          <Reveal>
            <FaqList faqs={data.faqs} />
          </Reveal>
        </div>
      </section>
    ) : null,

    cta: (
      <section key="cta" className="section-pad">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-deep via-brand to-brand-dark px-8 py-20 text-center text-white shadow-lift md:px-16">
              <div className="bg-dots pointer-events-none absolute inset-0 opacity-60" aria-hidden />
              <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-white/15 blur-3xl" aria-hidden />
              <div className="pointer-events-none absolute -bottom-28 -right-20 size-96 rounded-full bg-brand-deep/60 blur-3xl" aria-hidden />
              <span className="glass relative !border-white/25 !bg-white/10 chip mx-auto text-white/90">
                <span className="size-1.5 rounded-full bg-amber-300" /> Memberships open for 2026
              </span>
              <h2 className="relative mx-auto mt-6 max-w-2xl text-balance font-display text-3xl font-bold !text-white md:text-[2.75rem] md:leading-[1.15]">
                Ready to build, invest and grow with us?
              </h2>
              <p className="relative mx-auto mt-5 max-w-xl text-emerald-100/90 md:text-lg">
                Talk to our team about memberships, investment opportunities or business support.
              </p>
              <div className="relative mt-10 flex flex-wrap justify-center gap-3.5">
                <Link
                  to="/contact"
                  className="btn !rounded-2xl !px-8 !py-4 bg-white !text-base text-brand-deep shadow-xl shadow-black/10 hover:-translate-y-1"
                >
                  <Mail className="size-4" /> Contact Us
                </Link>
                {settings.contact?.phone ? (
                  <a
                    href={`tel:${settings.contact.phone.replace(/\s/g, "")}`}
                    className="btn !rounded-2xl !px-8 !py-4 border border-white/30 !text-base text-white backdrop-blur hover:bg-white/10"
                  >
                    <Phone className="size-4" /> {settings.contact.phone}
                  </a>
                ) : null}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    )
  };

  const order = settings.sections?.length
    ? settings.sections.filter((section) => section.enabled !== false).map((section) => section.key)
    : Object.keys(sections);

  return (
    <>
      <Hero settings={settings} />
      {order.map((key) => sections[key] ?? null)}
    </>
  );
}
