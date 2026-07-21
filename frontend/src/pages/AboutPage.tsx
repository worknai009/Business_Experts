import { Linkedin, Target, Telescope } from "lucide-react";
import { useEffect, useState } from "react";
import { apiGet, type Partner, type TeamMember } from "../api";
import { Img, VideoThumb } from "../components/Cards";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { useSeo, useSite } from "../context/SiteContext";

export default function AboutPage() {
  const settings = useSite();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  useSeo("About", "The team and mission behind the business ecosystem platform.");

  useEffect(() => {
    apiGet<TeamMember[]>("/team").then(setTeam).catch(() => {});
    apiGet<Partner[]>("/partners").then(setPartners).catch(() => {});
  }, []);

  const story = settings?.businessStory;

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="We build the infrastructure for business success"
        subtitle={settings?.footer?.about}
      />

      <section className="section-pad">
        <div className="container-x grid gap-6 md:grid-cols-2 md:gap-8">
          <Reveal>
            <div className="card h-full p-8">
              <span className="grid size-12 place-items-center rounded-xl bg-brand-soft text-brand">
                <Target className="size-6" />
              </span>
              <h2 className="mt-5 text-xl font-bold">Our Mission</h2>
              <p className="mt-3 text-sm leading-relaxed md:text-base">
                To connect businesses, startups, investors, professionals and communities in one trusted
                ecosystem — so that capital, knowledge and opportunity flow to the people who can turn them
                into growth.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="card h-full p-8">
              <span className="grid size-12 place-items-center rounded-xl bg-brand-soft text-brand">
                <Telescope className="size-6" />
              </span>
              <h2 className="mt-5 text-xl font-bold">Our Vision</h2>
              <p className="mt-3 text-sm leading-relaxed md:text-base">
                A future where every entrepreneur has access to investors, every business has expert support,
                every professional has a powerful network — and every community member, including our senior
                citizens, is supported and included.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {story?.enabled && story.video ? (
        <section className="section-pad bg-mist">
          <div className="container-x">
            <SectionHeading eyebrow="Our Story" title={story.title || "Our Story"} subtitle={story.description} />
            <Reveal className="mx-auto max-w-[717px]">
              <VideoThumb
                url={story.video}
                title={story.title || "Our Story"}
                className="aspect-video w-full rounded-2xl shadow-lift"
              />
            </Reveal>
          </div>
        </section>
      ) : null}

      {team.length ? (
        <section className="section-pad bg-mist">
          <div className="container-x">
            <SectionHeading
              eyebrow="Team"
              title="The people behind the platform"
              subtitle="Operators, investors and community builders working for your growth."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
              {team.map((member, index) => (
                <Reveal key={member._id} delay={(index % 3) * 0.08}>
                  <div className="card flex h-full flex-col items-center p-8 text-center">
                    <Img src={member.image} alt={member.name} className="size-24 rounded-full object-cover shadow-lg" />
                    <h3 className="mt-4 text-lg font-bold">{member.name}</h3>
                    <p className="text-sm font-semibold text-brand">{member.role}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed">{member.bio}</p>
                    {member.linkedin ? (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} on LinkedIn`}
                        className="mt-4 grid size-9 place-items-center rounded-lg bg-brand-soft text-brand transition hover:bg-brand hover:text-white"
                      >
                        <Linkedin className="size-4" />
                      </a>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {partners.length ? (
        <section className="section-pad">
          <div className="container-x">
            <SectionHeading
              eyebrow="Partners & Sponsors"
              title="Organisations that back the ecosystem"
            />
            <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
              {partners.map((partner) => (
                <a key={partner._id} href={partner.url || "#"} target="_blank" rel="noreferrer" className="text-center">
                  <img src={partner.logo} alt={partner.name} loading="lazy" className="mx-auto h-12 w-auto" />
                  <span className="mt-2 block text-xs text-slate-400">{partner.type}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
