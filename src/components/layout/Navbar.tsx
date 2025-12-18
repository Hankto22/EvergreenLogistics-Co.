import { Bell, Menu, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import type { RootState, AppDispatch } from "../../store";

type NavbarProps = {
  onToggleSidebar: () => void;
};

const links = [
  { to: "/about", label: "About Us" },
  { to: "/gallery", label: "Gallery" },
  { to: "/services", label: "Solutions" },
  { to: "/tracking", label: "Cargo Tracking" },
  { to: "/sustainability", label: "Corporate Sustainability" },
  { to: "/contact", label: "Contact" }
];

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="navbar-left">
          <button className="nav-toggle" onClick={onToggleSidebar} aria-label="Open menu">
            <Menu size={22} />
          </button>

          <Link to="/" className="brand">
            <div className="brand-mark">E</div>
            <div className="brand-text">
              <span className="brand-title">Evergreen Logistics</span>
              <span className="brand-subtitle">Co. Ltd</span>
            </div>
          </Link>
        </div>

        <nav className="navbar-center">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-right">
          <button className="icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={20} />
          </button>
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
              </span>
              <button onClick={handleLogout} className="btn btn-primary">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
