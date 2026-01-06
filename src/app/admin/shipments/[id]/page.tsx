"use client";

import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGetShipmentByIdQuery } from "../../../../store/shipmentApi";
import { AlertCircle, CheckCircle2, Clock, MapPin, Package, Truck, ArrowLeft, Edit, Download } from "lucide-react";

const ShipmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: shipment, isLoading, error } = useGetShipmentByIdQuery(id!);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in transit':
      case 'departed origin':
      case 'arrived destination port':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'processing':
      case 'customs':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
        <span className="ml-2">Loading shipment details...</span>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Shipment Not Found</h2>
          <p className="text-gray-600">The shipment you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => navigate('/admin/shipments')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Shipments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/shipments')}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            <ArrowLeft size={16} />
            Back to Shipments
          </button>
          <div>
            <h1 className="text-2xl font-bold">Shipment Details</h1>
            <p className="text-gray-600">Complete information for shipment {shipment.EVGCode}</p>
          </div>
        </div>

        <motion.div
          className="shipment-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="shipment-head">
            <div>
              <p className="shipment-id">{shipment.EVGCode}</p>
              <p className="shipment-title">{shipment.Description || 'Cargo Shipment'}</p>
              <p className="shipment-code">Code: {shipment.ShipmentCode}</p>
            </div>
            <span className={`status-pill ${shipment.Status === "DELIVERED" ? "active" : "muted"}`}>
              {shipment.Status.replace('_', ' ')}
            </span>
          </div>

          <div className="shipment-meta">
            <div>
              <p className="meta-label">Origin</p>
              <p className="meta-value">
                {shipment.OriginCity}, {shipment.OriginCountry}
              </p>
            </div>
            <div>
              <p className="meta-label">Destination</p>
              <p className="meta-value">
                {shipment.DestinationCity}, {shipment.DestinationCountry}
              </p>
            </div>
            <div>
              <p className="meta-label">Transport Mode</p>
              <p className="meta-value">{shipment.TransportMode || 'Not specified'}</p>
            </div>
            <div>
              <p className="meta-label">ETA</p>
              <p className="meta-value">
                {shipment.EstimatedDeliveryDate ? formatDate(shipment.EstimatedDeliveryDate) : 'TBD'}
              </p>
            </div>
          </div>

          <div className="additional-info">
            <div className="info-row">
              <span className="info-label">Client:</span>
              <span className="info-value">{shipment.client?.fullName || 'Unknown Client'}</span>
            </div>
            {shipment.BillOfLading && (
              <div className="info-row">
                <span className="info-label">Bill of Lading:</span>
                <span className="info-value">{shipment.BillOfLading}</span>
              </div>
            )}
            <div className="info-row">
              <span className="info-label">Created:</span>
              <span className="info-value">{shipment.CreatedAt ? formatDate(shipment.CreatedAt) : 'Unknown'}</span>
            </div>
            {shipment.UpdatedAt && (
              <div className="info-row">
                <span className="info-label">Last Updated:</span>
                <span className="info-value">{formatDate(shipment.UpdatedAt)}</span>
              </div>
            )}
          </div>

          <div className="progress-bar">
            <span style={{ width: `${shipment.ProgressPercent}%` }} />
          </div>

          {/* Containers Section */}
          {shipment.containers && shipment.containers.length > 0 && (
            <div className="containers-section">
              <h4>Containers</h4>
              {shipment.containers.map(container => (
                <div key={container.containerNumber} className="container-card">
                  <div className="container-header">
                    <div className="container-info">
                      <Package className="w-4 h-4" />
                      <span className="container-number">{container.containerNumber}</span>
                    </div>
                    <span className={`status-pill small ${container.status === "DELIVERED" ? "active" : "muted"}`}>
                      {container.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Tracking Events */}
                  <div className="tracking-events">
                    {container.trackingEvents
                      .sort((a, b) => new Date(b.eventTime).getTime() - new Date(a.eventTime).getTime())
                      .map(event => (
                        <div key={event.eventTime} className="milestone">
                          {getStatusIcon(event.status)}
                          <div>
                            <p className="milestone-label">{event.status.replace('_', ' ')}</p>
                            <p className="milestone-meta">
                              {event.location && <><MapPin className="w-3 h-3 inline" /> {event.location} • </>}
                              {formatDate(event.eventTime)}
                            </p>
                            {event.notesCustomer && (
                              <p className="milestone-notes">{event.notesCustomer}</p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="shipment-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/admin/shipments?edit=${shipment.Id}`)}
            >
              <Edit size={18} />
              Edit Shipment
            </button>
            {shipment.BillOfLading && (
              <button className="btn btn-ghost">
                <Download size={18} />
                Download Documents
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShipmentDetails;
