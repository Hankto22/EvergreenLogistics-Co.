// src/components/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { Home, Info, Truck, MapPin, Phone } from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const links = [
  { to: "/", label: "Home", icon: <Home size={18} /> },
  { to: "/about", label: "About", icon: <Info size={18} /> },
  { to: "/services", label: "Services", icon: <Truck size={18} /> },
  { to: "/tracking", label: "Tracking", icon: <MapPin size={18} /> },
  { to: "/contact", label: "Contact", icon: <Phone size={18} /> }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* overlay for mobile */}
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "open" : ""} lg:hidden`}>
        <nav>
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={
                location.pathname === link.to ? "sidebar-link active" : "sidebar-link"
              }
            >
              <span className="icon">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;