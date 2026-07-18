import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, type Service } from "../api";
import { Img } from "../components/Cards";
import Icon from "../components/Icon";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { useSeo } from "../context/SiteContext";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  useSeo("Services", "Business growth, support, investment and community services for every stage of growth.");

  useEffect(() => {
    apiGet<Service[]>("/services").then(setServices).catch(() => {});
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Services built for every stage of growth"
        subtitle="From first-time founders to established enterprises — explore how the ecosystem supports you."
      />
      <section className="section-pad">
        <div className="container-x">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
            {services.map((service, index) => (
              <Reveal key={service._id} delay={(index % 3) * 0.08}>
                <Link to={`/services/${service.slug}`} className="card group flex h-full flex-col">
                  <div className="aspect-[3/2] overflow-hidden">
                    <Img
                      src={service.image}
                      alt={service.title}
                      className="size-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="relative flex flex-1 flex-col p-6">
                    <span className="absolute -top-7 left-6 grid size-13 place-items-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-glow ring-4 ring-white">
                      <Icon name={service.icon} className="size-5.5" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold transition group-hover:text-brand">{service.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed">{service.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                      Learn more <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          {!services.length ? <p className="text-center text-slate-500">No services published yet.</p> : null}
        </div>
      </section>
    </>
  );
}
