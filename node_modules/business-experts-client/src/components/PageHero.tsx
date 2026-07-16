import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  crumb?: string;
};

function PageHero({ eyebrow, title, copy, image, crumb }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="hero-copy">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span>{crumb ?? title}</span>
        </nav>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      <div className="page-hero-media">
        <img src={image} alt="" />
      </div>
    </section>
  );
}

export default PageHero;
