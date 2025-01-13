import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

export default function AdminLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div>
      <div>Admin layout</div>
      <Outlet />
    </div>
  );
}
