import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Sessions", to: "/programs" },
  { label: "Modules", to: "/modules" },
  { label: "Admissions", to: "/admissions" },
  { label: "Contact", to: "/contact" }
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const renderItem = (item: (typeof navItems)[number]) => (
    <NavLink
      key={item.to}
      to={item.to}
      className={({ isActive }) => (isActive ? "active" : undefined)}
      end={item.to === "/"}
      onClick={closeMenu}
    >
      {item.label}
    </NavLink>
  );

  return (
    <header className="site-header">
      <NavLink className="logo-box" to="/" aria-label="Perfect Man home" onClick={closeMenu}>
        <div className="logo-mark">
          <span className="logo-orbit" />
          <span className="logo-core">PM</span>
        </div>
        <span className="logo-text">
          <strong>Perfect Man</strong>
          <small>by Excelsus</small>
        </span>
      </NavLink>

      <nav className="main-nav" aria-label="Primary navigation">
        {navItems.map(renderItem)}
      </nav>

      <NavLink className="get-started" to="/contact">Enroll Now</NavLink>

      <button
        className="menu-button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(renderItem)}
          <Link className="get-started mobile-cta" to="/contact" onClick={closeMenu}>
            Enroll Now
          </Link>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
