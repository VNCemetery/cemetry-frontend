import AppHeader from "../ui/AppHeader";
import AppFooter from "../ui/AppFooter";
import { Outlet, useLocation } from "react-router";
import { useState } from "react";
import BANNER from "../../assets/BANNER.jpg";
import { Image } from "@mantine/core";

function ClientAppLayout() {
  const { pathname } = useLocation();
  const [currentPath, setCurrentPath] = useState(pathname);

  return (
    <>
      <Image src={BANNER} about="banner" />

      <AppHeader />
      <Outlet />
      <AppFooter />
    </>
  );
}

export default ClientAppLayout;
