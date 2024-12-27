import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminProtectedRoute({ children }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  // Nếu chưa đăng nhập, chuyển hướng về trang login
  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  // Nếu đã đăng nhập, hiển thị component con
  return children;
}
