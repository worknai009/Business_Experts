import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about-us" },
  { label: "Services", to: "/services" },
  { label: "Who We Are", to: "/who-we-are" },
  { label: "Contact", to: "/contact" }
];

function Navbar() {
  return (
    <header className="site-header">
      <NavLink className="logo-box" to="/" aria-label="Business Expert Asia home">
        <div className="logo-mark">
          <span className="logo-orbit" />
          <span className="logo-core">BEA</span>
        </div>
        <span className="logo-text">
          <strong>Business Expert</strong>
          <small>Asia</small>
        </span>
      </NavLink>

      <nav className="main-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? "active" : undefined)}
            end={item.to === "/"}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <NavLink className="get-started" to="/contact">Get Started</NavLink>

      <button className="menu-button" aria-label="Open menu">
        <Menu size={28} />
      </button>
    </header>
  );
}

export default Navbar;
