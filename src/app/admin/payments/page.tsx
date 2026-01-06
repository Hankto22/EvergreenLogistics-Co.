"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  RefreshCw,
  Search,
  TrendingUp,
  XCircle
} from "lucide-react";
import { useGetPaymentsQuery, type Payment } from "../../../store/paymentApi";

type PaymentStatus = "completed" | "pending" | "failed" | "cancelled";

const statusConfig: Record<PaymentStatus, { label: string; className: string; icon: any }> = {
  completed: { label: "Completed", className: "bg-green-100 text-green-800", icon: CheckCircle2 },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800", icon: Clock },
  failed: { label: "Failed", className: "bg-red-100 text-red-800", icon: XCircle },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-800", icon: AlertTriangle },
};

const fallbackStatus = { label: "Unknown", className: "bg-gray-100 text-gray-800", icon: AlertTriangle };

const AdminPayments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const { data: payments = [], isLoading, isFetching, refetch } = useGetPaymentsQuery();
  const [feedback, setFeedback] = useState<string | null>(null);

  const getInvoiceCode = (payment: Payment) => payment.invoice?.invoiceCode || payment.invoiceId;

  const getEvgCode = (payment: Payment) =>
    payment.invoice?.shipment?.evgCode || payment.invoice?.shipment?.shipmentCode || "";

  const getClientName = (payment: Payment) =>
    payment.invoice?.shipment?.client?.fullName || "Unknown client";

  const getClientEmail = (payment: Payment) =>
    payment.invoice?.shipment?.client?.email || "-";

  const filteredPayments = useMemo(
    () =>
      payments.filter((payment) => {
        const query = searchQuery.toLowerCase();
        const invoiceCode = getInvoiceCode(payment).toLowerCase();
        const evgCode = getEvgCode(payment).toLowerCase();
        const clientName = getClientName(payment).toLowerCase();
        const matchesSearch =
          payment.reference.toLowerCase().includes(query) ||
          invoiceCode.includes(query) ||
          evgCode.includes(query) ||
          clientName.includes(query);

        const statusKey = (payment.status || "").toLowerCase() as PaymentStatus;
        const matchesStatus = statusFilter === "all" || statusKey === statusFilter;

        return matchesSearch && matchesStatus;
      }),
    [payments, searchQuery, statusFilter]
  );

  const totalRevenue = useMemo(
    () =>
      payments
        .filter((p) => (p.status || "").toLowerCase() === "completed")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [payments]
  );

  const pendingAmount = useMemo(
    () =>
      payments
        .filter((p) => (p.status || "").toLowerCase() === "pending")
        .reduce((sum, p) => sum + Number(p.amount || 0), 0),
    [payments]
  );

  const successRate = useMemo(() => {
    if (!payments.length) return 0;
    const completed = payments.filter((p) => (p.status || "").toLowerCase() === "completed").length;
    return Math.round((completed / payments.length) * 100);
  }, [payments]);

  const handleViewPayment = (payment: Payment) => {
    const invoiceUrl = payment.invoice?.invoiceUrl;
    if (invoiceUrl) {
      window.open(invoiceUrl, "_blank");
      return;
    }
    setFeedback(`Payment ${payment.reference} for invoice ${getInvoiceCode(payment)}`);
  };

  const handleDownloadReceipt = (payment: Payment) => {
    const invoiceUrl = payment.invoice?.invoiceUrl;
    if (invoiceUrl) {
      window.open(invoiceUrl, "_blank");
    } else {
      setFeedback("No receipt available for download yet.");
    }
  };

  if (isLoading && payments.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow">
          <RefreshCw className="animate-spin" size={16} />
          Loading payments...
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
            <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
            <p className="text-gray-600">Monitor and manage all payment transactions and invoices.</p>
            {(isLoading || isFetching) && (
              <p className="text-sm text-blue-600 mt-1">Loading payments...</p>
            )}
            {feedback && <p className="text-sm text-green-700 mt-1">{feedback}</p>}
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
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
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">NGN {totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
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
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">NGN {pendingAmount.toLocaleString()}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
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
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
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
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-600" />
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
                placeholder="Search payments by reference, invoice, EVG code, or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | "all")}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Payments Table */}
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
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => {
                const statusKey = (payment.status || "").toLowerCase() as PaymentStatus;
                const statusInfo = statusConfig[statusKey] || fallbackStatus;
                const StatusIcon = statusInfo.icon;
                const invoiceCode = getInvoiceCode(payment);
                const evgCode = getEvgCode(payment);
                const clientName = getClientName(payment);
                const clientEmail = getClientEmail(payment);
                const amountDisplay = Number(payment.amount || 0).toLocaleString();

                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.reference}</div>
                        <div className="text-sm text-gray-500">{payment.paymentMethod || "N/A"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoiceCode}</div>
                        <div className="text-sm text-gray-500">{evgCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{clientName}</div>
                      <div className="text-sm text-gray-500">{clientEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">NGN {amountDisplay}</div>
                      <div className="text-sm text-gray-500">{payment.currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.className}`}>
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewPayment(payment)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View payment details"
                        >
                          <Eye size={16} />
                        </button>
                        {statusKey === "completed" && (
                          <button
                            onClick={() => handleDownloadReceipt(payment)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Download receipt"
                          >
                            <Download size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "No payment transactions have been recorded yet."}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPayments;
