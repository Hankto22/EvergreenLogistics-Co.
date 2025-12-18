import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/layout/Layout";
import HomePage from "./app/page";
import AboutPage from "./app/about/page";
import ServicesPage from "./app/services/page";
import TrackingPage from "./app/tracking/page";
import ContactPage from "./app/contact/page";
import GalleryPage from "./app/gallery/page";
import LoginPage from "./app/login/page";
import SustainabilityPage from "./app/sustainability/page";
import AdminDashboard from "./app/dashboard/admin/page";
import StaffDashboard from "./app/dashboard/staff/page";
import ClientDashboard from "./app/dashboard/client/page";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import type { RootState } from "./store";

function App() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {/* Layout wrapper for public pages */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="tracking" element={<TrackingPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="sustainability" element={<SustainabilityPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}
      >
        <Route
          index
          element={
            isAuthenticated && user ? <Navigate to={user.role} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="admin"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="staff"
          element={
            isAuthenticated && user?.role === "staff" ? (
              <StaffDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="client"
          element={
            isAuthenticated && user?.role === "client" ? (
              <ClientDashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
