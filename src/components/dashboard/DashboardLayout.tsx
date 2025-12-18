"use client";

import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import type { RootState, AppDispatch } from "../../store";

export default function DashboardLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "User";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] dashboard-frame">
      <div className="dash-utility-bar">
        <div>
          <div className="welcome-eyebrow">Welcome back</div>
          <div className="welcome-name">{roleLabel}</div>
        </div>
        <button className="ghost-btn sm logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
