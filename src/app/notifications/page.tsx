"use client";

import { Bell, Package, AlertCircle, CheckCircle2, UserPlus } from "lucide-react";

type Notification = {
  title: string;
  body: string;
  time: string;
  type: "staff" | "admin" | "user";
  icon: React.JSX.Element;
};

const notifications: Notification[] = [
  {
    title: "Shipment status updated",
    body: "Staff marked SH-003 as In Transit. Admin view refreshed.",
    time: "5m ago",
    type: "staff",
    icon: <Package size={18} />
  },
  {
    title: "Document uploaded",
    body: "Staff uploaded Proof of Delivery for SH-001.",
    time: "25m ago",
    type: "staff",
    icon: <CheckCircle2 size={18} />
  },
  {
    title: "New client request",
    body: "Client requested pickup scheduling for SH-105. Admin notified.",
    time: "1h ago",
    type: "user",
    icon: <AlertCircle size={18} />
  },
  {
    title: "User added",
    body: "Admin created a new Staff account: jane@evergreen.com.",
    time: "3h ago",
    type: "admin",
    icon: <UserPlus size={18} />
  }
];

export default function NotificationsPage() {
  return (
    <div className="notifications-page">
      <div className="notifications-shell">
        <header className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p>Live updates from staff, admin, and client actions</p>
          </div>
          <div className="bell">
            <Bell size={22} />
          </div>
        </header>

        <div className="notifications-feed">
          {notifications.map(note => (
            <div key={note.title} className={`notification-row ${note.type}`}>
              <div className="note-icon">{note.icon}</div>
              <div className="note-copy">
                <div className="note-title">{note.title}</div>
                <div className="note-body">{note.body}</div>
                <div className="note-meta">{note.time}</div>
              </div>
              <span className={`pill ${note.type}`}>{note.type === "user" ? "Client" : note.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
