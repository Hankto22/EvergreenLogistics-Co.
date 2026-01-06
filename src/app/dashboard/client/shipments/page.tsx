import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  MapPin,
  Search,
  Eye,
  Download
} from "lucide-react";
import type { RootState } from "@/store";
import { useGetUserShipmentsQuery } from "../../../../store/shipmentApi";

export default function ClientShipmentsTab() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const {
    data: shipmentsData,
    isLoading,
    isError,
    refetch
  } = useGetUserShipmentsQuery();

  useEffect(() => {
    if (!actionMessage) return;
    const timer = window.setTimeout(() => setActionMessage(""), 2500);
    return () => window.clearTimeout(timer);
  }, [actionMessage]);

  const filteredShipments = useMemo(
    () =>
      (shipmentsData || []).filter(s => {
        const query = searchQuery.toLowerCase();
        return (
          s.EVGCode.toLowerCase().includes(query) ||
          (s.Description || "").toLowerCase().includes(query) ||
          (s.TransportMode || "").toLowerCase().includes(query)
        );
      }),
    [shipmentsData, searchQuery]
  );

  const handleTrackShipment = () => {
    const code = trackingCode.trim().toUpperCase();
    if (!code) {
      setActionMessage("Enter an EVG tracking code to continue");
      return;
    }
    navigate(`/tracking?code=${code}`);
  };

  const handleDownload = (evgCode: string) => {
    setActionMessage(`Download link for ${evgCode} will be available soon.`);
  };

  return (
    <section className="client-section">
      <div className="section-head">
        <h2>My Shipments</h2>
        <p className="text-sm text-gray-500">
          Hi {user?.fullName || "Client"}, track and manage your shipments here.
        </p>
      </div>

      <div className="panel mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-medium">Track with EVG code</p>
            <p className="text-sm text-gray-500">Use the EVG code you received after booking.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., EVG123456"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
            />
            <button className="primary-btn sm" onClick={handleTrackShipment}>Track</button>
          </div>
        </div>
      </div>

      {isError && (
        <div className="panel mb-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-red-600">We could not load your shipments. Please retry.</p>
            <button className="primary-btn sm" onClick={() => refetch()}>Retry</button>
          </div>
        </div>
      )}

      <div className="client-search">
        <Search size={18} />
        <input
          placeholder="Search shipments by ID or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="panel">Loading your shipments...</div>
      ) : filteredShipments.length === 0 ? (
        <div className="panel">
          <p className="text-sm text-gray-600">No shipments found for your search.</p>
        </div>
      ) : (
        <div className="shipment-list">
          {filteredShipments.map(ship => (
            <div key={ship.Id} className="shipment-card">
              <div className="shipment-top">
                <div>
                  <div className="shipment-id">{ship.EVGCode}</div>
                  <div className="shipment-title">{ship.Description || 'Cargo Shipment'}</div>
                  <div className="shipment-sub">{ship.TransportMode || 'Unknown'}</div>
                </div>
                <span className={`pill ${ship.Status.replace(" ", "-").toLowerCase()}`}>{ship.Status}</span>
              </div>

              <div className="shipment-meta">
                <div>
                  <div className="meta-label">Origin</div>
                  <div className="meta-value flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{ship.OriginCity}, {ship.OriginCountry}</span>
                  </div>
                </div>
                <div>
                  <div className="meta-label">Destination</div>
                  <div className="meta-value flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{ship.DestinationCity}, {ship.DestinationCountry}</span>
                  </div>
                </div>
                <div className="eta">
                  <Clock size={16} />
                  <span>ETA: {ship.EstimatedDeliveryDate ? new Date(ship.EstimatedDeliveryDate).toLocaleDateString() : 'TBD'}</span>
                </div>
              </div>

              <div className="progress-row">
                <div className="progress-label">Delivery Progress</div>
                <div className="progress-bar">
                  <span style={{ width: `${ship.ProgressPercent}%` }} />
                </div>
              </div>

              <div className="timeline">
                {(ship.containers?.flatMap(container =>
                  container.trackingEvents.map(event => ({
                    label: event.status.replace(/_/g, ' '),
                    location: event.location || 'Unknown',
                    date: new Date(event.eventTime).toLocaleDateString(),
                    done: true
                  }))
                ) || []).slice(-3).map((event, index) => (
                  <div key={index} className="timeline-row">
                    <span className="timeline-dot done" />
                    <div>
                      <div className="timeline-label">{event.label}</div>
                      <div className="timeline-sub">{event.location} - {event.date}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="shipment-actions">
                <button className="primary-btn" onClick={() => navigate(`/tracking?code=${ship.EVGCode}`)}>
                  <Eye size={18} />
                  View Details
                </button>
                <button className="ghost-btn" onClick={() => handleDownload(ship.EVGCode)}>
                  <Download size={18} />
                  Download Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {actionMessage && <p className="mt-4 text-sm text-green-700">{actionMessage}</p>}
    </section>
  );
}
