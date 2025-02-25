import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Loader, Center } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

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
import ContactPage from "./components/page/ContactPage";

// Admin Pages
import Dashboard from "./components/page/admin/Dashboard";
import MartyrsManage from "./components/page/admin/MartyrsManage";
import Settings from "./components/page/admin/Settings";
import ContributorsManage from "./components/page/admin/ContributorsManage";
import MartyrDetail from "./components/page/admin/MartyrDetail";
import { useEffect, useState } from "react";

import { useInfoStore } from "./store/useInfoStore";
import ForgotPasswordPage from "./components/page/ForgotPasswordPage";
import ResetPasswordPage from "./components/page/ResetPasswordPage";
import DefaultLayout from "./components/layout/DefaultLayout";

export default function App() {
  // make state is loading

  const { isLoadingInfo: isLoading, loadInfo } = useInfoStore((state) => state);
  useEffect(() => {
    loadInfo();
  }, []);

  return (
    <MantineProvider>
      <Notifications />
      {isLoading ? (
        <Center style={{ height: "100vh" }}>
          <Loader size="xl" />
        </Center>
      ) : (
        <BrowserRouter>
          <Routes>
            {/* Client Routes */}
            <Route element={<DefaultLayout />} path="/map">
              <Route index element={<RoutingPage />} />
            </Route>
            <Route path="/*" element={<ClientAppLayout />}>
              <Route path="/*" element={<MapPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
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

            {/* Auth Routes */}
            <Route
              path="/admin/forgot-password"
              element={<ForgotPasswordPage />}
            />
            <Route
              path="/admin/reset-password"
              element={<ResetPasswordPage />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </MantineProvider>
  );
}
