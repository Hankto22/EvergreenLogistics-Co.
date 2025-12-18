"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, CheckCircle2, Clock, AlertTriangle, UploadCloud, CheckSquare, User, Edit, Save, X, Shield, Camera, Bell, ChevronDown, Search, Mail, Phone, MapPin } from "lucide-react";
import type { RootState } from "@/store";

type Priority = "All" | "High" | "Medium" | "Low";
type TabKey = "profile" | "tasks" | "shipments" | "uploads";

const stats = [
  { label: "Assigned Shipments", value: "28", tone: "indigo", icon: <Package size={20} /> },
  { label: "Completed Today", value: "12", tone: "mint", icon: <CheckCircle2 size={20} /> },
  { label: "Pending", value: "8", tone: "amber", icon: <Clock size={20} /> },
  { label: "Urgent", value: "3", tone: "rose", icon: <AlertTriangle size={20} /> }
];

const tasks = [
  { title: "Process customs clearance for SH-001", shipment: "SH-001", priority: "High" },
  { title: "Update delivery status for SH-003", shipment: "SH-003", priority: "Medium" },
  { title: "Contact customer for documentation", shipment: "SH-005", priority: "High" },
  { title: "Arrange warehouse pickup", shipment: "SH-007", priority: "Low" }
];

const shipments = [
  { id: "SH-001", customer: "ABC Trading Ltd", origin: "Guangzhou", destination: "Nairobi", status: "Customs", progress: 75 },
  { id: "SH-003", customer: "Global Logistics", origin: "Beijing", destination: "Nairobi", status: "In Transit", progress: 45 },
  { id: "SH-005", customer: "Kenya Imports", origin: "Shanghai", destination: "Mombasa", status: "Processing", progress: 20 }
];

const uploads = [
  { title: "Proof of Delivery - SH-001", type: "PDF", status: "Awaiting Review" },
  { title: "Invoice - SH-003", type: "PDF", status: "Uploaded" },
  { title: "Customs Docs - SH-005", type: "ZIP", status: "Pending" }
];

const navLinks = ["About Us", "Solutions", "Cargo Tracking", "Corporate Sustainability", "Contact"];

const staffNotifications = [
  { title: "Shipment #12345 has arrived in Nairobi", time: "2 hours ago" },
  { title: "New order from Mombasa warehouse", time: "5 hours ago" },
  { title: "Customs clearance completed", time: "1 day ago" }
];

