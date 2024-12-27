import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Box, Button, Pagination, ScrollArea } from "@mantine/core";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

// Layouts
import AdminLayout from "./components/layout/admin/AdminLayout";
import ClientAppLayout from "./components/layout/ClientAppLayout";
import AdminProtectedRoute from "./components/layout/AdminProtectedRoute";

// Pages
import RoutingPage from "./components/page/RoutingPage";
import NewsPage from "./components/page/NewsPage";
import AboutProjectPage from "./components/page/AboutProjectPage";
import MapPage from "./components/page/MapPage";
import AdminLogin from "./components/page/AdminLogin";

// Admin Pages
import Dashboard from "./components/page/admin/Dashboard";
import MartyrsManage from "./components/page/admin/MartyrsManage";
import Settings from "./components/page/admin/Settings";
import ContributorsManage from "./components/page/admin/ContributorsManage";
import MartyrDetail from "./components/page/admin/MartyrDetail";

export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<ClientAppLayout />}>
            <Route index element={<RoutingPage />} />
            <Route
              path="map"
              element={<MapPage center={[21.028511, 105.804817]} zoom={13} />}
            />
            <Route path="news" element={<NewsPage />} />
            <Route path="contact" element={<AboutProjectPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="martyrs" element={<MartyrsManage />} />
            <Route path="martyrs/:id" element={<MartyrDetail />} />
            <Route path="martyrs/new" element={<MartyrDetail />} />
            <Route path="contributors" element={<ContributorsManage />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
