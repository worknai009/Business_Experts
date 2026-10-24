import { AnimatePresence, motion } from "framer-motion";
import { PlayCircle, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiGet, type GalleryItem } from "../api";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { useSeo } from "../context/SiteContext";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState<GalleryItem | null>(null);
  useSeo("Gallery", "Photos and videos from our summits, workshops and community programs.");

  useEffect(() => {
    apiGet<GalleryItem[]>("/gallery").then(setItems).catch(() => {});
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.category).filter(Boolean)))],
    [items]
  );
  const visible = category === "All" ? items : items.filter((item) => item.category === category);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="The ecosystem in pictures"
        subtitle="Summits, networking evenings, workshops and community programs — captured."
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
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
            {visible.map((item) => (
              <Reveal key={item._id}>
                <button
                  type="button"
                  onClick={() => setActive(item)}
                  className="group relative block w-full overflow-hidden rounded-2xl"
                >
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.title || "Gallery item"}
                    loading="lazy"
                    className="w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {item.type === "video" ? (
                    <span className="absolute inset-0 grid place-items-center bg-ink/30">
                      <PlayCircle className="size-12 text-white drop-shadow" />
                    </span>
                  ) : null}
                  {item.title ? (
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-3 pt-8 text-left text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                      {item.title}
                    </span>
                  ) : null}
                </button>
              </Reveal>
            ))}
          </div>
          {!visible.length ? <p className="text-center text-slate-500">Gallery is being curated.</p> : null}
        </div>
      </section>

      <AnimatePresence>
        {active ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-ink/85 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="size-5" />
            </button>
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-h-[85vh] w-full max-w-4xl"
              onClick={(event) => event.stopPropagation()}
            >
              {active.type === "video" ? (
                <div className="aspect-video w-full overflow-hidden rounded-2xl">
                  <iframe src={active.url} title={active.title || "Video"} className="size-full" allowFullScreen />
                </div>
              ) : (
                <img src={active.url} alt={active.title || "Gallery item"} className="max-h-[85vh] w-full rounded-2xl object-contain" />
              )}
              {active.title ? <p className="mt-3 text-center text-sm text-slate-200">{active.title}</p> : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
