"use client";

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import MobileSidebar from "./MobileSidebar";
import Footer from "./Footer";
import ScrollToggleButton from "../ScrollToggleButton";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Navbar onToggleSidebar={() => setSidebarOpen(s => !s)} />
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