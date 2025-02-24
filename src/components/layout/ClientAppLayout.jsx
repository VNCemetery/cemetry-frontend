import AppHeader from "../ui/AppHeader";
import AppFooter from "../ui/AppFooter";
import { Outlet, useLocation } from "react-router";
import { useState } from "react";

function ClientAppLayout() {
  const { pathname } = useLocation();
  const [currentPath, setCurrentPath] = useState(pathname);

  return (
    <>
      <AppHeader />
      <Outlet />
      <AppFooter />
    </>
  );
}

export default ClientAppLayout;
