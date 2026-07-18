import { useEffect, useState } from "react";
import { apiGet, type EventItem } from "../api";
import { EventCard } from "../components/Cards";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { useSeo } from "../context/SiteContext";

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  useSeo("Events", "Summits, meetups and workshops for founders, investors and professionals.");

  useEffect(() => {
    apiGet<EventItem[]>("/events").then(setEvents).catch(() => {});
  }, []);

  const now = Date.now();
  const upcoming = events.filter((event) => !event.date || new Date(event.date).getTime() >= now - 86400000);
  const past = events.filter((event) => event.date && new Date(event.date).getTime() < now - 86400000);

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Where the ecosystem meets"
        subtitle="Reserve your seat at our summits, networking evenings and expert workshops."
      />
      <section className="section-pad">
        <div className="container-x max-w-4xl space-y-6">
          {upcoming.map((event, index) => (
            <Reveal key={event._id} delay={index * 0.06}>
              <EventCard event={event} />
            </Reveal>
          ))}
          {!upcoming.length ? (
            <p className="text-center text-slate-500">No upcoming events right now — check back soon.</p>
          ) : null}

          {past.length ? (
            <>
              <h2 className="pt-10 text-center font-display text-2xl font-bold text-ink">Past events</h2>
              {past.map((event, index) => (
                <Reveal key={event._id} delay={index * 0.06} className="opacity-80">
                  <EventCard event={event} />
                </Reveal>
              ))}
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
