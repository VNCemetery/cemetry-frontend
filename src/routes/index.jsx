import { createBrowserRouter } from 'react-router-dom';
import AdminProtectedRoute from '../components/routes/AdminProtectedRoute';
import AdminLayout from '../components/layout/admin/AdminLayout';
import AdminLogin from '../components/page/AdminLogin';
// ... các import khác

export const router = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminProtectedRoute />, // Wrap AdminLayout bằng AdminProtectedRoute
    children: [
      {
        path: "",
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <AdminDashboard />
          },
          {
            path: "martyrs",
            element: <MartyrsManage />
          },
          // ... các route admin khác
        ]
      }
    ]
  },
  {
    path: "/admin/login",
    element: <AdminLogin />
  },
  // ... các route public khác
]); 