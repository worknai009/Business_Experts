type PageHeroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
};

function PageHero({ eyebrow, title, copy, image }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      <img src={image} alt="" />
    </section>
  );
}

export default PageHero;
