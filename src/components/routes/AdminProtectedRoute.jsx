import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminProtectedRoute() {
  const { accessToken, refreshToken, isAuthenticated } = useAuthStore();

  // Kiểm tra xác thực
  const isAuth = isAuthenticated || (accessToken && refreshToken);
  
  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
} 