export default function StaffDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("profile");
  const [priority, setPriority] = useState<Priority>("All");
  const [isEditing, setIsEditing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activeNotification, setActiveNotification] = useState<typeof staffNotifications[number] | null>(null);
  const [profile, setProfile] = useState({
    name: "Jane Staff",
    email: user?.email || "staff@evergreen.com",
    phone: "+254 700 000 001",
    department: "Operations"
  });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false
  });
  const [securityMessage, setSecurityMessage] = useState("");

  const filteredTasks = useMemo(
    () => tasks.filter(t => priority === "All" || t.priority === priority),
    [priority]
  );

  return (
    <div className="staff-page">
      <div className="staff-shell">
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
                      {staffNotifications.map(note => (
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
              <div className="avatar-chip staff">S</div>
              <div className="role-meta">
                <span className="role-label staff">Staff</span>
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
              <p className="drawer-sub">Profile snapshot & quick settings</p>
            </div>
            <button className="icon-chip ghost" aria-label="Close profile" onClick={() => setShowProfile(false)}>
              <X size={16} />
            </button>
          </div>
          <div className="drawer-hero">
            <img
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=240&h=240&fit=crop&crop=face"
              alt="Staff avatar"
              className="drawer-avatar"
            />
            <div className="drawer-name">{profile.name}</div>
            <div className="role-pill staff">STAFF</div>
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
              <User size={16} />
              <div>
                <div className="drawer-label">Department</div>
                <div className="drawer-value">{profile.department}</div>
              </div>
            </div>
            <div className="drawer-row">
              <Shield size={16} />
              <div>
                <div className="drawer-label">Role</div>
                <div className="drawer-value">Staff Member</div>
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
            <p className="drawer-hint">Performance metrics: 156 handled, 23 this month.</p>
          </div>
        </div>

        <header className="staff-header">
          <div>
            <h1>My Dashboard</h1>
            <p>Track your shipments and manage your logistics tasks</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-1">
                <Shield size={14} />
                Staff
              </span>
            </div>
          </div>
        </header>

        <div className="staff-stats">
          {stats.map(stat => (
            <div key={stat.label} className={`staff-stat ${stat.tone}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="staff-tabs">
          <button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}>
            <User size={16} /> Profile
          </button>
          <button className={tab === "tasks" ? "active" : ""} onClick={() => setTab("tasks")}>
            <CheckSquare size={16} /> My Tasks
          </button>
          <button className={tab === "shipments" ? "active" : ""} onClick={() => setTab("shipments")}>
            <Package size={16} /> My Shipments
          </button>
          <button className={tab === "uploads" ? "active" : ""} onClick={() => setTab("uploads")}>
            <UploadCloud size={16} /> Upload Documents
          </button>

          {tab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 md:grid-cols-2"
            >
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Profile Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    >
                      <Edit size={16} /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
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
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600">
                        <Camera size={12} />
                      </button>
                    )}
                  </div>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.phone}</p>
                    )}
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.department}
                        onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{profile.department}</p>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter current password"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={security.newPassword}
                      onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={security.confirmPassword}
                      onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update Security Settings
                  </button>
                  {securityMessage && <p className={`mt-4 ${securityMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>{securityMessage}</p>}
                </div>
              </div>
            </motion.div>
          )}
  
          {tab === "tasks" && (
            <select className="filter-select" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          )}
        </div>

        {tab === "tasks" && (
          <div className="panel task-panel">
            <h3>My Tasks</h3>
            <div className="task-list">
              {filteredTasks.map(task => (
                <div key={task.title} className="task-row">
                  <div>
                    <div className="task-title">{task.title}</div>
                    <div className="task-sub">Shipment: {task.shipment}</div>
                  </div>
                  <div className="task-actions">
                    <span className={`pill ${task.priority.toLowerCase()}`}>{task.priority}</span>
                    <button className="primary-chip" onClick={() => alert(`Update task: ${task.title}`)}>Update</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "shipments" && (
          <div className="panel shipment-panel">
            {shipments.map(ship => (
              <div key={ship.id} className="staff-shipment-card">
                <div className="shipment-top">
                  <div>
                    <div className="shipment-id">{ship.id}</div>
                    <div className="shipment-title">{ship.customer}</div>
                    <div className="shipment-sub">
                      Origin <strong>{ship.origin}</strong> • Destination <strong>{ship.destination}</strong>
                    </div>
                  </div>
                  <span className={`pill ${ship.status.replace(" ", "-").toLowerCase()}`}>{ship.status}</span>
                </div>

                <div className="progress-row">
                  <div className="progress-label">Progress</div>
                  <div className="progress-bar">
                    <span style={{ width: `${ship.progress}%` }} />
                  </div>
                </div>

                <div className="shipment-actions">
                  <button className="primary-btn" onClick={() => alert(`Update status for ${ship.id}`)}>Update Status</button>
                  <button className="ghost-btn" onClick={() => alert(`View details for ${ship.id}`)}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "uploads" && (
          <div className="panel upload-panel">
            <h3>Upload Documents</h3>
            <div className="upload-list">
              {uploads.map(file => (
                <div key={file.title} className="upload-row">
                  <div>
                    <div className="upload-title">{file.title}</div>
                    <div className="upload-sub">{file.type}</div>
                  </div>
                  <span className="pill info">{file.status}</span>
                </div>
              ))}
            </div>
            <button className="primary-btn" onClick={() => alert("Upload new file functionality not implemented")}>
              <UploadCloud size={18} />
              Upload New File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
