import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, type Product, type Project } from "../api";
import { ProductCard, ProjectCard } from "../components/Cards";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import SectionHeading from "../components/SectionHeading";
import { useSeo } from "../context/SiteContext";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [category, setCategory] = useState("All");
  useSeo("Products", "Business toolkits, research reports and resources built by our experts.");

  useEffect(() => {
    apiGet<Product[]>("/products").then(setProducts).catch(() => {});
    apiGet<Project[]>("/projects").then(setProjects).catch(() => {});
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))],
    [products]
  );
  const visible = category === "All" ? products : products.filter((product) => product.category === category);

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Tools & resources for serious growth"
        subtitle="Every product is created and refined by ecosystem experts, so you skip the guesswork."
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
            {visible.map((product, index) => (
              <Reveal key={product._id} delay={(index % 3) * 0.08}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
          {!visible.length ? <p className="text-center text-slate-500">No products published yet.</p> : null}
        </div>
      </section>

      {projects.length ? (
        <section className="section-pad bg-mist">
          <div className="container-x">
            <SectionHeading
              eyebrow="Our Projects"
              title="Projects built by our ecosystem"
              subtitle="Platforms and products we have delivered for businesses, investors and communities."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
              {projects.slice(0, 6).map((project, index) => (
                <Reveal key={project._id} delay={(index % 3) * 0.08}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-10 text-center">
              <Link to="/projects" className="btn-secondary">
                View all projects <ArrowRight className="size-4" />
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  );
}
