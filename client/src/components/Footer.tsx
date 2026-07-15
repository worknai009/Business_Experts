import { Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer id="contact">
      <div>
        <h3>Contact Us</h3>
        <p>Business Expert Asia</p>
        <p><MapPin size={14} /> 300 GF, Green Tower, Airport Road, Bangaluru, Karnataka 560065</p>
        <p><Mail size={14} /> info@business-expert.asia</p>
      </div>
      <div>
        <h3>Quick Links</h3>
        <Link to="/">Home</Link>
        <Link to="/about-us">About Us</Link>
        <Link to="/services">Services</Link>
        <Link to="/who-we-are">Who We Are</Link>
      </div>
      <div>
        <h3>Our Services</h3>
        <p>Company Formation</p>
        <p>Govt. Approvals & Licensing</p>
        <p>Land & Real Estate</p>
        <p>Import-Export Setup</p>
        <p>Business Growth Strategy</p>
      </div>
    </footer>
  );
}

export default Footer;
