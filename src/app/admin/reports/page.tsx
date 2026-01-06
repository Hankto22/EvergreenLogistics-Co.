"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Download, Calendar, BarChart3, TrendingUp, DollarSign, Package, Users, Eye, Plus } from "lucide-react";

const AdminReports = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock data - in real app this would come from API
  const reports = [
    {
      id: "RPT-001",
      title: "Monthly Shipment Summary",
      type: "Shipments",
      period: "December 2025",
      generatedDate: "2025-12-30",
      status: "Ready",
      size: "2.4 MB",
      downloads: 15
    },
    {
      id: "RPT-002",
      title: "Revenue Report Q4 2025",
      type: "Financial",
      period: "October - December 2025",
      generatedDate: "2025-12-28",
      status: "Ready",
      size: "1.8 MB",
      downloads: 8
    },
    {
      id: "RPT-003",
      title: "Client Performance Analysis",
      type: "Analytics",
      period: "November 2025",
      generatedDate: "2025-12-25",
      status: "Ready",
      size: "3.1 MB",
      downloads: 22
    },
    {
      id: "RPT-004",
      title: "Staff Productivity Report",
      type: "HR",
      period: "December 2025",
      generatedDate: "2025-12-20",
      status: "Ready",
      size: "1.2 MB",
      downloads: 5
    }
  ];

  const reportTypes = [
    {
      title: "Shipment Reports",
      description: "Track cargo movement, delivery times, and performance metrics",
      icon: <Package className="h-8 w-8 text-blue-600" />,
      count: 12,
      color: "blue"
    },
    {
      title: "Financial Reports",
      description: "Revenue, expenses, profitability, and financial KPIs",
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      count: 8,
      color: "green"
    },
    {
      title: "Client Reports",
      description: "Client satisfaction, shipment volumes, and service quality",
      icon: <Users className="h-8 w-8 text-purple-600" />,
      count: 15,
      color: "purple"
    },
    {
      title: "Operational Reports",
      description: "Staff performance, system usage, and efficiency metrics",
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      count: 6,
      color: "orange"
    }
  ];

  const handleGenerateReport = () => {
    navigate('/admin/reports/generate');
  };

  const handleDownloadReport = (reportId: string) => {
    // In real app, this would trigger a download
    alert(`Downloading report ${reportId}`);
  };

  const handleViewReport = (reportId: string) => {
    // In real app, this would open report viewer
    alert(`Viewing report ${reportId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Generate and manage comprehensive business reports.</p>
          </div>
          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Generate New Report
          </button>
        </div>
      </div>

      {/* Report Types Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((type, index) => (
          <motion.div
            key={type.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/admin/reports?type=${type.title.toLowerCase().replace(' ', '-')}`)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${type.color}-100`}>
                {type.icon}
              </div>
              <span className="text-2xl font-bold text-gray-900">{type.count}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.title}</h3>
            <p className="text-sm text-gray-600">{type.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Recent Reports</h3>
            <span className="text-sm text-gray-500">({reports.length} reports)</span>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Reports Table */}
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
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
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
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{report.title}</div>
                      <div className="text-sm text-gray-500">{report.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.generatedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewReport(report.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View report"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownloadReport(report.id)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Download report"
                      >
                        <Download size={16} />
                      </button>
                      <span className="text-xs text-gray-500">{report.downloads} downloads</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by generating your first report.
            </p>
            <button
              onClick={handleGenerateReport}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Generate Report
            </button>
          </div>
        )}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reports Generated</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Downloads</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-xs text-green-600">+8% from last month</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Scheduled Reports</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-xs text-blue-600">4 auto-generated</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminReports;