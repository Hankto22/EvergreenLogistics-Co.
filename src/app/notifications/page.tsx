"use client";

import { Bell, Package } from "lucide-react";
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation } from "../../store/shipmentApi";

export default function NotificationsPage() {
  const { data: notificationsData, isLoading, refetch } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();

  const notifications = notificationsData ? notificationsData.map(notification => ({
    id: notification.id,
    title: "Notification",
    body: notification.message || "Notification details",
    time: new Date(notification.createdAt).toLocaleString(),
    type: "user" as const, // TODO: map from notification.type
    icon: <Package size={18} />,
    isRead: notification.isRead
  })) : [];

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  if (isLoading) {
    return <div>Loading notifications...</div>;
  }

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
            <div key={note.id} className={`notification-row ${note.type}`}>
              <div className="note-icon">{note.icon}</div>
              <div className="note-copy">
                <div className="note-title">{note.title}</div>
                <div className="note-body">{note.body}</div>
                <div className="note-meta">{note.time}</div>
              </div>
              <div className="note-actions">
                {!note.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(note.id)}
                    className="mark-read-btn"
                  >
                    Mark as Read
                  </button>
                )}
                <span className={`pill ${note.type}`}>{note.type === "user" ? "Client" : note.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
