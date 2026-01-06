"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Edit } from "lucide-react";

const AdminProfile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.fullName || "Admin User",
    email: user?.email || "admin@evergreenlogistics.co.ke",
    phone: "+254 700 000 000",
    company: "Evergreen Logistics Co. Ltd",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [securityMessage, setSecurityMessage] = useState("");

  const handleSecuritySubmit = () => {
    if (security.newPassword !== security.confirmPassword) {
      setSecurityMessage("Passwords do not match");
      return;
    }
    if (!security.newPassword || security.newPassword.length < 6) {
      setSecurityMessage("Password must be at least 6 characters");
      return;
    }
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setSecurityMessage("Security settings updated successfully!");
    setTimeout(() => setSecurityMessage(""), 3000);
  };

  return (
    <div className="profile-page space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600">Manage your profile here.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b pb-2 text-sm font-medium text-gray-700">
        <button className="tab-btn active">Profile</button>
        <button className="tab-btn" onClick={() => window.location.assign("/admin/dashboard")}>Overview</button>
        <button className="tab-btn" onClick={() => window.location.assign("/admin/shipments")}>Shipments</button>
        <button className="tab-btn" onClick={() => window.location.assign("/admin/users")}>Users</button>
        <button className="tab-btn" onClick={() => window.location.assign("/admin/media")}>Media Upload</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white shadow p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit size={16} /> {isEditing ? "Close" : "Edit"}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold text-gray-900">{profile.name}</p>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700">Full Name</div>
              {isEditing ? (
                <input
                  className="input"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                />
              ) : (
                <div className="text-gray-900">{profile.name}</div>
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Email</div>
              {isEditing ? (
                <input
                  className="input"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                />
              ) : (
                <div className="text-gray-900">{profile.email}</div>
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Phone</div>
              {isEditing ? (
                <input
                  className="input"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                />
              ) : (
                <div className="text-gray-900">{profile.phone}</div>
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Company</div>
              {isEditing ? (
                <input
                  className="input"
                  value={profile.company}
                  onChange={e => setProfile({ ...profile, company: e.target.value })}
                />
              ) : (
                <div className="text-gray-900">{profile.company}</div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Account Security</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                className="input mt-1"
                placeholder="Enter current password"
                value={security.currentPassword}
                onChange={e => setSecurity({ ...security, currentPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                className="input mt-1"
                placeholder="Enter new password"
                value={security.newPassword}
                onChange={e => setSecurity({ ...security, newPassword: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                className="input mt-1"
                placeholder="Confirm new password"
                value={security.confirmPassword}
                onChange={e => setSecurity({ ...security, confirmPassword: e.target.value })}
              />
            </div>
            <div className="pt-2">
              <button
                className="w-full rounded-md bg-black text-white py-3 font-medium hover:bg-gray-900"
                onClick={handleSecuritySubmit}
              >
                Update Security Settings
              </button>
              {securityMessage && (
                <p className={`mt-2 text-sm ${securityMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                  {securityMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
