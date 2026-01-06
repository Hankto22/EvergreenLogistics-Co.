"use client";

import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminNavbar from "../layout/AdminNavbar";
import ClientNavbar from "../layout/ClientNavbar";
import type { RootState } from "../../store";

export default function DashboardLayout() {
  const user = useSelector((state: RootState) => state.auth.user);

  const isAdmin = user?.role === "super_admin" || user?.role === "staff";
  const isClient = user?.role === "client";

  return (
    <div className="min-h-screen bg-[#f5f7fb] dashboard-frame">
      {isAdmin && <AdminNavbar />}
      {isClient && <ClientNavbar />}
      <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
