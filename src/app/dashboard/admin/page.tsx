"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Ship,
  Plane,
  Truck,
  UploadCloud,
  UserPlus,
  ClipboardList,
  Settings,
  User,
  Edit,
  Save,
  Shield,
  Camera,
  Bell,
  Mail,
  Phone,
  Search,
  ChevronDown,
  X
} from "lucide-react";
import type { RootState } from "@/store";
import { uploadToCloudinary } from "@/api/cloudinary";
import { useGetAdminDashboardQuery, useGetShipmentsQuery, useGetNotificationsQuery, useMarkNotificationAsReadMutation } from "../../../store/shipmentApi";

type TabKey = "profile" | "overview" | "shipments" | "users" | "media" | "payments";

const users = [
  { name: "John Doe", email: "john@example.com", role: "Client", shipments: 12, status: "Active" },
  { name: "Jane Smith", email: "jane@example.com", role: "Staff", shipments: 45, status: "Active" },
  { name: "Bob Johnson", email: "bob@example.com", role: "Client", shipments: 8, status: "Active" }
];

const freightTiles = [
  { label: "Ocean Freight", value: "1,234", copy: "Active shipments", icon: <Ship />, tone: "blue" },
  { label: "Air Freight", value: "856", copy: "Active shipments", icon: <Plane />, tone: "violet" },
  { label: "Road Transport", value: "366", copy: "Active shipments", icon: <Truck />, tone: "sand" }
];

const actions = [
  { label: "New Shipment", icon: <Package />, tone: "blue" },
  { label: "Add User", icon: <UserPlus />, tone: "green" },
  { label: "Generate Report", icon: <ClipboardList />, tone: "purple" },
  { label: "Settings", icon: <Settings />, tone: "slate" }
];

