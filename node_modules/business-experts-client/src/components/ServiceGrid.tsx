import { services } from "../data/siteContent";

function ServiceGrid() {
  return (
    <div className="service-list">
      {services.map((service) => {
        const Icon = service.icon;
        return (
          <article className="service-card" key={service.title}>
            <img src={service.image} alt="" />
            <div className="service-overlay">
              <Icon size={30} />
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default ServiceGrid;
