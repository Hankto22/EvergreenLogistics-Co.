import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { logout } from "../../store/authSlice";
import type { AppDispatch, RootState } from "../../store";
import { User, Bell, Search, Menu, X, Package, FileText, BarChart3, MapPin } from "lucide-react";
import { useGetNotificationsQuery } from "../../store/shipmentApi";

type ClientLink = {
  to: string;
  label: string;
  icon: typeof Package;
};

const clientLinks: ClientLink[] = [
  { to: "/dashboard/client/profile", label: "Dashboard", icon: BarChart3 },
  { to: "/dashboard/client/shipments", label: "Shipments", icon: Package },
  { to: "/dashboard/client/invoices", label: "Invoices", icon: FileText },
  { to: "/tracking", label: "Track Shipment", icon: MapPin },
];

const ClientNavbar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: notificationsData } = useGetNotificationsQuery();
  const notifications = notificationsData || [];
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNotification, setActiveNotification] = useState<typeof notifications[number] | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
  };

  const isLinkActive = (link: ClientLink) => {
    return location.pathname === link.to;
  };

  return (
    <header className="navbar client-navbar">
      <div className="nav-inner">
        <div className="navbar-left">
          <Link to="/" className="brand">
            <div className="brand-mark">E</div>
            <div className="brand-text">
              <span className="brand-title">Evergreen Logistics</span>
              <span className="brand-subtitle">Client Portal</span>
            </div>
          </Link>
        </div>

        <nav className="navbar-center hidden md:flex">
          {clientLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isLinkActive(link) ? "active" : ""}`}
              aria-current={isLinkActive(link) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-right">
          <button className="icon-btn hidden sm:flex" aria-label="Search">
            <Search size={20} />
          </button>

          {/* Mobile Menu Dropdown */}
          <div className="relative md:hidden">
            <button
              className={`icon-btn ${sidebarOpen ? "active" : ""}`}
              aria-label="Menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
            {sidebarOpen && (
              <div className="client-mobile-menu">
                <div className="client-mobile-head">
                  <div className="client-mobile-user">
                    <div className="text-sm font-medium text-gray-900">{user?.fullName}</div>
                    <div className="text-xs text-gray-500">Client</div>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 hover:bg-gray-200 rounded"
                    aria-label="Close menu"
                  >
                    <X size={16} />
                  </button>
                </div>

                <nav className="client-mobile-links">
                  {clientLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`client-mobile-link ${
                        isLinkActive(link)
                          ? "is-active"
                          : ""
                      }`}
                      aria-current={isLinkActive(link) ? "page" : undefined}
                    >
                      <link.icon size={16} />
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="client-mobile-footer">
                  <Link
                    to="/dashboard/client/profile"
                    onClick={() => setSidebarOpen(false)}
                    className="client-mobile-secondary"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setSidebarOpen(false);
                    }}
                    className="client-mobile-logout"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className={`icon-btn ${showNotifications ? "active" : ""}`}
              aria-label="Notifications"
              aria-expanded={showNotifications}
              onClick={() => setShowNotifications(prev => !prev)}
            >
              <Bell size={20} />
              {notifications.length > 0 && <span className="dot" />}
            </button>
            {showNotifications && (
              <div className="note-dropdown">
                <div className="note-head">Notifications</div>
                {activeNotification ? (
                  <div className="note-detail">
                    <button className="note-back" onClick={() => setActiveNotification(null)}>Back to all</button>
                    <div className="note-title">{activeNotification.message}</div>
                    <div className="note-time">{new Date(activeNotification.createdAt).toLocaleString()}</div>
                    <p className="note-body">Open notifications to view the full context.</p>
                    <div className="note-actions">
                      <button className="ghost-btn sm" onClick={() => { setActiveNotification(null); setShowNotifications(false); }}>Close</button>
                      <Link className="primary-btn sm" to="/notifications" onClick={() => setShowNotifications(false)}>Open feed</Link>
                    </div>
                  </div>
                ) : (
                  <div className="note-list">
                    {notifications.map(note => (
                      <button key={note.id} className="note-item clickable" onClick={() => setActiveNotification(note)}>
                        <div className="note-title">{note.message}</div>
                        <div className="note-time">{new Date(note.createdAt).toLocaleString()}</div>
                      </button>
                    ))}
                    {notifications.length === 0 && (
                      <div className="note-empty">No notifications</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Profile Dropdown */}
          <div className="relative hidden lg:block">
            <button
              className="icon-btn"
              aria-label="Profile"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <User size={20} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <Link
                    to="/dashboard/client/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
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
        </div>
      </div>
    </header>
  );
};

export default ClientNavbar;
