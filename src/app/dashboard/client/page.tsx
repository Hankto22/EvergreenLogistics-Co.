"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  MapPin,
  DollarSign,
  Search,
  Download,
  Eye,
  User,
  Edit,
  Save,
  X,
  Shield,
  Bell,
  ChevronDown,
  Mail,
  Phone
} from "lucide-react";
import type { RootState } from "@/store";

type ShipmentEvent = { label: string; location: string; date: string; done: boolean };

type Shipment = {
  id: string;
  title: string;
  category: string;
  origin: string;
  destination: string;
  status: "In Transit" | "Processing" | "Customs Clearance";
  eta: string;
  progress: number;
  events: ShipmentEvent[];
};

type TabKey = "profile" | "shipments" | "invoices";

const stats = [
  { label: "Active Shipments", value: "8", tone: "indigo", icon: <Package size={20} /> },
  { label: "In Transit", value: "5", tone: "amber", icon: <Clock size={20} /> },
  { label: "Delivered", value: "24", tone: "mint", icon: <MapPin size={20} /> },
  { label: "Total Spent", value: "$12.5K", tone: "lavender", icon: <DollarSign size={20} /> }
];

const shipments: Shipment[] = [
  {
    id: "SH-101",
    title: "Electronic Components",
    category: "Electronics",
    origin: "Guangzhou, China",
    destination: "Nairobi, Kenya",
    status: "In Transit",
    eta: "Dec 18, 2025",
    progress: 88,
    events: [
      { label: "Departed warehouse", location: "Guangzhou", date: "Dec 5", done: true },
      { label: "In transit - Sea", location: "Indian Ocean", date: "Dec 8", done: true },
      { label: "Arrived at port", location: "Mombasa", date: "Dec 10", done: true }
    ]
  },
  {
    id: "SH-102",
    title: "Textile Materials",
    category: "Textiles",
    origin: "Shanghai, China",
    destination: "Mombasa, Kenya",
    status: "Customs Clearance",
    eta: "Dec 15, 2025",
    progress: 72,
    events: [
      { label: "Shipped", location: "Shanghai", date: "Dec 3", done: true },
      { label: "Customs clearance", location: "Mombasa", date: "Dec 9", done: true }
    ]
  },
  {
    id: "SH-103",
    title: "Office Furniture",
    category: "Furniture",
    origin: "Beijing, China",
    destination: "Nairobi, Kenya",
    status: "Processing",
    eta: "Dec 25, 2025",
    progress: 34,
    events: [
      { label: "Order confirmed", location: "Beijing", date: "Dec 9", done: true }
    ]
  }
];

const invoices = [
  { id: "INV-001", shipment: "SH-098", amount: "$1,250", date: "Dec 1, 2025", status: "Paid" },
  { id: "INV-002", shipment: "SH-099", amount: "$2,100", date: "Dec 5, 2025", status: "Paid" },
  { id: "INV-003", shipment: "SH-101", amount: "$1,800", date: "Dec 8, 2025", status: "Pending" }
];

const navLinks = ["About Us", "Solutions", "Cargo Tracking", "Corporate Sustainability", "Contact"];

const clientNotifications = [
  { title: "Shipment #12345 has arrived in Nairobi", time: "2 hours ago" },
  { title: "New order from Mombasa warehouse", time: "5 hours ago" },
  { title: "Customs clearance completed", time: "1 day ago" }
];

