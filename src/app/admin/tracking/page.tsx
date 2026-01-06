"use client";

import { useState } from "react";
import { useGetShipmentsQuery, useCreateTrackingEventMutation, useGetAllowedNextStatusesQuery } from "../../../store/shipmentApi";
import type { ShipmentResponse, ContainerResponse, CreateTrackingEventRequest } from "../../../store/shipmentApi";

const AdminTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");

  const { data: shipments, isLoading, refetch } = useGetShipmentsQuery({ search: searchTerm || undefined });
  const [createTrackingEvent] = useCreateTrackingEventMutation();

  const { data: allowedStatuses } = useGetAllowedNextStatusesQuery(selectedContainer || "", {
    skip: !selectedContainer,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleStatusUpdate = async (containerId: string) => {
    if (!newStatus) return;

    try {
      const data: CreateTrackingEventRequest = {
        status: newStatus,
        location: location || undefined,
        notesCustomer: notes || undefined,
        notesInternal: notes || undefined,
      };
      await createTrackingEvent({
        containerId,
        data,
      }).unwrap();
      setSelectedContainer(null);
      setNewStatus("");
      setNotes("");
      setLocation("");
      refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Tracking</h1>
        <p className="text-gray-600">Search and update shipment/container tracking information</p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search by container number, shipment code, or EVG code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : shipments && shipments.length > 0 ? (
        <div className="space-y-4">
          {shipments.map((shipment: ShipmentResponse) => (
            <div key={shipment.Id} className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Shipment Details</h3>
                  <p><strong>Code:</strong> {shipment.ShipmentCode}</p>
                  <p><strong>EVG:</strong> {shipment.EVGCode}</p>
                  <p><strong>Status:</strong> {shipment.Status}</p>
                  <p><strong>Progress:</strong> {shipment.ProgressPercent}%</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Route</h3>
                  <p><strong>From:</strong> {shipment.OriginCity}, {shipment.OriginCountry}</p>
                  <p><strong>To:</strong> {shipment.DestinationCity}, {shipment.DestinationCountry}</p>
                  <p><strong>Mode:</strong> {shipment.TransportMode}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Dates</h3>
                  <p><strong>Created:</strong> {formatDate(shipment.CreatedAt || "")}</p>
                  <p><strong>ETA:</strong> {shipment.EstimatedDeliveryDate ? formatDate(shipment.EstimatedDeliveryDate) : "N/A"}</p>
                </div>
              </div>

              {/* Containers */}
              {shipment.containers && shipment.containers.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Containers</h4>
                  <div className="space-y-2">
                    {shipment.containers.map((container: ContainerResponse) => (
                      <div key={container.containerNumber} className="border border-gray-200 rounded p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Container: {container.containerNumber}</span>
                          <span className={`px-2 py-1 rounded text-sm ${
                            container.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                            container.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {container.status}
                          </span>
                        </div>

                        {/* Tracking Events */}
                        {container.trackingEvents && container.trackingEvents.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-1">Recent Events</h5>
                            <div className="space-y-1">
                              {container.trackingEvents.slice(-3).map((event, index) => (
                                <div key={index} className="text-sm text-gray-600">
                                  {formatDate(event.eventTime)} - {event.status}
                                  {event.location && ` at ${event.location}`}
                                  {event.notesCustomer && ` - ${event.notesCustomer}`}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Status Update Form */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedContainer(container.containerNumber)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Update Status
                          </button>
                        </div>

                        {selectedContainer === container.containerNumber && (
                          <div className="mt-4 p-4 bg-gray-50 rounded">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Update Status</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded text-sm"
                              >
                                <option value="">Select new status</option>
                                {allowedStatuses?.map((status) => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                              <input
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <textarea
                              placeholder="Notes"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-4"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusUpdate(container.containerNumber)}
                                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => setSelectedContainer(null)}
                                className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          {searchTerm ? "No shipments found matching your search." : "Enter a search term to find shipments."}
        </div>
      )}
    </div>
  );
};

export default AdminTracking;