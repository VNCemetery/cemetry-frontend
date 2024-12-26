import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function AdminProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();
  
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
