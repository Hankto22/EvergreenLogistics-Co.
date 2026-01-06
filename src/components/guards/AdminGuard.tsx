import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "super_admin" && user.role !== "staff") {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default AdminGuard;