import { useEffect, useMemo, useState } from "react";
import { apiGet, type BlogPost } from "../api";
import { BlogCard } from "../components/Cards";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { useSeo } from "../context/SiteContext";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState("All");
  useSeo("Blog", "Insights on business growth, startup funding, investment and networking.");

  useEffect(() => {
    apiGet<BlogPost[]>("/blogs").then(setPosts).catch(() => {});
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean)))],
    [posts]
  );
  const visible = category === "All" ? posts : posts.filter((post) => post.category === category);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Insights from the ecosystem"
        subtitle="Practical thinking on growth, funding, networking and community — written by our experts."
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
            {visible.map((post, index) => (
              <Reveal key={post._id} delay={(index % 3) * 0.08}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
          {!visible.length ? <p className="text-center text-slate-500">No articles published yet.</p> : null}
        </div>
      </section>
    </>
  );
}
