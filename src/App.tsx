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
import RegisterPage from "./app/register/page";
import SustainabilityPage from "./app/sustainability/page";
import AdminDashboard from "./app/dashboard/admin/page";
import StaffDashboard from "./app/dashboard/staff/page";
import ClientDashboard from "./app/dashboard/client/page";
import ClientProfileTab from "./app/dashboard/client/profile/page";
import ClientShipmentsTab from "./app/dashboard/client/shipments/page";
import ClientInvoicesTab from "./app/dashboard/client/invoices/page";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import AdminGuard from "./components/guards/AdminGuard";
import SuperAdminGuard from "./components/guards/SuperAdminGuard";
import AdminDashboardPage from "./app/admin/dashboard/page";
import AdminShipments from "./app/admin/shipments/page";
import NewShipment from "./app/admin/shipments/new/page";
import ShipmentDetails from "./app/admin/shipments/[id]/page";
import AdminTracking from "./app/admin/tracking/page";
import AdminUsers from "./app/admin/users/page";
import NewUser from "./app/admin/users/new/page";
import AdminReports from "./app/admin/reports/page";
import GenerateReport from "./app/admin/reports/generate/page";
import AdminMedia from "./app/admin/media/page";
import AdminProfile from "./app/admin/profile/page";
import AdminSettings from "./app/admin/settings/page";
import CompanySettings from "./app/admin/settings/company/page";
import RolesSettings from "./app/admin/settings/roles/page";
import AdminContainers from "./app/admin/containers/page";
import AdminInvoices from "./app/admin/invoices/page";
import AdminPayments from "./app/admin/payments/page";
import AdminNotifications from "./app/admin/notifications/page";
import NotificationsPage from "./app/notifications/page";
import PaymentCallback from "./app/payment/callback/page";
import type { RootState } from "./store";

const roleToDashboardPath = (role?: string) => {
  if (!role) return "login";
  const lower = role.toLowerCase();
  return lower === "super_admin" ? "admin" : lower;
};

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
        <Route path="register" element={<RegisterPage />} />
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
            isAuthenticated && user ? (
              <Navigate to={`/dashboard/${roleToDashboardPath(user.role)}`} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="admin"
          element={
            isAuthenticated && user?.role === "super_admin" ? (
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
        >
          <Route index element={<Navigate to="/dashboard/client/profile" replace />} />
          <Route path="profile" element={<ClientProfileTab />} />
          <Route path="shipments" element={<ClientShipmentsTab />} />
          <Route path="invoices" element={<ClientInvoicesTab />} />
        </Route>
      </Route>

      {/* Protected notifications route */}
      <Route
        path="/notifications"
        element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />}
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={<AdminGuard><DashboardLayout /></AdminGuard>}
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="shipments" element={<AdminShipments />} />
        <Route path="shipments/new" element={<NewShipment />} />
        <Route path="shipments/:id" element={<ShipmentDetails />} />
        <Route path="tracking" element={<AdminTracking />} />
        <Route path="users" element={<SuperAdminGuard><AdminUsers /></SuperAdminGuard>} />
        <Route path="users/new" element={<SuperAdminGuard><NewUser /></SuperAdminGuard>} />
        <Route path="reports" element={<SuperAdminGuard><AdminReports /></SuperAdminGuard>} />
        <Route path="reports/generate" element={<SuperAdminGuard><GenerateReport /></SuperAdminGuard>} />
        <Route path="media" element={<AdminMedia />} />
        <Route path="containers" element={<AdminContainers />} />
        <Route path="invoices" element={<SuperAdminGuard><AdminInvoices /></SuperAdminGuard>} />
        <Route path="payments" element={<SuperAdminGuard><AdminPayments /></SuperAdminGuard>} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<SuperAdminGuard><AdminSettings /></SuperAdminGuard>} />
        <Route path="settings/company" element={<SuperAdminGuard><CompanySettings /></SuperAdminGuard>} />
        <Route path="settings/roles" element={<SuperAdminGuard><RolesSettings /></SuperAdminGuard>} />
      </Route>

      <Route path="/payment/callback" element={<PaymentCallback />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
