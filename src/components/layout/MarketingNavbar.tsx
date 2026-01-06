import { Bell, Menu, Search, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { logout } from "../../store/authSlice";
import type { RootState, AppDispatch } from "../../store";

type MarketingNavbarProps = {
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

const MarketingNavbar: React.FC<MarketingNavbarProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const roleToDashboardPath = (role?: string) => {
    if (!role) return "login";
    const lower = role.toLowerCase();
    return lower === "super_admin" ? "admin" : lower;
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
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
            <>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (user?.role) {
                    navigate(`/dashboard/${roleToDashboardPath(user.role)}`);
                  }
                }}
              >
                Dashboard
              </button>
              <div className="relative">
                <button
                  className="icon-btn"
                  aria-label="Profile"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <User size={20} />
                </button>
                {/* Profile Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <Link
                        to="/admin/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/admin/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Security
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
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

export default MarketingNavbar;
