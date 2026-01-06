"use client";

import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import MarketingNavbar from "./MarketingNavbar";
import AdminNavbar from "./AdminNavbar";
import MobileSidebar from "./MobileSidebar";
import Footer from "./Footer";
import ScrollToggleButton from "../ScrollToggleButton";
import type { RootState } from "../../store";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="app-shell">
      {isAuthenticated ? (
        <AdminNavbar />
      ) : (
        <MarketingNavbar onToggleSidebar={() => setSidebarOpen(s => !s)} />
      )}
      <div className="body-shell">
        <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <Footer />
      <ScrollToggleButton />
    </div>
  );
}
