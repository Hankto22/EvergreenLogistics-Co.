"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Search, Eye, Truck, MapPin, Calendar, TrendingUp, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useGetShipmentsQuery } from "../../../store/shipmentApi";

interface Container {
  containerNumber: string;
  status: string;
  shipmentId: string;
  shipmentCode: string;
  evgCode: string;
  clientName: string;
  origin: string;
  destination: string;
  transportMode: string;
  estimatedDelivery?: string;
  trackingEvents: Array<{
    status: string;
    eventTime: string;
    location?: string;
    notesCustomer?: string;
  }>;
}

const AdminContainers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: shipments, isLoading } = useGetShipmentsQuery({ search: searchQuery || undefined });

  // Flatten containers from shipments
  const containers: Container[] = shipments?.flatMap(shipment =>
    shipment.containers?.map(container => ({
      ...container,
      shipmentId: shipment.Id,
      shipmentCode: shipment.ShipmentCode,
      evgCode: shipment.EVGCode,
      clientName: shipment.client?.fullName || 'Unknown Client',
      origin: `${shipment.OriginCity || ''}, ${shipment.OriginCountry || ''}`.trim(),
      destination: `${shipment.DestinationCity || ''}, ${shipment.DestinationCountry || ''}`.trim(),
      transportMode: shipment.TransportMode || 'Unknown',
      estimatedDelivery: shipment.EstimatedDeliveryDate ? new Date(shipment.EstimatedDeliveryDate).toLocaleDateString() : undefined
    })) || []
  ) || [];

  const filteredContainers = containers.filter(container => {
    const matchesSearch =
      container.containerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      container.shipmentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      container.evgCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      container.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || container.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
    CREATED: { label: "Created", className: "bg-gray-100 text-gray-800", icon: Package },
    BOOKED: { label: "Booked", className: "bg-blue-100 text-blue-800", icon: Package },
    EMPTY_RELEASED: { label: "Empty Released", className: "bg-yellow-100 text-yellow-800", icon: Truck },
    PICKUP_SCHEDULED: { label: "Pickup Scheduled", className: "bg-orange-100 text-orange-800", icon: Clock },
    CARGO_RECEIVED_ORIGIN: { label: "Cargo Received", className: "bg-purple-100 text-purple-800", icon: Package },
    STUFFING_IN_PROGRESS: { label: "Stuffing", className: "bg-indigo-100 text-indigo-800", icon: Package },
    STUFFED_SEALED: { label: "Stuffed & Sealed", className: "bg-green-100 text-green-800", icon: CheckCircle2 },
    GATED_IN_ORIGIN: { label: "Gated In Origin", className: "bg-teal-100 text-teal-800", icon: Truck },
    CUSTOMS_EXPORT_IN_PROGRESS: { label: "Export Customs", className: "bg-cyan-100 text-cyan-800", icon: AlertTriangle },
    CUSTOMS_EXPORT_CLEARED: { label: "Export Cleared", className: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
    LOADED_ON_VESSEL: { label: "Loaded on Vessel", className: "bg-sky-100 text-sky-800", icon: Truck },
    DEPARTED_ORIGIN: { label: "Departed Origin", className: "bg-violet-100 text-violet-800", icon: Truck },
    IN_TRANSIT: { label: "In Transit", className: "bg-blue-100 text-blue-800", icon: TrendingUp },
    TRANSSHIPMENT_ARRIVED: { label: "Transshipment Arrived", className: "bg-amber-100 text-amber-800", icon: MapPin },
    TRANSSHIPMENT_DEPARTED: { label: "Transshipment Departed", className: "bg-lime-100 text-lime-800", icon: Truck },
    ARRIVED_DESTINATION_PORT: { label: "Arrived Destination", className: "bg-rose-100 text-rose-800", icon: MapPin },
    DISCHARGED: { label: "Discharged", className: "bg-pink-100 text-pink-800", icon: Package },
    AVAILABLE_FOR_PICKUP: { label: "Available for Pickup", className: "bg-fuchsia-100 text-fuchsia-800", icon: Package },
    CUSTOMS_IMPORT_IN_PROGRESS: { label: "Import Customs", className: "bg-slate-100 text-slate-800", icon: AlertTriangle },
    CUSTOMS_IMPORT_CLEARED: { label: "Import Cleared", className: "bg-neutral-100 text-neutral-800", icon: CheckCircle2 },
    RELEASED_FROM_TERMINAL: { label: "Released from Terminal", className: "bg-stone-100 text-stone-800", icon: Truck },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", className: "bg-red-100 text-red-800", icon: Truck },
    DELIVERED: { label: "Delivered", className: "bg-green-100 text-green-800", icon: CheckCircle2 },
    EMPTY_RETURNED: { label: "Empty Returned", className: "bg-gray-100 text-gray-800", icon: Truck },
    CLOSED: { label: "Closed", className: "bg-gray-100 text-gray-800", icon: Package },
    ON_HOLD: { label: "On Hold", className: "bg-red-100 text-red-800", icon: AlertTriangle },
    ROLLED_OVER: { label: "Rolled Over", className: "bg-yellow-100 text-yellow-800", icon: Calendar },
    DAMAGED_REPORTED: { label: "Damage Reported", className: "bg-red-100 text-red-800", icon: AlertTriangle },
    CANCELLED: { label: "Cancelled", className: "bg-gray-100 text-gray-800", icon: AlertTriangle }
  };

  const handleViewContainer = (containerNumber: string) => {
    // Navigate to shipment details page with container focus
    const container = containers.find(c => c.containerNumber === containerNumber);
    if (container) {
      navigate(`/admin/shipments/${container.shipmentId}`);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading containers...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Container Management</h1>
            <p className="text-gray-600">Monitor and manage all shipment containers and their tracking status.</p>
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
              <p className="text-sm text-gray-600">Total Containers</p>
              <p className="text-2xl font-bold text-gray-900">{containers.length}</p>
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
                {containers.filter(c => c.status === "IN_TRANSIT").length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
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
                {containers.filter(c => c.status === "DELIVERED").length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
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
              <p className="text-sm text-gray-600">On Hold</p>
              <p className="text-2xl font-bold text-gray-900">
                {containers.filter(c => c.status === "ON_HOLD").length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
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
                placeholder="Search containers by number, shipment code, EVG code, or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="CREATED">Created</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Containers Table */}
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
                  Container
                </th>
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
                  Last Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContainers.map((container) => {
                const statusInfo = statusConfig[container.status] || statusConfig.CREATED;
                const StatusIcon = statusInfo.icon;
                const lastEvent = container.trackingEvents[container.trackingEvents.length - 1];

                return (
                  <tr key={container.containerNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{container.containerNumber}</div>
                        <div className="text-sm text-gray-500">{container.transportMode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{container.shipmentCode}</div>
                        <div className="text-sm text-gray-500">{container.evgCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{container.clientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{container.origin}</div>
                      <div className="text-sm text-gray-500">to {container.destination}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.className}`}>
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lastEvent ? (
                        <div>
                          <div className="text-sm text-gray-900">{lastEvent.status.replace(/_/g, ' ')}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(lastEvent.eventTime).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No events</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewContainer(container.containerNumber)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View container details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredContainers.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No containers found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Containers will appear here once shipments are created."}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminContainers;