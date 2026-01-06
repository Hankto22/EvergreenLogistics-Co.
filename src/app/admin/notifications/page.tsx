"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Send, Users, Search, Eye, Trash2, Plus, Mail, MessageSquare, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  useGetNotificationsQuery,
  useCreateNotificationMutation,
  useDeleteNotificationMutation,
  type Notification
} from "../../../store/shipmentApi";
import { useGetUsersQuery } from "../../../store/authApi";

const AdminNotifications = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'compose'>('history');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReadState, setSelectedReadState] = useState<"all" | "unread" | "read">("all");
  const { data: notifications = [], isLoading, isFetching } = useGetNotificationsQuery();
  const { data: users = [] } = useGetUsersQuery();
  const [createNotification, { isLoading: sending }] = useCreateNotificationMutation();
  const [deleteNotification, { isLoading: deleting }] = useDeleteNotificationMutation();
  const [composeData, setComposeData] = useState({
    userId: "",
    message: ""
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = (notification.message || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRead =
      selectedReadState === "all" ||
      (selectedReadState === "unread" ? !notification.isRead : notification.isRead);
    return matchesSearch && matchesRead;
  });

  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const readRate = totalNotifications ? Math.round(((totalNotifications - unreadNotifications) / totalNotifications) * 100) : 0;

  const handleSendNotification = async () => {
    if (!composeData.userId || !composeData.message.trim()) {
      setFeedback("Please select a recipient and enter a message.");
      return;
    }
    try {
      await createNotification({
        userId: composeData.userId,
        message: composeData.message.trim(),
      }).unwrap();
      setComposeData({ userId: "", message: "" });
      setActiveTab('history');
      setFeedback("Notification sent successfully");
    } catch (error: any) {
      setFeedback(error?.data?.message || "Failed to send notification");
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await deleteNotification(id).unwrap();
      setFeedback("Notification deleted");
    } catch (error: any) {
      setFeedback(error?.data?.message || "Failed to delete notification");
    }
  };

  const handlePreview = (notification: Notification) => {
    setFeedback(notification.message || "Notification opened");
  };

  if (isLoading && notifications.length === 0) {
    return <div className="p-8 text-center text-gray-600">Loading notifications...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Management</h1>
            <p className="text-gray-600">Send and manage system notifications to users.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Notification History
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'compose'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Plus size={16} className="inline mr-2" />
            Compose New
          </button>
        </div>
      </div>

      {activeTab === 'history' ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sent</p>
                  <p className="text-2xl font-bold text-gray-900">{totalNotifications}</p>
                </div>
                <Send className="h-8 w-8 text-blue-600" />
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
                  <p className="text-sm text-gray-600">Read Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{readRate}%</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
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
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-gray-900">{unreadNotifications}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-600" />
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
                  <p className="text-sm text-gray-600">Active Recipients</p>
                  <p className="text-2xl font-bold text-gray-900">{users?.length || 0}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </motion.div>
          </div>

          {/* Filters */}
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
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <select
                  value={selectedReadState}
                  onChange={(e) => setSelectedReadState(e.target.value as "all" | "unread" | "read")}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Notifications List */}
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
                      Notification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNotifications.map((notification) => (
                    <tr key={notification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">Notification</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{notification.message}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                          notification.isRead ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {notification.isRead ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                          {notification.isRead ? "Read" : "Unread"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePreview(notification)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Delete"
                            disabled={deleting}
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

            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery || selectedType !== "all" ? 'Try adjusting your search or filters.' : 'No notifications have been sent yet.'}
                </p>
              </div>
            )}
          </motion.div>
        </>
      ) : (
        /* Compose Form */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow"
        >
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold mb-6">Compose New Notification</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
                <select
                  value={composeData.userId}
                  onChange={(e) => setComposeData(prev => ({ ...prev, userId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a user</option>
                  {users?.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={composeData.message}
                  onChange={(e) => setComposeData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter notification message"
                />
              </div>

              <p className="text-sm text-gray-600">
                Notifications are delivered directly to the selected user and appear across their dashboards.
              </p>
              {feedback && <p className="text-sm text-green-700">{feedback}</p>}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSendNotification}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send size={16} />
                  Send Notification
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminNotifications;
