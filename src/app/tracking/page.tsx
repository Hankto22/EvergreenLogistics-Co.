"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetShipmentByEvgCodeQuery, useGetNotificationsQuery } from "../../store/shipmentApi";
import { AlertCircle, CheckCircle2, Clock, MapPin, Package, Truck, X, Eye } from "lucide-react";
import type { RootState } from "../../store";

export default function TrackingPage() {
  const [evgCode, setEvgCode] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get("evg") || params.get("code");
    if (!codeParam) return;

    const formatted = codeParam.trim().toUpperCase();
    setEvgCode(formatted);
    if (/^EVG\d{6}$/.test(formatted)) {
      setSearchCode(formatted);
    }
  }, []);

  const { data: shipment, isLoading, error } = useGetShipmentByEvgCodeQuery(searchCode, {
    skip: !searchCode,
  });

  const { data: notifications } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
  });

  const handleTrack = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const val = evgCode.trim().toUpperCase();
    if (val && /^EVG\d{6}$/.test(val)) {
      setSearchCode(val);
    }
  };

  const handleViewDetails = () => {
    setShowDetailsModal(true);
  };

  const cardAnim = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

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

  return (
    <>
      <section className="page-hero-sub">
        <h1>Shipment Tracking</h1>
        <p>Track your shipments in real-time with detailed container and event information.</p>
      </section>

      <section className="section">
        <div className="content-shell tracking-shell">
          <div className="tracking-form-card">
            <input
              value={evgCode}
              onChange={e => setEvgCode(e.target.value)}
              type="text"
              placeholder="Enter EVG tracking code (e.g., EVG123456)"
              className="tracking-input"
            />
            <button onClick={handleTrack} disabled={!evgCode.trim()}>
              Track Shipment
            </button>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle className="w-5 h-5" />
              <span>Shipment not found. Please check your EVG code and try again.</span>
            </div>
          )}

          {isLoading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <span>Loading shipment details...</span>
            </div>
          )}

          {shipment && (
            <motion.div className="shipment-card" variants={cardAnim} initial="hidden" animate="visible">
              <div className="shipment-head">
                <div>
                  <p className="shipment-id">{shipment.EVGCode}</p>
                  <p className="shipment-title">{shipment.Description || 'Cargo Shipment'}</p>
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
                  <p className="meta-label">ETA</p>
                  <p className="meta-value">
                    {shipment.EstimatedDeliveryDate ? formatDate(shipment.EstimatedDeliveryDate) : 'TBD'}
                  </p>
                </div>
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
                <button className="btn btn-primary" onClick={handleViewDetails}>
                  <Eye size={18} />
                  View Full Details
                </button>
                {shipment.BillOfLading && (
                  <button className="btn btn-ghost">Download Documents</button>
                )}
              </div>
            </motion.div>
          )}

          {/* Customer Notifications */}
          {notifications && notifications.length > 0 && (
            <div className="notifications-section">
              <h3>Recent Updates</h3>
              <div className="notifications-list">
                {notifications.slice(0, 5).map(notification => (
                  <div key={notification.id} className="notification-item">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="notification-message">{notification.message}</p>
                      <p className="notification-time">{formatDate(notification.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Shipment Details Modal */}
      {showDetailsModal && shipment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Shipment Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="shipment-card-modal">
                <div className="shipment-head">
                  <div>
                    <p className="shipment-id">{shipment.EVGCode}</p>
                    <p className="shipment-title">{shipment.Description || 'Cargo Shipment'}</p>
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
                    <span className="info-label">Shipment Code:</span>
                    <span className="info-value">{shipment.ShipmentCode}</span>
                  </div>
                  {shipment.BillOfLading && (
                    <div className="info-row">
                      <span className="info-label">Bill of Lading:</span>
                      <span className="info-value">{shipment.BillOfLading}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="info-label">Progress:</span>
                    <span className="info-value">{shipment.ProgressPercent}%</span>
                  </div>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
