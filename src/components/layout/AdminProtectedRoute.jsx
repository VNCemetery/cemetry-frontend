import { Outlet } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

export default function AdminProtectedRoute() {
  // add logic to check role & auth
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div>
      Admin dashboard
      <Outlet />
    </div>
  );
}
