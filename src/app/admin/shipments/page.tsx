"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Search, Eye, Edit, Truck, MapPin, Plus, Trash2, RefreshCw, X } from "lucide-react";
import {
  useGetShipmentsQuery,
  useUpdateShipmentMutation,
  useDeleteShipmentMutation,
  type ShipmentResponse
} from "../../../store/shipmentApi";
import { useGetUsersQuery, type UserResponse } from "../../../store/authApi";

type ShipmentStatus = "PROCESSING" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

const AdminShipments = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "all">("all");
  const [editingShipment, setEditingShipment] = useState<ShipmentResponse | null>(null);
  const [editForm, setEditForm] = useState({
    status: "" as ShipmentStatus | "",
    progressPercent: 0,
    assignedStaffId: "",
    estimatedDeliveryDate: "",
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const { data: shipmentsData = [], isLoading, isFetching, refetch } = useGetShipmentsQuery({
    search: searchQuery || undefined,
  });
  const { data: users } = useGetUsersQuery();
  const staff = useMemo(
    () => (users || []).filter((u: UserResponse) => u.role === "staff"),
    [users]
  );
  const [updateShipment, { isLoading: savingShipment }] = useUpdateShipmentMutation();
  const [deleteShipment, { isLoading: deletingShipment }] = useDeleteShipmentMutation();

  const shipments = useMemo(() => shipmentsData, [shipmentsData]);

  const statusConfig: Record<ShipmentStatus, { label: string; className: string }> = {
    PROCESSING: { label: "Processing", className: "bg-yellow-100 text-yellow-800" },
    IN_TRANSIT: { label: "In Transit", className: "bg-blue-100 text-blue-800" },
    DELIVERED: { label: "Delivered", className: "bg-green-100 text-green-800" },
    CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-800" }
  };

  const filteredShipments = useMemo(
    () => shipments.filter(shipment => {
      const matchesSearch =
        shipment.ShipmentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.EVGCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (shipment.client?.fullName || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || shipment.Status === statusFilter;
      return matchesSearch && matchesStatus;
    }),
    [shipments, searchQuery, statusFilter]
  );

  const totalContainers = useMemo(
    () => shipments.reduce((sum, s) => sum + (s.containers?.length || 0), 0),
    [shipments]
  );

  const getTransportIcon = (mode?: string) => {
    switch (mode) {
      case "AIR":
        return <Truck className="h-4 w-4" />;
      case "ROAD":
      case "LAND":
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleViewShipment = (shipmentId: string) => {
    navigate(`/admin/shipments/${shipmentId}`);
  };

  const setEditParam = (id?: string) => {
    const next = new URLSearchParams(searchParams);
    if (id) {
      next.set("edit", id);
    } else {
      next.delete("edit");
    }
    setSearchParams(next, { replace: true });
  };

  const closeEdit = () => {
    setEditingShipment(null);
    setEditParam();
  };

  const openEdit = (shipment: ShipmentResponse) => {
    setEditParam(shipment.Id);
    setEditingShipment(shipment);
    setEditForm({
      status: shipment.Status as ShipmentStatus,
      progressPercent: shipment.ProgressPercent,
      assignedStaffId: shipment.AssignedStaffId || "",
      estimatedDeliveryDate: shipment.EstimatedDeliveryDate
        ? shipment.EstimatedDeliveryDate.toString().slice(0, 10)
        : "",
    });
    setFeedback(null);
  };

  const handleSaveEdit = async () => {
    if (!editingShipment) return;
    try {
      await updateShipment({
        id: editingShipment.Id,
        data: {
          status: editForm.status || undefined,
          progressPercent: editForm.progressPercent,
          assignedStaffId: editForm.assignedStaffId || undefined,
          estimatedDeliveryDate: editForm.estimatedDeliveryDate || undefined,
        },
      }).unwrap();
      setFeedback("Shipment updated");
      closeEdit();
    } catch (error: any) {
      setFeedback(error?.data?.message || "Failed to update shipment");
    }
  };

  const handleDeleteShipment = async (id: string) => {
    const confirmed = window.confirm("Delete this shipment? This cannot be undone.");
    if (!confirmed) return;
    try {
      await deleteShipment(id).unwrap();
      setFeedback("Shipment deleted");
    } catch (error: any) {
      setFeedback(error?.data?.message || "Failed to delete shipment");
    }
  };

  const editParam = searchParams.get("edit");

  useEffect(() => {
    if (!editParam || editingShipment?.Id === editParam) return;
    const match = shipments.find((s) => s.Id === editParam);
    if (match) {
      openEdit(match);
    }
  }, [editParam, shipments, editingShipment]);

  if (isLoading && shipments.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow">
          <RefreshCw className="animate-spin" size={16} />
          Loading shipments...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shipment Management</h1>
            <p className="text-gray-600">Monitor and manage all shipments in the system.</p>
            {(isLoading || isFetching) && (
              <p className="text-sm text-blue-600 mt-1 flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin" />
                Syncing latest data...
              </p>
            )}
            {feedback && (
              <p className="text-sm text-green-700 mt-1">{feedback}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              aria-label="Refresh shipments"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={() => navigate("/admin/shipments/new")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              New Shipment
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Shipments</p>
              <p className="text-2xl font-bold text-gray-900">{shipments.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.Status === "IN_TRANSIT").length}
              </p>
            </div>
            <Truck className="h-8 w-8 text-orange-600" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => s.Status === "DELIVERED").length}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Containers</p>
              <p className="text-2xl font-bold text-gray-900">{totalContainers}</p>
            </div>
            <Package className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search shipments by ID, EVG code, or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | "all")}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="PROCESSING">Processing</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Shipments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ETA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.Id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{shipment.ShipmentCode}</div>
                      <div className="text-sm text-gray-500">{shipment.EVGCode}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {getTransportIcon(shipment.TransportMode)}
                        <span className="text-xs text-gray-500">{shipment.TransportMode || "Unknown"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{shipment.client?.fullName || "Unknown Client"}</div>
                    <div className="text-sm text-gray-500">
                      {shipment.containers?.length || 0} container{(shipment.containers?.length || 0) !== 1 ? "s" : ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{shipment.OriginCity || "-"}</div>
                    <div className="text-sm text-gray-500">to {shipment.DestinationCity || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig[shipment.Status as ShipmentStatus]?.className || "bg-gray-100 text-gray-800"}`}>
                      {statusConfig[shipment.Status as ShipmentStatus]?.label || shipment.Status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${shipment.ProgressPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{shipment.ProgressPercent}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.EstimatedDeliveryDate ? new Date(shipment.EstimatedDeliveryDate).toLocaleDateString() : "TBD"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewShipment(shipment.Id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View shipment details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openEdit(shipment)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Edit shipment"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteShipment(shipment.Id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete shipment"
                        disabled={deletingShipment}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredShipments.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating a new shipment."}
            </p>
          </div>
        )}
      </motion.div>

      {editingShipment && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Edit Shipment</h3>
                <p className="text-sm text-gray-600">{editingShipment.ShipmentCode} • {editingShipment.EVGCode}</p>
              </div>
              <button onClick={() => setEditingShipment(null)} aria-label="Close edit modal" className="text-gray-500 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as ShipmentStatus }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select status</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editForm.progressPercent}
                  onChange={(e) => setEditForm(prev => ({ ...prev, progressPercent: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Staff</label>
                <select
                  value={editForm.assignedStaffId}
                  onChange={(e) => setEditForm(prev => ({ ...prev, assignedStaffId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  {staff.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.fullName} ({member.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery Date</label>
                <input
                  type="date"
                  value={editForm.estimatedDeliveryDate}
                  onChange={(e) => setEditForm(prev => ({ ...prev, estimatedDeliveryDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {feedback && (
                <p className="text-sm text-green-700">{feedback}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeEdit}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingShipment}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {savingShipment ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShipments;
