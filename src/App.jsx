import { Box, Button, Pagination, ScrollArea } from "@mantine/core";

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import { Link, Route, Routes } from "react-router";
import AdminProtectedRoute from "./components/layout/AdminProtectedRoute";
import AdminLogin from "./components/page/AdminLogin";
import AdminLayout from "./components/layout/AdminLayout";
import ClientAppLayout from "./components/layout/ClientAppLayout";
import RoutingPage from "./components/page/RoutingPage";
import NewsPage from "./components/page/NewsPage";
import AboutProjectPage from "./components/page/AboutProjectPag";
import MapPage from "./components/page/MapPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClientAppLayout />}>
        <Route index element={<RoutingPage />} />
        <Route
          path="/map"
          element={
            <MapPage
              center={[21.028511, 105.804817]}
              zoom={13}
              scrollWheelZoom={true}
            />
          }
        />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/contact" element={<AboutProjectPage />} />
      </Route>
      <Route path="admin">
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/admin/page" element={<AdminProtectedRoute />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>
    </Routes>
  );
}
