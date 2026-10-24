import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, type Service } from "../api";
import { Img } from "../components/Cards";
import Icon from "../components/Icon";
import Reveal from "../components/Reveal";
import RichText from "../components/RichText";
import { useSeo } from "../context/SiteContext";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [others, setOthers] = useState<Service[]>([]);
  const [missing, setMissing] = useState(false);
  useSeo(service?.title || "Service", service?.description);

  useEffect(() => {
    setService(null);
    setMissing(false);
    apiGet<Service>(`/services/${slug}`)
      .then(setService)
      .catch(() => setMissing(true));
    apiGet<Service[]>("/services").then(setOthers).catch(() => {});
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (missing) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-bold">Service not found</h1>
        <Link to="/services" className="btn-primary mt-6">All services</Link>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="size-10 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
      </div>
    );
  }

  const otherServices = others.filter((item) => item._id !== service._id).slice(0, 3);

  return (
    <article className="section-pad">
      <div className="container-x max-w-4xl">
        <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
          <ArrowLeft className="size-4" /> All services
        </Link>

        <Reveal className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-glow">
              <Icon name={service.icon} className="size-5.5" />
            </span>
            <span className="eyebrow">Our Services</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{service.title}</h1>
          <p className="mt-3 text-lg text-slate-600">{service.description}</p>
        </Reveal>

        {service.image ? (
          <Reveal className="mt-10">
            <Img src={service.image} alt={service.title} className="aspect-video w-full rounded-2xl object-cover shadow-xl" />
          </Reveal>
        ) : null}

        {service.fullDescription ? (
          <Reveal className="mt-10">
            <RichText text={service.fullDescription} />
          </Reveal>
        ) : null}

        {service.features?.length ? (
          <Reveal className="mt-10">
            <h2 className="text-lg font-bold">What you get</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 rounded-xl bg-mist p-4 text-sm font-medium">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" /> {feature}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        <Reveal className="mt-12">
          <div className="rounded-3xl bg-gradient-to-br from-brand-deep via-brand to-brand-dark p-8 text-center text-white shadow-lift md:p-10">
            <h2 className="font-display text-2xl font-bold !text-white">Interested in {service.title}?</h2>
            <p className="mx-auto mt-2 max-w-md text-emerald-100/90">
              Talk to our team — we will guide you through how this service fits your business.
            </p>
            <Link
              to="/contact"
              state={{ subject: `Service enquiry: ${service.title}` }}
              className="btn mt-6 !rounded-2xl bg-white !px-8 !py-3.5 text-brand-deep shadow-xl hover:-translate-y-0.5"
            >
              Get in touch <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>

        {otherServices.length ? (
          <Reveal className="mt-14">
            <h2 className="text-lg font-bold">Other services</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {otherServices.map((item) => (
                <Link
                  key={item._id}
                  to={`/services/${item.slug}`}
                  className="card group p-5"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
                    <Icon name={item.icon} className="size-4.5" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold transition group-hover:text-brand">{item.title}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                    View details <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </article>
  );
}
