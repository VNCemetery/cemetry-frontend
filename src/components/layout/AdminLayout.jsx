import { Navigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

export default function AdminLayout() {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/admin/login" />;
  }
  return (
    <div>
      <div>Admin layout</div>
      <Outlet />
    </div>
  );
}
