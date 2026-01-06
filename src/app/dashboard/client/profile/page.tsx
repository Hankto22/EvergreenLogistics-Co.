import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Edit, Save, X } from "lucide-react";
import type { RootState } from "@/store";
import { useUpdateMeMutation, useChangePasswordMutation } from "../../../../store/authApi";

export default function ClientProfileTab() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.fullName || "John Client",
    email: user?.email || "client@evergreenlogistics.co.ke",
    phone: user?.phone || "+254 700 000 002"
  });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false
  });
  const [profileMessage, setProfileMessage] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");
  const [updateMe, { isLoading: savingProfile }] = useUpdateMeMutation();
  const [changePassword, { isLoading: updatingPassword }] = useChangePasswordMutation();

  useEffect(() => {
    if (!user) return;
    setProfile(prev => ({
      ...prev,
      name: user.fullName || prev.name,
      email: user.email || prev.email,
      phone: user.phone || prev.phone
    }));
  }, [user]);

  useEffect(() => {
    if (!profileMessage) return;
    const timeout = window.setTimeout(() => setProfileMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [profileMessage]);

  useEffect(() => {
    if (!securityMessage) return;
    const timeout = window.setTimeout(() => setSecurityMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [securityMessage]);

  const resetProfileForm = () => {
    setProfile({
      name: user?.fullName || "John Client",
      email: user?.email || "client@evergreenlogistics.co.ke",
      phone: user?.phone || "+254 700 000 002"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid gap-6 md:grid-cols-2 mb-8">
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
                  onClick={async () => {
                    try {
                      const updated = await updateMe({
                        fullName: profile.name,
                        email: profile.email,
                        phone: profile.phone
                      }).unwrap();
                      setProfile({
                        name: updated.fullName || profile.name,
                        email: updated.email || profile.email,
                        phone: updated.phone || profile.phone
                      });
                      setIsEditing(false);
                      setProfileMessage("Profile updated successfully!");
                    } catch (error) {
                      setProfileMessage("Failed to update profile");
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 disabled:opacity-60"
                  disabled={savingProfile}
                >
                  {savingProfile ? "Saving..." : (<><Save size={16} /> Save</>)}
                </button>
                <button
                  onClick={() => {
                    resetProfileForm();
                    setIsEditing(false);
                  }}
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
          </div>
        </div>

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
              onClick={async () => {
                if (security.newPassword !== security.confirmPassword) {
                  setSecurityMessage("Passwords do not match");
                  return;
                }
                if (security.newPassword.length < 6) {
                  setSecurityMessage("Password must be at least 6 characters");
                  return;
                }
                try {
                  await changePassword({
                    currentPassword: security.currentPassword,
                    newPassword: security.newPassword
                  }).unwrap();
                  setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "", twoFactor: security.twoFactor });
                  setSecurityMessage("Security settings updated successfully!");
                } catch (error) {
                  setSecurityMessage("Failed to update password");
                }
              }}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-60"
              disabled={updatingPassword}
            >
              {updatingPassword ? "Updating..." : "Update Security Settings"}
            </button>
            {securityMessage && <p className={`mt-4 ${securityMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>{securityMessage}</p>}
          </div>
        </div>
      </div>
      <div className="mt-4">
        {profileMessage && <p className="text-green-600">{profileMessage}</p>}
      </div>
    </motion.div>
  );
}
