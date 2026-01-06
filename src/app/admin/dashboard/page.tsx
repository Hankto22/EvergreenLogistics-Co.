"use client";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { StatCard } from "../../../components/dashboard/StatCard";
import { useGetAdminDashboardQuery } from "../../../store/dashboardApi";
import type { RootState } from "../../../store";
import { motion } from "framer-motion";
import { fadeRise } from "../../../components/animations/motionVariants";
import { Ship, Plane, Truck as RoadTruck, Plus, UserPlus, FileText, Settings, Truck, Users, DollarSign, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: dashboardData, isLoading } = useGetAdminDashboardQuery();

  const handleKPIClick = (route: string) => {
    navigate(route);
  };

  const handleModeClick = (mode: string) => {
    navigate(`/admin/shipments?mode=${mode}&status=active`);
  };

  const handleActionClick = (route: string) => {
    navigate(route);
  };

  const handleTabClick = (route: string) => {
    navigate(route);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            onClick={() => handleTabClick('/admin/profile')}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => handleTabClick('/admin/dashboard')}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg"
          >
            Overview
          </button>
          <button
            onClick={() => handleTabClick('/admin/shipments')}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Shipments
          </button>
          <button
            onClick={() => handleTabClick('/admin/users')}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Users
          </button>
          <button
            onClick={() => handleTabClick('/admin/media')}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Media
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          className="cursor-pointer"
          onClick={() => handleKPIClick('/admin/shipments')}
        >
          <StatCard
            title="Total Shipments"
            value={dashboardData?.totalShipments?.toString() || '0'}
            icon={Truck}
          />
        </motion.div>
        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          className="cursor-pointer"
          onClick={() => handleKPIClick('/admin/users')}
        >
          <StatCard
            title="Active Users"
            value={dashboardData?.totalClients?.toString() || '0'}
            icon={Users}
          />
        </motion.div>
        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          className="cursor-pointer"
          onClick={() => handleKPIClick('/admin/reports/revenue')}
        >
          <StatCard
            title="Revenue"
            value={`$${dashboardData?.totalRevenue?.toLocaleString() || '0'}`}
            icon={DollarSign}
          />
        </motion.div>
        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          className="cursor-pointer"
          onClick={() => handleKPIClick('/admin/reports/analytics')}
        >
          <StatCard
            title="Growth"
            value="TBD" // Placeholder, as backend doesn't provide growth
            icon={TrendingUp}
          />
        </motion.div>
      </div>

      {/* Mode Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          className="rounded-xl bg-white p-6 shadow cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleModeClick('ocean')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm text-gray-500">Ocean Freight</h4>
              <p className="mt-2 text-2xl font-semibold">TBD</p> {/* Placeholder */}
            </div>
            <Ship className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>
        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          className="rounded-xl bg-white p-6 shadow cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleModeClick('air')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm text-gray-500">Air Freight</h4>
              <p className="mt-2 text-2xl font-semibold">TBD</p> {/* Placeholder */}
            </div>
            <Plane className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>
        <motion.div
          variants={fadeRise}
          initial="hidden"
          animate="visible"
          className="rounded-xl bg-white p-6 shadow cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleModeClick('road')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm text-gray-500">Road Transport</h4>
              <p className="mt-2 text-2xl font-semibold">TBD</p> {/* Placeholder */}
            </div>
            <RoadTruck className="h-8 w-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Primary Action Buttons */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleActionClick('/admin/shipments/new')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Shipment
          </button>
          {user?.role === 'super_admin' && (
            <button
              onClick={() => handleActionClick('/admin/users/new')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              Add User
            </button>
          )}
          <button
            onClick={() => handleActionClick('/admin/reports/generate')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FileText className="h-5 w-5" />
            Generate Report
          </button>
          {user?.role === 'super_admin' && (
            <button
              onClick={() => handleActionClick('/admin/settings')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Settings className="h-5 w-5" />
              Settings
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;