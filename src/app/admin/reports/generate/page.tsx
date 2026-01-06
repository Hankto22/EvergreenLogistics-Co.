"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, ArrowLeft, Calendar, BarChart3, Users, Package, DollarSign, Settings, Play, Clock } from "lucide-react";

const GenerateReport = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const [formData, setFormData] = useState({
    reportType: "",
    dateRange: "month",
    customStartDate: "",
    customEndDate: "",
    includeCharts: true,
    includeRawData: false,
    format: "pdf",
    recipients: ""
  });

  const reportTypes = [
    {
      id: "shipment-summary",
      title: "Shipment Summary Report",
      description: "Comprehensive overview of all shipments, delivery times, and performance metrics",
      icon: <Package className="h-6 w-6" />,
      estimatedTime: "2-3 minutes",
      dataPoints: ["Total shipments", "Delivery performance", "Route analysis", "Container utilization"]
    },
    {
      id: "financial-report",
      title: "Financial Performance Report",
      description: "Revenue analysis, cost breakdown, profitability metrics, and financial KPIs",
      icon: <DollarSign className="h-6 w-6" />,
      estimatedTime: "3-4 minutes",
      dataPoints: ["Revenue by period", "Cost analysis", "Profit margins", "Client billing"]
    },
    {
      id: "client-analysis",
      title: "Client Performance Analysis",
      description: "Client satisfaction scores, shipment volumes, service quality metrics",
      icon: <Users className="h-6 w-6" />,
      estimatedTime: "2-3 minutes",
      dataPoints: ["Client satisfaction", "Shipment volumes", "Service quality", "Retention rates"]
    },
    {
      id: "operational-metrics",
      title: "Operational Metrics Report",
      description: "Staff productivity, system performance, efficiency metrics, and KPIs",
      icon: <BarChart3 className="h-6 w-6" />,
      estimatedTime: "1-2 minutes",
      dataPoints: ["Staff productivity", "System uptime", "Process efficiency", "Quality metrics"]
    }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = async () => {
    if (!formData.reportType) {
      alert("Please select a report type");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate report generation progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsGenerating(false);
          // Navigate back to reports page
          setTimeout(() => {
            navigate('/admin/reports');
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const selectedReportType = reportTypes.find(type => type.id === formData.reportType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/admin/reports')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Reports
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Generate New Report</h1>
        <p className="text-gray-600">Create custom reports with advanced filtering and export options.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText size={20} />
              Report Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => handleInputChange('reportType', type.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.reportType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      formData.reportType === type.id ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {type.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{type.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {type.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Date Range Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Date Range
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                <select
                  value={formData.dateRange}
                  onChange={(e) => handleInputChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {formData.dateRange === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.customStartDate}
                      onChange={(e) => handleInputChange('customStartDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.customEndDate}
                      onChange={(e) => handleInputChange('customEndDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Report Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings size={20} />
              Report Options
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Include Charts & Graphs</label>
                  <p className="text-xs text-gray-500">Add visual representations of data</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeCharts}
                    onChange={(e) => handleInputChange('includeCharts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Include Raw Data</label>
                  <p className="text-xs text-gray-500">Add detailed data tables and exports</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.includeRawData}
                    onChange={(e) => handleInputChange('includeRawData', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <select
                  value={formData.format}
                  onChange={(e) => handleInputChange('format', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="csv">CSV Data Export</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Recipients (Optional)</label>
                <input
                  type="email"
                  placeholder="Enter email addresses separated by commas"
                  value={formData.recipients}
                  onChange={(e) => handleInputChange('recipients', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Report will be emailed to these addresses upon completion</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Report Preview Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow"
          >
            <h3 className="text-lg font-semibold mb-4">Report Preview</h3>

            {selectedReportType ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {selectedReportType.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedReportType.title}</h4>
                    <p className="text-sm text-gray-600">Estimated generation time: {selectedReportType.estimatedTime}</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Data Points Included:</h5>
                  <ul className="space-y-1">
                    {selectedReportType.dataPoints.map((point, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium uppercase">{formData.format}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Charts:</span>
                    <span className="font-medium">{formData.includeCharts ? 'Included' : 'Excluded'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Raw Data:</span>
                    <span className="font-medium">{formData.includeRawData ? 'Included' : 'Excluded'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="mx-auto h-12 w-12 mb-4" />
                <p>Select a report type to see preview</p>
              </div>
            )}
          </motion.div>

          {/* Generation Progress */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 shadow"
            >
              <h3 className="text-lg font-semibold mb-4">Generating Report...</h3>
              <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 text-center">{generationProgress}% Complete</p>
              </div>
            </motion.div>
          )}

          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow"
          >
            <button
              onClick={handleGenerateReport}
              disabled={!formData.reportType || isGenerating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Play size={16} />
              {isGenerating ? 'Generating Report...' : 'Generate Report'}
            </button>

            {!formData.reportType && (
              <p className="text-sm text-red-600 mt-2 text-center">Please select a report type</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
