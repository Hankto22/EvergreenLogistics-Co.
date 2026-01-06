"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Settings, Plus, Edit, Trash2, ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

const RolesSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Mock data
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Super Admin",
      description: "Full system access with all permissions",
      permissions: ["all"],
      userCount: 1,
      isSystem: true
    },
    {
      id: "2",
      name: "Staff",
      description: "Can manage shipments, containers, and basic operations",
      permissions: ["shipments.read", "shipments.write", "containers.read", "containers.write", "tracking.read", "tracking.write"],
      userCount: 5,
      isSystem: true
    },
    {
      id: "3",
      name: "Client",
      description: "Can view their shipments and track containers",
      permissions: ["shipments.read_own", "tracking.read_own"],
      userCount: 25,
      isSystem: true
    }
  ]);

  const permissions: Permission[] = [
    { id: "shipments.read", name: "View Shipments", description: "Can view shipment information", category: "Shipments" },
    { id: "shipments.write", name: "Manage Shipments", description: "Can create and edit shipments", category: "Shipments" },
    { id: "shipments.read_own", name: "View Own Shipments", description: "Can only view their own shipments", category: "Shipments" },
    { id: "containers.read", name: "View Containers", description: "Can view container information", category: "Containers" },
    { id: "containers.write", name: "Manage Containers", description: "Can update container status", category: "Containers" },
    { id: "containers.read_own", name: "View Own Containers", description: "Can only view containers from their shipments", category: "Containers" },
    { id: "tracking.read", name: "View Tracking", description: "Can view tracking events", category: "Tracking" },
    { id: "tracking.write", name: "Update Tracking", description: "Can add tracking events", category: "Tracking" },
    { id: "tracking.read_own", name: "View Own Tracking", description: "Can only view tracking for their shipments", category: "Tracking" },
    { id: "users.read", name: "View Users", description: "Can view user information", category: "Users" },
    { id: "users.write", name: "Manage Users", description: "Can create and edit users", category: "Users" },
    { id: "payments.read", name: "View Payments", description: "Can view payment information", category: "Payments" },
    { id: "payments.write", name: "Manage Payments", description: "Can process payments", category: "Payments" },
    { id: "reports.read", name: "View Reports", description: "Can view reports", category: "Reports" },
    { id: "reports.write", name: "Generate Reports", description: "Can create reports", category: "Reports" },
    { id: "settings.read", name: "View Settings", description: "Can view system settings", category: "Settings" },
    { id: "settings.write", name: "Manage Settings", description: "Can modify system settings", category: "Settings" }
  ];

  const categories = [...new Set(permissions.map(p => p.category))];

  const handleEditRole = (role: Role) => {
    setEditingRole({ ...role });
  };

  const handleSaveRole = () => {
    if (!editingRole) return;

    if (editingRole.id) {
      // Update existing role
      setRoles(prev => prev.map(r => r.id === editingRole.id ? editingRole : r));
    } else {
      // Create new role
      const newRole = {
        ...editingRole,
        id: Date.now().toString(),
        userCount: 0,
        isSystem: false
      };
      setRoles(prev => [...prev, newRole]);
    }

    setEditingRole(null);
    setIsCreating(false);
    alert("Role saved successfully!");
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    if (role.isSystem) {
      alert("Cannot delete system roles");
      return;
    }
    if (role.userCount > 0) {
      alert("Cannot delete roles that have assigned users");
      return;
    }

    if (confirm("Are you sure you want to delete this role?")) {
      setRoles(prev => prev.filter(r => r.id !== roleId));
    }
  };

  const togglePermission = (permissionId: string) => {
    if (!editingRole) return;

    const hasPermission = editingRole.permissions.includes(permissionId);
    const newPermissions = hasPermission
      ? editingRole.permissions.filter(p => p !== permissionId)
      : [...editingRole.permissions, permissionId];

    setEditingRole({ ...editingRole, permissions: newPermissions });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/admin/settings')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Settings
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
            <p className="text-gray-600">Manage user roles and their access permissions.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'roles'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users size={16} className="inline mr-2" />
            Roles
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'permissions'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings size={16} className="inline mr-2" />
            Permissions
          </button>
        </div>

        {activeTab === 'roles' ? (
          <div className="space-y-6">
            {/* Roles List */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">User Roles</h3>
              <button
                onClick={() => {
                  setEditingRole({
                    id: "",
                    name: "",
                    description: "",
                    permissions: [],
                    userCount: 0,
                    isSystem: false
                  });
                  setIsCreating(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Create Role
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-6 border"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        {role.name}
                        {role.isSystem && <Shield size={14} className="text-blue-600" />}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Edit role"
                      >
                        <Edit size={16} />
                      </button>
                      {!role.isSystem && role.userCount === 0 && (
                        <button
                          onClick={() => handleDeleteRole(role.id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete role"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Users:</span>
                      <span className="font-medium">{role.userCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Permissions:</span>
                      <span className="font-medium">
                        {role.permissions.includes("all") ? "All" : role.permissions.length}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Permissions Overview */}
            <h3 className="text-lg font-semibold">Permission Categories</h3>

            {categories.map((category) => (
              <div key={category} className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {permissions
                    .filter(p => p.category === category)
                    .map((permission) => (
                      <div key={permission.id} className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900">{permission.name}</h5>
                        <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                        <div className="text-xs text-gray-500 mt-2">ID: {permission.id}</div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Create Role Modal */}
      {(editingRole || isCreating) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-semibold mb-6">
              {isCreating ? "Create New Role" : "Edit Role"}
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Name *
                </label>
                <input
                  type="text"
                  value={editingRole?.name || ""}
                  onChange={(e) => setEditingRole(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter role name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={editingRole?.description || ""}
                  onChange={(e) => setEditingRole(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the role's purpose and responsibilities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Permissions
                </label>

                {categories.map((category) => (
                  <div key={category} className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions
                        .filter(p => p.category === category)
                        .map((permission) => (
                          <label key={permission.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingRole?.permissions.includes(permission.id) || editingRole?.permissions.includes("all")}
                              onChange={() => togglePermission(permission.id)}
                              className="mt-1"
                              disabled={editingRole?.permissions.includes("all")}
                            />
                            <div>
                              <div className="font-medium text-sm">{permission.name}</div>
                              <div className="text-xs text-gray-600">{permission.description}</div>
                            </div>
                          </label>
                        ))}
                    </div>
                  </div>
                ))}

                <div className="mt-4">
                  <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingRole?.permissions.includes("all")}
                      onChange={() => {
                        if (!editingRole) return;
                        const newPermissions = editingRole.permissions.includes("all")
                          ? []
                          : ["all"];
                        setEditingRole({ ...editingRole, permissions: newPermissions });
                      }}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-sm">All Permissions</div>
                      <div className="text-xs text-gray-600">Grant access to all system features</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t">
              <button
                onClick={handleSaveRole}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={16} />
                Save Role
              </button>
              <button
                onClick={() => {
                  setEditingRole(null);
                  setIsCreating(false);
                }}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default RolesSettings;