export default function AdminDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // RTK Query hooks
  const { data: adminStats } = useGetAdminDashboardQuery();
  const { data: shipmentsData } = useGetShipmentsQuery({});
  const { data: notificationsData } = useGetNotificationsQuery();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

  const adminNotifications = notificationsData || [];

  const statCards = adminStats ? [
    { label: "Total Shipments", value: adminStats.totalShipments.toString(), change: "+12%", icon: <Package />, tone: "indigo" },
    { label: "Active Shipments", value: adminStats.activeShipments.toString(), change: "+8%", icon: <Users />, tone: "mint" },
    { label: "Total Clients", value: adminStats.totalClients.toString(), change: "+23%", icon: <DollarSign />, tone: "purple" },
    { label: "Revenue", value: `$${adminStats.totalRevenue.toFixed(2)}`, change: "+5%", icon: <TrendingUp />, tone: "peach" }
  ] : [
    { label: "Total Shipments", value: "0", change: "+12%", icon: <Package />, tone: "indigo" },
    { label: "Active Shipments", value: "0", change: "+8%", icon: <Users />, tone: "mint" },
    { label: "Total Clients", value: "0", change: "+23%", icon: <DollarSign />, tone: "purple" },
    { label: "Revenue", value: "$0.00", change: "+5%", icon: <TrendingUp />, tone: "peach" }
  ];

  // Transform shipments data
  const shipments = shipmentsData ? shipmentsData.slice(0, 4).map(shipment => ({
    id: shipment.EVGCode,
    customer: shipment.client?.fullName || "Unknown Client",
    origin: shipment.OriginCity || "Unknown",
    destination: shipment.DestinationCity || "Unknown",
    type: shipment.TransportMode || "Unknown",
    status: shipment.Status
  })) : [];
  // default to overview and drop the inline tab links row
  const [tab] = useState<TabKey>("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activeNotification, setActiveNotification] = useState<typeof adminNotifications[number] | null>(null);
  const [profile, setProfile] = useState({
    name: user?.fullName || "John Admin",
    email: user?.email || "admin@evergreenlogistics.co.ke",
    phone: user?.phone || "+254 700 000 000",
    company: user?.company || "Evergreen Logistics Co. Ltd",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false
  });
  const [securityMessage, setSecurityMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploading(true);
    for (const file of files) {
      try {
        const result = await uploadToCloudinary(file);
        setUploadedFiles(prev => [...prev, result.secure_url]);
      } catch (error) {
        alert("Upload failed: " + (error as Error).message);
      }
    }
    setUploading(false);
  };

  const handleNotificationClick = async (notification: typeof adminNotifications[number]) => {
    setActiveNotification(notification);
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification.id).unwrap();
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="dash-topbar">
          <div className="topbar-brand">
            <div className="brand-mark">E</div>
            <div>
              <div className="brand-title">Evergreen Logistics</div>
              <div className="brand-sub">Super Admin Control</div>
            </div>
          </div>
          <div className="topbar-actions compact">
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
                {adminNotifications.length > 0 && <span className="dot" />}
              </button>
              {showNotifications && (
                <div className="note-dropdown">
                  <div className="note-head">Notifications</div>
                  {activeNotification ? (
                    <div className="note-detail">
                      <button className="note-back" onClick={() => setActiveNotification(null)}>Back to all</button>
                      <div className="note-title">{activeNotification.message || "Notification"}</div>
                      <div className="note-time">{new Date(activeNotification.createdAt).toLocaleString()}</div>
                      <p className="note-body">Open notifications to view the full context.</p>
                      <div className="note-actions">
                        <button
                          className="ghost-btn sm"
                          onClick={() => { setActiveNotification(null); setShowNotifications(false); }}
                        >
                          Close
                        </button>
                        <button
                          className="primary-btn sm"
                          onClick={() => { navigate('/notifications'); setShowNotifications(false); }}
                        >
                          Open feed
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="note-list">
                      {adminNotifications.map(note => (
                        <button
                          key={note.id}
                          className="note-item clickable"
                          onClick={() => handleNotificationClick(note)}
                        >
                          <div className="note-title">{note.message || "Notification"}</div>
                          <div className="note-time">{new Date(note.createdAt).toLocaleString()}</div>
                        </button>
                      ))}
                      {adminNotifications.length === 0 && (
                        <div className="note-item">No notifications</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button className="profile-trigger" onClick={() => setShowProfileMenu(true)}>
              <div className="avatar-chip admin">A</div>
              <div className="role-meta">
                <span className="role-label admin">Super Admin</span>
                <ChevronDown size={14} />
              </div>
            </button>
          </div>
        </div>

        {showProfileMenu && <div className="drawer-backdrop" onClick={() => setShowProfileMenu(false)} />}
        <div className={`profile-drawer ${showProfileMenu ? "open" : ""}`}>
          <div className="drawer-head">
            <div>
              <div className="drawer-title">Admin Profile</div>
              <p className="drawer-sub">Profile snapshot & quick actions</p>
            </div>
            <button className="icon-chip ghost" aria-label="Close profile" onClick={() => setShowProfileMenu(false)}>
              <X size={16} />
            </button>
          </div>
          <div className="drawer-hero">
            <img
              src={profile.avatar}
              alt="Admin avatar"
              className="drawer-avatar"
            />
            <div className="drawer-name">{profile.name}</div>
            <div className="role-pill admin">SUPER ADMIN</div>
            <p className="drawer-meta">{profile.company}</p>
          </div>
          <div className="drawer-section">
            <h4>Contact</h4>
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
              <User size={16} />
              <div>
                <div className="drawer-label">Company</div>
                <div className="drawer-value">{profile.company}</div>
              </div>
            </div>
          </div>
          <div className="drawer-section">
            <h4>Quick Links</h4>
            <div className="drawer-actions">
              <button
                className="primary-btn sm"
                onClick={() => { navigate('/admin/settings'); setShowProfileMenu(false); }}
              >
                <Settings size={16} />
                Settings
              </button>
              <button
                className="ghost-btn sm"
                onClick={() => { navigate('/admin/users'); setShowProfileMenu(false); }}
              >
                <Users size={16} />
                Manage Users
              </button>
            </div>
          </div>
          <div className="drawer-section">
            <h4>Preferences</h4>
            <label className="toggle-row">
              <span>Email Notifications</span>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            </label>
          </div>
        </div>

        <div className="admin-header">
          <div>
            <h1>Super Admin Dashboard</h1>
            <p>Complete control and overview of your logistics platform</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center gap-1">
                <Shield size={14} />
                Super Admin
              </span>
            </div>
          </div>
        </div>

        <div className="stat-grid">
          {statCards.map(card => (
            <div key={card.label} className={`stat-card ${card.tone}`}>
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-meta">
                <span className="stat-label">{card.label}</span>
                <span className="stat-change">{card.change}</span>
              </div>
              <div className="stat-value">{card.value}</div>
            </div>
          ))}
        </div>

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
                      onClick={async () => {
                        try {
                          const response = await fetch('http://localhost:3001/api/users/' + user.id, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              fullName: profile.name,
                              email: profile.email,
                              phone: profile.phone,
                              company: profile.company
                            })
                          });
                          if (response.ok) {
                            setIsEditing(false);
                          } else {
                            alert('Failed to update profile');
                          }
                        } catch (error) {
                          alert('Error updating profile');
                        }
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
                <div className="relative">
                  <img
                    src={profile.avatar}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {tab === "overview" && (
          <>
            <div className="freight-grid">
              {freightTiles.map(tile => (
                <div key={tile.label} className={`freight-card ${tile.tone}`}>
                  <div className="freight-icon">{tile.icon}</div>
                  <div className="freight-content">
                    <div className="freight-label">{tile.label}</div>
                    <div className="freight-value">{tile.value}</div>
                    <div className="freight-copy">{tile.copy}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="actions-row">
              {actions.map(action => (
                <button key={action.label} className={`action-btn ${action.tone}`} onClick={() => {
                  if (action.label === "New Shipment") navigate('/admin/shipments/new');
                  else if (action.label === "Add User") navigate('/admin/users/new');
                  else if (action.label === "Generate Report") navigate('/admin/reports/generate');
                  else if (action.label === "Settings") navigate('/admin/settings');
                  else return;
                }}>
                  <span className="action-icon">{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {tab === "shipments" && (
          <div className="panel">
            <div className="panel-head">
              <h3>Recent Shipments</h3>
              <button className="primary-chip" onClick={() => navigate('/admin/shipments/new')}>New Shipment</button>
            </div>
            <div className="table">
              <div className="table-head">
                <span>ID</span>
                <span>Customer</span>
                <span>Origin</span>
                <span>Destination</span>
                <span>Type</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {shipments.map(ship => (
                <div key={ship.id} className="table-row">
                  <span>{ship.id}</span>
                  <span>{ship.customer}</span>
                  <span>{ship.origin}</span>
                  <span>{ship.destination}</span>
                  <span>{ship.type}</span>
                  <span>
                    <span className={`pill ${ship.status.replace(" ", "-").toLowerCase()}`}>{ship.status}</span>
                  </span>
                  <span>
                    <button
                      className="link"
                      onClick={() => navigate(`/admin/shipments/${ship.id}`)}
                    >
                      View Details
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="panel">
            <div className="panel-head">
              <h3>User Management</h3>
              <button className="primary-chip" onClick={() => navigate('/admin/users/new')}>Add User</button>
            </div>
            <div className="table">
              <div className="table-head">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
                <span>Shipments</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {users.map(user => (
                <div key={user.email} className="table-row">
                  <span>{user.name}</span>
                  <span>{user.email}</span>
                  <span>{user.role}</span>
                  <span>{user.shipments}</span>
                  <span><span className="pill success">{user.status}</span></span>
                  <span className="link" onClick={() => navigate('/admin/users')}>Edit</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "payments" && (
          <div className="panel">
            <div className="panel-head">
              <h3>Payment Management</h3>
              <p>Monitor and manage all payment transactions</p>
            </div>

            <div className="payment-stats">
              <div className="stat-card green">
                <div className="stat-icon"><DollarSign /></div>
                <div className="stat-meta">
                  <span className="stat-label">Total Revenue</span>
                  <span className="stat-change">+15%</span>
                </div>
                <div className="stat-value">$45,230</div>
              </div>
              <div className="stat-card blue">
                <div className="stat-icon"><Package /></div>
                <div className="stat-meta">
                  <span className="stat-label">Paid Invoices</span>
                  <span className="stat-change">+8%</span>
                </div>
                <div className="stat-value">156</div>
              </div>
              <div className="stat-card yellow">
                <div className="stat-icon"><TrendingUp /></div>
                <div className="stat-meta">
                  <span className="stat-label">Pending Payments</span>
                  <span className="stat-change">-3%</span>
                </div>
                <div className="stat-value">23</div>
              </div>
            </div>

            <div className="table">
              <div className="table-head">
                <span>Reference</span>
                <span>Client</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Date</span>
                <span>Actions</span>
              </div>
              {/* Mock payment data - replace with real data */}
              <div className="table-row">
                <span>PAY-1234567890</span>
                <span>John Doe</span>
                <span>$1,250.00</span>
                <span><span className="pill success">Completed</span></span>
                <span>2024-01-15</span>
                <span><button className="link">View Details</button></span>
              </div>
              <div className="table-row">
                <span>PAY-0987654321</span>
                <span>Jane Smith</span>
                <span>$850.00</span>
                <span><span className="pill pending">Pending</span></span>
                <span>2024-01-14</span>
                <span><button className="link">View Details</button></span>
              </div>
              <div className="table-row">
                <span>PAY-1122334455</span>
                <span>Bob Johnson</span>
                <span>$2,100.00</span>
                <span><span className="pill success">Completed</span></span>
                <span>2024-01-13</span>
                <span><button className="link">View Details</button></span>
              </div>
            </div>
          </div>
        )}

        {tab === "media" && (
           <div className="panel">
             <div className="panel-head">
               <h3>Media Upload</h3>
             </div>

             <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
               <UploadCloud size={56} />
               <h4>Upload Files</h4>
               <p>Drag and drop files here, or click to browse</p>
               <span className="muted">Supports: Images, Videos, Documents</span>
               {uploading && <p>Uploading...</p>}
             </div>
             <input
               type="file"
               multiple
               ref={fileInputRef}
               onChange={handleFileChange}
               style={{ display: 'none' }}
             />
             {uploadedFiles.length > 0 && (
               <div className="uploaded-files">
                 <h4>Uploaded Files:</h4>
                 <ul>
                   {uploadedFiles.map((url, index) => (
                     <li key={index}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
                   ))}
                 </ul>
               </div>
             )}

             <div className="info-box">
               <strong>Note:</strong> Cloudinary integration is ready for production. To enable uploads, add your Cloudinary credentials in the CloudinaryUpload component:
               <ul>
                 <li>Cloud Name</li>
                 <li>Upload Preset (unsigned)</li>
               </ul>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}
