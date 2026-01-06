// src/components/layout/Footer.tsx
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>Evergreen Logistics</h3>
          <p>
            Reliable shipping and logistics from Kenya to China and beyond.
          </p>
          <div className="social-row">
            <a href="https://facebook.com" target="_blank">Facebook</a>
            <a href="https://x.com" target="_blank">X</a>
            <a href="https://linkedin.com" target="_blank">LinkedIn</a>
            <a href="https://instagram.com" target="_blank">Instagram</a>
          </div>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/tracking">Track Shipment</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4>Our Services</h4>
          <ul>
            <li><Link to="/services#ocean">Ocean Freight</Link></li>
            <li><Link to="/services#air">Air Freight</Link></li>
            <li><Link to="/services#warehousing">Warehousing</Link></li>
            <li><Link to="/services#customs">Customs Clearance</Link></li>
            <li><Link to="/services#door">Door to Door Delivery</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact Us</h4>
          <p>Nairobi Office: Mombasa Rd, Industrial Area</p>
          <p>Tel: +254 728 969 582/3</p>
          <p>Francis Mwangi: +254 722 837173</p>
          <p>Yiwu Warehouse: Dongyuan Industrial Area, Dongxin Rd 19, Bldg 1 East 1F</p>
          <p>Contacts: +86 152 5895 2601 / +86 158 2579 4496</p>
          <p>Email: contact@evergreenlogistics.co.ke</p>
          <div className="compatibility-badge">Fast and reliable service</div>
        </div>
      </div>

      <div className="footer-bottom">
        (c) {new Date().getFullYear()} Evergreen Logistics Co. Ltd. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
