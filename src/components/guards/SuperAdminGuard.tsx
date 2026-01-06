import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

interface SuperAdminGuardProps {
  children: React.ReactNode;
}

const SuperAdminGuard: React.FC<SuperAdminGuardProps> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "super_admin") {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default SuperAdminGuard;