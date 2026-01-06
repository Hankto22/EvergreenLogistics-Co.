import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  Package,
  Clock,
  MapPin,
  DollarSign,
  Bell,
  ChevronDown,
  Mail,
  Phone,
  X
} from "lucide-react";
import type { RootState } from "@/store";
import { useGetUserDashboardQuery, useGetNotificationsQuery, useMarkNotificationAsReadMutation } from "../../../store/shipmentApi";

type NotificationItem = {
  id?: string;
  title: string;
  time: string;
  isRead?: boolean;
};

export default function ClientDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();

  // RTK Query hooks
  const { data: userStats } = useGetUserDashboardQuery();
  const { data: notificationsData } = useGetNotificationsQuery();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNotification, setActiveNotification] = useState<NotificationItem | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  const notifications: NotificationItem[] = (notificationsData || []).map((note) => ({
    id: note.id,
    title: note.message || "Notification",
    time: new Date(note.createdAt).toLocaleString(),
    isRead: note.isRead,
  }));
  const hasUnreadNotifications = notifications.some((n) => !n.isRead);

  const stats = userStats ? [
    { label: "Total Shipments", value: userStats.totalShipments.toString(), tone: "indigo", icon: <Package size={20} /> },
    { label: "Active Shipments", value: userStats.activeShipments.toString(), tone: "amber", icon: <Clock size={20} /> },
    { label: "Completed", value: userStats.completedShipments.toString(), tone: "mint", icon: <MapPin size={20} /> },
    { label: "Total Spent", value: `$${userStats.totalSpent.toFixed(2)}`, tone: "lavender", icon: <DollarSign size={20} /> }
  ] : [
    { label: "Total Shipments", value: "0", tone: "indigo", icon: <Package size={20} /> },
    { label: "Active Shipments", value: "0", tone: "amber", icon: <Clock size={20} /> },
    { label: "Completed", value: "0", tone: "mint", icon: <MapPin size={20} /> },
    { label: "Total Spent", value: "$0.00", tone: "lavender", icon: <DollarSign size={20} /> }
  ];

  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      setActionMessage(state.message);
      setTimeout(() => setActionMessage(""), 4000);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleNotificationClick = async (note: NotificationItem) => {
    setActiveNotification(note);
    if (note.id && !note.isRead) {
      try {
        await markNotificationAsRead(note.id).unwrap();
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }
  };

  return (
    <div className="client-page">
      <div className="client-shell">
        <div className="dash-topbar">
          <div className="topbar-brand">
            <div className="brand-mark">E</div>
            <div>
              <div className="brand-title">Evergreen Logistics</div>
              <div className="brand-sub">Co. Ltd</div>
            </div>
          </div>
          <div className="topbar-actions compact">
            <div className="topbar-bell">
              <button
                className={`icon-chip ${showNotifications ? "active" : ""}`}
                aria-label="Notifications"
                onClick={() => setShowNotifications(prev => !prev)}
              >
                <Bell size={18} />
                {hasUnreadNotifications && <span className="dot" />}
              </button>
              {showNotifications && (
                <div className="note-dropdown">
                  <div className="note-head">Notifications</div>
                  {activeNotification ? (
                    <div className="note-detail">
                      <button className="note-back" onClick={() => setActiveNotification(null)}>Back to all</button>
                      <div className="note-title">{activeNotification.title}</div>
                      <div className="note-time">{activeNotification.time}</div>
                      <p className="note-body">Open notifications to view the full context.</p>
                      <div className="note-actions">
                        <button className="ghost-btn sm" onClick={() => { setActiveNotification(null); setShowNotifications(false); }}>Close</button>
                        <button className="primary-btn sm" onClick={() => { navigate('/notifications'); setShowNotifications(false); }}>Open feed</button>
                      </div>
                    </div>
                  ) : (
                    <div className="note-list">
                      {notifications.map(note => (
                        <button key={note.id ?? note.title} className="note-item clickable" onClick={() => handleNotificationClick(note)}>
                          <div className="note-title">{note.title}</div>
                          <div className="note-time">{note.time}</div>
                        </button>
                      ))}
                      {notifications.length === 0 && <div className="note-item">No notifications</div>}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button className="profile-trigger" onClick={() => setShowProfile(true)}>
              <div className="avatar-chip client">C</div>
              <div className="role-meta">
                <span className="role-label client">Client</span>
                <ChevronDown size={14} />
              </div>
            </button>
          </div>
        </div>

        {showProfile && <div className="drawer-backdrop" onClick={() => setShowProfile(false)} />}
        <div className={`profile-drawer ${showProfile ? "open" : ""}`}>
          <div className="drawer-head">
            <div>
              <div className="drawer-title">My Profile</div>
              <p className="drawer-sub">Manage your contact details</p>
            </div>
            <button className="icon-chip ghost" onClick={() => setShowProfile(false)} aria-label="Close profile">
              <X size={16} />
            </button>
          </div>
          <div className="drawer-hero">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=face"
              alt="Client avatar"
              className="drawer-avatar"
            />
            <div className="drawer-name">{user?.fullName || "John Client"}</div>
            <div className="role-pill client">CLIENT</div>
            <p className="drawer-meta">Joined January 2024</p>
          </div>
          <div className="drawer-section">
            <h4>Personal Information</h4>
            <div className="drawer-row">
              <Mail size={16} />
              <div>
                <div className="drawer-label">Email</div>
                <div className="drawer-value">{user?.email || "client@evergreenlogistics.co.ke"}</div>
              </div>
            </div>
            <div className="drawer-row">
              <Phone size={16} />
              <div>
                <div className="drawer-label">Phone</div>
                <div className="drawer-value">{user?.phone || "+254 700 000 002"}</div>
              </div>
            </div>
            <div className="drawer-row">
              <MapPin size={16} />
              <div>
                <div className="drawer-label">City</div>
                <div className="drawer-value">Nairobi, Kenya</div>
              </div>
            </div>
          </div>
          <div className="drawer-section">
            <h4>Professional Details</h4>
            <div className="drawer-row">
              <Package size={16} />
              <div>
                <div className="drawer-label">Role</div>
                <div className="drawer-value">Client</div>
              </div>
            </div>
          </div>
          <div className="drawer-section">
            <h4>Quick Settings</h4>
            <label className="toggle-row">
              <span>Email Notifications</span>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            </label>
            <p className="drawer-hint">Performance metrics are available in your shipments tab.</p>
          </div>
        </div>

        <header className="client-header">
          <div>
            <h1>My Dashboard</h1>
            <p>Track your shipments and manage your logistics</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                <Package size={14} />
                Client
              </span>
            </div>
          </div>
        </header>

        <div className="client-stats">
          {stats.map(stat => (
            <div key={stat.label} className={`client-stat ${stat.tone}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </div>

        {actionMessage && <p className="mb-4 text-sm text-green-700">{actionMessage}</p>}

        <Outlet />
      </div>
    </div>
  );
}
