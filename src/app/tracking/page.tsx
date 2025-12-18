"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const shipments = [
  {
    id: "SH-102",
    title: "Textile Materials",
    origin: "Shanghai, China",
    destination: "Mombasa, Kenya",
    status: "Customs Clearance",
    eta: "Dec 15, 2025",
    milestones: [
      { label: "Shipped", location: "Shanghai", date: "Dec 3", done: true },
      { label: "Customs clearance", location: "Mombasa", date: "Dec 9", done: true }
    ],
    progress: 82
  },
  {
    id: "SH-103",
    title: "Office Furniture",
    origin: "Guangzhou, China",
    destination: "Nairobi, Kenya",
    status: "Processing",
    eta: "Dec 19, 2025",
    milestones: [
      { label: "Processing", location: "Guangzhou", date: "Dec 10", done: true }
    ],
    progress: 30
  }
];

export default function TrackingPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(shipments);

  const handleTrack = () => {
    const val = q.trim();
    if (!val) return setResults(shipments);
    setResults(shipments.filter(s => s.id.toLowerCase().includes(val.toLowerCase())));
  };

  const cardAnim = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

  return (
    <>
      <section className="page-hero-sub">
        <h1>Shipment Tracking</h1>
        <p>Track your shipments in real-time.</p>
      </section>

      <section className="section">
        <div className="content-shell tracking-shell">
          <div className="tracking-form-card">
            <input value={q} onChange={e => setQ(e.target.value)} type="text" placeholder="Enter tracking number" />
            <button onClick={handleTrack}>Track Shipment</button>
          </div>

          <div className="tracking-grid">
            {results.map(ship => (
              <motion.div key={ship.id} className="shipment-card" variants={cardAnim} initial="hidden" animate="visible">
                <div className="shipment-head">
                  <div>
                    <p className="shipment-id">{ship.id}</p>
                    <p className="shipment-title">{ship.title}</p>
                  </div>
                  <span className={`status-pill ${ship.status === "Processing" ? "muted" : "active"}`}>
                    {ship.status}
                  </span>
                </div>

                <div className="shipment-meta">
                  <div>
                    <p className="meta-label">Origin</p>
                    <p className="meta-value">{ship.origin}</p>
                  </div>
                  <div>
                    <p className="meta-label">Destination</p>
                    <p className="meta-value">{ship.destination}</p>
                  </div>
                  <div>
                    <p className="meta-label">ETA</p>
                    <p className="meta-value">{ship.eta}</p>
                  </div>
                </div>

                <div className="progress-bar">
                  <span style={{ width: `${ship.progress}%` }} />
                </div>

                <div className="milestones">
                  {ship.milestones.map(m => (
                    <div key={m.label} className="milestone">
                      <span className={`dot ${m.done ? "done" : ""}`} />
                      <div>
                        <p className="milestone-label">{m.label}</p>
                        <p className="milestone-meta">{m.location} • {m.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="shipment-actions">
                  <button className="btn btn-primary">View Details</button>
                  <button className="btn btn-ghost">Download Invoice</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
