"use client";

import { useMemo, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, CheckCircle2, Clock, AlertTriangle, UploadCloud, CheckSquare, User, Edit, Save, X, Shield, Camera, Bell, ChevronDown, Search, Mail, Phone, MapPin, Truck } from "lucide-react";
import type { RootState } from "@/store";
import { useGetAllowedNextStatusesQuery, useCreateTrackingEventMutation, useGetStaffDashboardQuery, useGetShipmentsQuery, useGetNotificationsQuery, useGetUserUploadsQuery, useUploadMediaMutation } from "../../../store/shipmentApi";

type Priority = "All" | "High" | "Medium" | "Low";
type TabKey = "profile" | "tasks" | "shipments" | "uploads";

export default function StaffDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const { data: dashboardStats } = useGetStaffDashboardQuery();
  const { data: shipmentsData } = useGetShipmentsQuery({});
  const { data: notificationsData } = useGetNotificationsQuery();
  const { data: uploadsData } = useGetUserUploadsQuery();

  const stats = dashboardStats ? [
    { label: "Assigned Shipments", value: dashboardStats.assignedShipments.toString(), tone: "indigo", icon: <Package size={20} /> },
    { label: "Completed Today", value: dashboardStats.completedToday.toString(), tone: "mint", icon: <CheckCircle2 size={20} /> },
    { label: "Pending", value: dashboardStats.pendingTasks.toString(), tone: "amber", icon: <Clock size={20} /> },
    { label: "Urgent", value: dashboardStats.urgentTasks.toString(), tone: "rose", icon: <AlertTriangle size={20} /> }
  ] : [
    { label: "Assigned Shipments", value: "0", tone: "indigo", icon: <Package size={20} /> },
    { label: "Completed Today", value: "0", tone: "mint", icon: <CheckCircle2 size={20} /> },
    { label: "Pending", value: "0", tone: "amber", icon: <Clock size={20} /> },
    { label: "Urgent", value: "0", tone: "rose", icon: <AlertTriangle size={20} /> }
  ];

  const tasks = shipmentsData ? shipmentsData.slice(0, 4).map(shipment => ({
    title: `Process ${shipment.Status.toLowerCase()} for ${shipment.EVGCode}`,
    shipment: shipment.EVGCode,
    priority: shipment.ProgressPercent < 25 ? "High" : shipment.ProgressPercent < 75 ? "Medium" : "Low"
  })) : [];

  const shipments = shipmentsData ? shipmentsData.map(shipment => ({
    id: shipment.Id,
    evgCode: shipment.EVGCode,
    customer: shipment.client?.fullName || "Unknown Client",
    origin: shipment.OriginCity ? `${shipment.OriginCity}, ${shipment.OriginCountry}` : "Unknown",
    destination: shipment.DestinationCity ? `${shipment.DestinationCity}, ${shipment.DestinationCountry}` : "Unknown",
    status: shipment.Status,
    progress: shipment.ProgressPercent,
    containers: shipment.containers?.map(c => ({
      id: c.containerNumber, // Use containerNumber as id for now
      containerNumber: c.containerNumber,
      status: c.status
    })) || []
  })) : [];

  const uploads = uploadsData ? uploadsData.slice(0, 3).map(upload => ({
    title: `Upload from ${new Date(upload.createdAt).toLocaleDateString()}`,
    type: upload.mediaType?.toUpperCase() || "FILE",
    status: "Uploaded"
  })) : [];

  const staffNotifications = notificationsData ? notificationsData.slice(0, 3).map(notification => ({
    title: notification.message || "Notification",
    time: new Date(notification.createdAt).toLocaleString()
  })) : [];

  const [tab, setTab] = useState<TabKey>("profile");
  const [priority, setPriority] = useState<Priority>("All");
  const [isEditing, setIsEditing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [activeNotification, setActiveNotification] = useState<typeof staffNotifications[number] | null>(null);
  const [profile, setProfile] = useState({
    name: "Jane Staff",
    email: user?.email || "staff@evergreenlogistics.co.ke",
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

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedContainer, setSelectedContainer] = useState<{ id: string; containerNumber: string; shipmentEvgCode: string } | null>(null);
  const [updateForm, setUpdateForm] = useState({
    status: "",
    location: "",
    notesCustomer: "",
    notesInternal: "",
    notifyCustomer: true,
    eventTime: ""
  });
  const [updateMessage, setUpdateMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadMedia, { isLoading: uploadingFile }] = useUploadMediaMutation();
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const filteredTasks = useMemo(
    () => tasks.filter(t => priority === "All" || t.priority === priority),
    [priority, tasks]
  );

  const { data: allowedStatuses, isLoading: loadingStatuses } = useGetAllowedNextStatusesQuery(
    selectedContainer?.id || "",
    { skip: !selectedContainer?.id }
  );
  const [createTrackingEvent, { isLoading: updatingStatus }] = useCreateTrackingEventMutation();

  // Container update handlers
  const handleOpenUpdateModal = (containerId: string, containerNumber: string, shipmentEvgCode: string) => {
    setSelectedContainer({ id: containerId, containerNumber, shipmentEvgCode });
    setUpdateForm({
      status: "",
      location: "",
      notesCustomer: "",
      notesInternal: "",
      notifyCustomer: true,
      eventTime: new Date().toISOString().slice(0, 16)
    });
    setUpdateMessage("");
    setShowUpdateModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedContainer || !updateForm.status) return;

    try {
      await createTrackingEvent({
        containerId: selectedContainer.id,
        data: {
          status: updateForm.status,
          eventTime: updateForm.eventTime || new Date().toISOString(),
          location: updateForm.location,
          notesCustomer: updateForm.notesCustomer,
          notesInternal: updateForm.notesInternal,
          notifyCustomer: updateForm.notifyCustomer
        }
      }).unwrap();

      setUpdateMessage("Container status updated successfully!");
      setTimeout(() => {
        setShowUpdateModal(false);
        setSelectedContainer(null);
      }, 2000);
    } catch (error: any) {
      setUpdateMessage(error?.data?.message || "Failed to update container status");
    }
  };

  const handleStaffUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mediaType = file.type.startsWith("image")
      ? "image"
      : file.type.startsWith("video")
        ? "video"
        : "document";
    try {
      await uploadMedia({ file, mediaType }).unwrap();
      setUploadMessage("File uploaded successfully");
    } catch (error: any) {
      setUploadMessage(error?.data?.message || "Failed to upload file");
    } finally {
      e.target.value = "";
    }
  };

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
                    <button className="primary-chip" onClick={() => navigate(`/admin/shipments/${task.shipment}`)}>View Shipment</button>
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
                    <div className="shipment-id">{ship.evgCode}</div>
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

                {/* Containers */}
                <div className="shipment-containers">
                  <h5>Containers</h5>
                  {ship.containers.map(container => (
                    <div key={container.id} className="container-row">
                      <div className="container-info">
                        <Package size={14} />
                        <span>{container.containerNumber}</span>
                        <span className={`status-badge ${container.status.toLowerCase()}`}>
                          {container.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <button
                        className="update-btn"
                        onClick={() => handleOpenUpdateModal(container.id, container.containerNumber, ship.evgCode)}
                      >
                        Update
                      </button>
                    </div>
                  ))}
                </div>

                <div className="shipment-actions">
                  <button className="ghost-btn" onClick={() => navigate(`/admin/shipments/${ship.id}`)}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "uploads" && (
          <div className="panel upload-panel">
            <h3>Upload Documents</h3>
            <div className="upload-list">
              {uploads.map((file: typeof uploads[number]) => (
                <div key={file.title} className="upload-row">
                  <div>
                    <div className="upload-title">{file.title}</div>
                    <div className="upload-sub">{file.type}</div>
                  </div>
                  <span className="pill info">{file.status}</span>
                </div>
              ))}
            </div>
            <input
              type="file"
              ref={uploadInputRef}
              className="hidden"
              onChange={handleStaffUpload}
            />
            <button className="primary-btn" disabled={uploadingFile} onClick={() => uploadInputRef.current?.click()}>
              <UploadCloud size={18} />
              {uploadingFile ? "Uploading..." : "Upload New File"}
            </button>
            {uploadMessage && <p className="mt-3 text-sm text-green-700">{uploadMessage}</p>}
          </div>
        )}

        {/* Container Update Modal */}
        {showUpdateModal && selectedContainer && (
          <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Update Container Status</h3>
                <button className="modal-close" onClick={() => setShowUpdateModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="container-info-display">
                  <div className="info-row">
                    <Package size={16} />
                    <span>Container: {selectedContainer.containerNumber}</span>
                  </div>
                  <div className="info-row">
                    <Truck size={16} />
                    <span>Shipment: {selectedContainer.shipmentEvgCode}</span>
                  </div>
                </div>

                <form className="update-form">
                  <div className="form-group">
                    <label>New Status *</label>
                    {loadingStatuses ? (
                      <div className="loading-spinner">Loading allowed statuses...</div>
                    ) : (
                      <select
                        value={updateForm.status}
                        onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                        required
                      >
                        <option value="">Select status</option>
                        {allowedStatuses?.map(status => (
                          <option key={status} value={status}>
                            {status.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Event Time</label>
                    <input
                      type="datetime-local"
                      value={updateForm.eventTime}
                      onChange={(e) => setUpdateForm({ ...updateForm, eventTime: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={updateForm.location}
                      onChange={(e) => setUpdateForm({ ...updateForm, location: e.target.value })}
                      placeholder="e.g., Port of Mombasa"
                    />
                  </div>

                  <div className="form-group">
                    <label>Customer Notes</label>
                    <textarea
                      value={updateForm.notesCustomer}
                      onChange={(e) => setUpdateForm({ ...updateForm, notesCustomer: e.target.value })}
                      placeholder="Notes visible to customer"
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label>Internal Notes</label>
                    <textarea
                      value={updateForm.notesInternal}
                      onChange={(e) => setUpdateForm({ ...updateForm, notesInternal: e.target.value })}
                      placeholder="Internal staff notes"
                      rows={2}
                    />
                  </div>

                  <div className="form-group checkbox">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={updateForm.notifyCustomer}
                        onChange={(e) => setUpdateForm({ ...updateForm, notifyCustomer: e.target.checked })}
                      />
                      <span>Notify customer via email</span>
                    </label>
                  </div>

                  {updateMessage && (
                    <div className={`message ${updateMessage.includes('success') ? 'success' : 'error'}`}>
                      {updateMessage}
                    </div>
                  )}
                </form>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setShowUpdateModal(false)}
                  disabled={updatingStatus}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus || !updateForm.status}
                >
                  {updatingStatus ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
