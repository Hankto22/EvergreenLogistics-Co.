"use client";

import { Link, useLocation } from "react-router-dom";
import { Home, Info, Truck, MapPin, ShieldCheck, Phone, X, Bell, Search } from "lucide-react";

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const links = [
  { to: "/about", label: "About Us", icon: <Info size={18} /> },
  { to: "/gallery", label: "Gallery", icon: <Home size={18} /> },
  { to: "/services", label: "Solutions", icon: <Truck size={18} /> },
  { to: "/tracking", label: "Cargo Tracking", icon: <MapPin size={18} /> },
  { to: "/sustainability", label: "Corporate Sustainability", icon: <ShieldCheck size={18} /> },
  { to: "/contact", label: "Contact", icon: <Phone size={18} /> },
  { to: "/", label: "Home", icon: <Home size={18} /> }
];

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const location = useLocation();

  return (
    <>
      {isOpen && <div className="drawer-overlay" onClick={onClose} />}

      <div className={`drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="brand-inline">
            <div className="brand-mark">E</div>
            <div className="brand-text">
              <span className="brand-title">Evergreen Logistics</span>
              <span className="brand-subtitle">Co. Ltd</span>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <div className="drawer-actions">
          <button className="icon-btn" aria-label="Search">
            <Search size={18} />
          </button>
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <Link to="/login" onClick={onClose} className="btn btn-primary drawer-login">
            Login
          </Link>
        </div>

        <nav className="drawer-nav">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={`drawer-link ${location.pathname === link.to ? "active" : ""}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
