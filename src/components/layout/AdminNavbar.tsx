import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { logout } from "../../store/authSlice";
import type { AppDispatch, RootState } from "../../store";
import { User, Bell, Search, Menu, X } from "lucide-react";
import { useGetNotificationsQuery } from "../../store/shipmentApi";

const allLinks = [
  { to: "/admin/dashboard", label: "Dashboard", roles: ["super_admin", "staff"] },
  { to: "/admin/shipments", label: "Shipments", roles: ["super_admin", "staff"] },
  { to: "/admin/tracking", label: "Tracking", roles: ["super_admin", "staff"] },
  { to: "/admin/users", label: "Users", roles: ["super_admin"] },
  { to: "/admin/invoices", label: "Invoices", roles: ["super_admin"] },
  { to: "/admin/reports", label: "Reports", roles: ["super_admin"] },
  { to: "/admin/media", label: "Media", roles: ["super_admin", "staff"] },
  { to: "/admin/settings", label: "Settings", roles: ["super_admin"] },
  { to: "/admin/containers", label: "Containers", roles: ["super_admin", "staff"] },
  { to: "/admin/payments", label: "Payments", roles: ["super_admin"] },
  { to: "/admin/notifications", label: "Notifications", roles: ["super_admin", "staff"] },
];

const AdminNavbar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: notificationsData } = useGetNotificationsQuery();
  const notifications = notificationsData || [];
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNotification, setActiveNotification] = useState<typeof notifications[number] | null>(null);

  const adminLinks = allLinks.filter(link => user?.role && link.roles.includes(user.role));

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
  };

  return (
    <header className="navbar admin-navbar">
      <div className="nav-inner">
        <div className="navbar-left">
          <Link to="/" className="brand">
            <div className="brand-mark">E</div>
            <div className="brand-text">
              <span className="brand-title">Evergreen Logistics</span>
              <span className="brand-subtitle">Co. Ltd</span>
            </div>
          </Link>
        </div>

        <nav className="navbar-center hidden md:flex">
          {adminLinks.map(link => (
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
          <button className="icon-btn hidden sm:flex" aria-label="Search">
            <Search size={20} />
          </button>

          {/* Mobile Menu Dropdown */}
          <div className="relative md:hidden">
            <button
              className={`icon-btn ${sidebarOpen ? "active" : ""}`}
              aria-label="Menu"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
            {sidebarOpen && (
              <div className="admin-mobile-menu">
                <div className="admin-mobile-head">
                  <div className="admin-mobile-user">
                    <div className="text-sm font-medium text-gray-900">{user?.fullName}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</div>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 hover:bg-gray-200 rounded"
                    aria-label="Close menu"
                  >
                    <X size={16} />
                  </button>
                </div>

                <nav className="admin-mobile-links">
                  {adminLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`admin-mobile-link ${
                        location.pathname === link.to
                          ? "is-active"
                          : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="admin-mobile-footer">
                  <Link
                    to="/admin/profile"
                    onClick={() => setSidebarOpen(false)}
                    className="admin-mobile-secondary"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    onClick={() => setSidebarOpen(false)}
                    className="admin-mobile-secondary"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setSidebarOpen(false);
                    }}
                    className="admin-mobile-logout"
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
              onClick={() => setShowNotifications(prev => !prev)}
            >
              <Bell size={20} />
              <span className="dot" />
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
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <User size={20} />
            </button>
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
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