export default function ClientDashboard() {
   const user = useSelector((state: RootState) => state.auth.user);
   const navigate = useNavigate();
   const [tab, setTab] = useState<TabKey>("profile");
   const [isEditing, setIsEditing] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [showNotifications, setShowNotifications] = useState(false);
   const [showProfile, setShowProfile] = useState(false);
   const [emailNotifications, setEmailNotifications] = useState(true);
   const [activeNotification, setActiveNotification] = useState<typeof clientNotifications[number] | null>(null);
   const [profile, setProfile] = useState({
     name: "John Client",
     email: user?.email || "client@evergreen.com",
     phone: "+254 700 000 002",
     company: "ABC Trading Ltd"
   });
   const [security, setSecurity] = useState({
     currentPassword: "",
     newPassword: "",
     confirmPassword: "",
     twoFactor: false
   });
   const [profileMessage, setProfileMessage] = useState("");
   const [securityMessage, setSecurityMessage] = useState("");

   const filteredShipments = shipments.filter(s =>
     s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
     s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     s.category.toLowerCase().includes(searchQuery.toLowerCase())
   );

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
          <nav className="topbar-nav">
            {navLinks.map(link => (
              <button key={link} className="top-link" onClick={() => navigate(`/${link.toLowerCase().replace(/ /g, "")}`)}>
                {link}
              </button>
            ))}
          </nav>
          <div className="topbar-actions">
            <button className="icon-chip" aria-label="Search">
              <Search size={18} />
            </button>
            <div className="topbar-bell">
              <button
                className={`icon-chip ${showNotifications ? "active" : ""}`}
                aria-label="Notifications"
                onClick={() => setShowNotifications(prev => !prev)}
              >
                <Bell size={18} />
                <span className="dot" />
              </button>
              {showNotifications && (
                <div className="note-dropdown">
                  <div className="note-head">Notifications</div>
                  {activeNotification ? (
                    <div className="note-detail">
                      <button className="note-back" onClick={() => setActiveNotification(null)}>← Back to all</button>
                      <div className="note-title">{activeNotification.title}</div>
                      <div className="note-time">{activeNotification.time}</div>
                      <p className="note-body">Open notifications to view the full context.</p>
                      <div className="note-actions">
                        <button className="ghost-btn sm" onClick={() => { setActiveNotification(null); setShowNotifications(false); }}>Close</button>
                        <a className="primary-btn sm" href="/notifications">Open feed</a>
                      </div>
                    </div>
                  ) : (
                    <div className="note-list">
                      {clientNotifications.map(note => (
                        <button key={note.title} className="note-item clickable" onClick={() => setActiveNotification(note)}>
                          <div className="note-title">{note.title}</div>
                          <div className="note-time">{note.time}</div>
                        </button>
                      ))}
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
            <div className="drawer-name">{profile.name}</div>
            <div className="role-pill client">CLIENT</div>
            <p className="drawer-meta">Joined January 2024</p>
          </div>
          <div className="drawer-section">
            <h4>Personal Information</h4>
            <div className="drawer-row">
              <Mail size={16} />
              <div>
                <div className="drawer-label">Email</div>
                <div className="drawer-value">{profile.email}</div>
              </div>
            </div>
            <div className="drawer-row">
              <Phone size={16} />
              <div>
                <div className="drawer-label">Phone</div>
                <div className="drawer-value">{profile.phone}</div>
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
                <div className="drawer-label">Company</div>
                <div className="drawer-value">{profile.company}</div>
              </div>
            </div>
            <div className="drawer-row">
              <Shield size={16} />
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
                <Shield size={14} />
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

        <div className="flex gap-4 mb-6">
          <button className={`px-4 py-2 rounded ${tab === "profile" ? "bg-green-600 text-white" : "bg-gray-100"}`} onClick={() => setTab("profile")}>
            <User size={16} className="inline mr-2" /> Profile
          </button>
          <button className={`px-4 py-2 rounded ${tab === "shipments" ? "bg-green-600 text-white" : "bg-gray-100"}`} onClick={() => setTab("shipments")}>
            <Package size={16} className="inline mr-2" /> Shipments
          </button>
          <button className={`px-4 py-2 rounded ${tab === "invoices" ? "bg-green-600 text-white" : "bg-gray-100"}`} onClick={() => setTab("invoices")}>
            <DollarSign size={16} className="inline mr-2" /> Invoices
          </button>
        </div>

        {tab === "shipments" && (
          <div className="client-search">
            <Search size={18} />
            <input
              placeholder="Search shipments by ID or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {tab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Profile Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100"
                  >
                    <Edit size={16} /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setProfileMessage("Profile updated successfully!");
                        setTimeout(() => setProfileMessage(""), 3000);
                      }}
                      className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100"
                    >
                      <Save size={16} /> Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">{profile.name}</h4>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.company}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-6">Account Security</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={security.newPassword}
                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                    <p className="text-xs text-gray-500">Add an extra layer of security</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={security.twoFactor}
                      onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                <button
                  onClick={() => {
                    if (security.newPassword !== security.confirmPassword) {
                      setSecurityMessage("Passwords do not match");
                      return;
                    }
                    if (security.newPassword.length < 6) {
                      setSecurityMessage("Password must be at least 6 characters");
                      return;
                    }
                    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "", twoFactor: security.twoFactor });
                    setSecurityMessage("Security settings updated successfully!");
                    setTimeout(() => setSecurityMessage(""), 3000);
                  }}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Update Security Settings
                </button>
                {securityMessage && <p className={`mt-4 ${securityMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>{securityMessage}</p>}
              </div>
            </div>
          </div>
          <div className="mt-4">
            {profileMessage && <p className="text-green-600">{profileMessage}</p>}
          </div>
          </motion.div>
        )}

        {tab === "shipments" && (
          <section className="client-section">
            <div className="section-head">
              <h2>My Shipments</h2>
            </div>

          <div className="shipment-list">
            {filteredShipments.map(ship => (
              <div key={ship.id} className="shipment-card">
                <div className="shipment-top">
                  <div>
                    <div className="shipment-id">{ship.id}</div>
                    <div className="shipment-title">{ship.title}</div>
                    <div className="shipment-sub">{ship.category}</div>
                  </div>
                  <span className={`pill ${ship.status.replace(" ", "-").toLowerCase()}`}>{ship.status}</span>
                </div>

                <div className="shipment-meta">
                  <div>
                    <div className="meta-label">Origin</div>
                    <div className="meta-value">{ship.origin}</div>
                  </div>
                  <div>
                    <div className="meta-label">Destination</div>
                    <div className="meta-value">{ship.destination}</div>
                  </div>
                  <div className="eta">
                    <Clock size={16} />
                    <span>ETA: {ship.eta}</span>
                  </div>
                </div>

                <div className="progress-row">
                  <div className="progress-label">Delivery Progress</div>
                  <div className="progress-bar">
                    <span style={{ width: `${ship.progress}%` }} />
                  </div>
                </div>

                <div className="timeline">
                  {ship.events.map(event => (
                    <div key={event.label} className="timeline-row">
                      <span className={`timeline-dot ${event.done ? "done" : ""}`} />
                      <div>
                        <div className="timeline-label">{event.label}</div>
                        <div className="timeline-sub">{event.location} • {event.date}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="shipment-actions">
                  <button className="primary-btn" onClick={() => alert(`View details for ${ship.id}`)}>
                    <Eye size={18} />
                    View Details
                  </button>
                  <button className="ghost-btn" onClick={() => alert(`Download invoice for ${ship.id}`)}>
                    <Download size={18} />
                    Download Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        )}

        {tab === "invoices" && (
          <section className="client-section">
            <div className="section-head">
              <h2>Recent Invoices</h2>
            </div>

            <div className="panel invoices-panel">
              <div className="table table-invoices">
                <div className="table-head">
                  <span>Invoice ID</span>
                  <span>Shipment</span>
                  <span>Amount</span>
                  <span>Date</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>
                {invoices.map(inv => (
                  <div key={inv.id} className="table-row">
                    <span>{inv.id}</span>
                    <span>{inv.shipment}</span>
                    <span>{inv.amount}</span>
                    <span>{inv.date}</span>
                    <span>
                      <span className={`pill ${inv.status.toLowerCase()}`}>{inv.status}</span>
                    </span>
                    <span className="link" onClick={() => alert(`Downloading invoice ${inv.id}`)}>Download</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
