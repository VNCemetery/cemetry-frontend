import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, accessToken } = useAuthStore();
  
  console.log('Protected Route State:', { isAuthenticated, accessToken }); // Debug log

  if (!isAuthenticated || !accessToken) {
    console.log('Chuyển hướng đến trang login vì chưa xác thực'); // Debug log
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
