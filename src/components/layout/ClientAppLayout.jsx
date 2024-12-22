import Logo from "../ui/Logo";
import AppHeader from "../ui/AppHeader";
import AppFooter from "../ui/AppFooter";
import {
  ActionIcon,
  AppShell,
  Burger,
  Input,
  NavLink,
  Tabs,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  FaGrimace,
  FaInfo,
  FaNewspaper,
  FaPlus,
  FaPlusCircle,
  FaSearch,
  FaShare,
  FaUser,
} from "react-icons/fa";
import TabBar from "../ui/TabBar";
import { FaMap, FaLocationDot, FaSailboat } from "react-icons/fa6";
import { Outlet, useLocation } from "react-router";
import { BiChevronDown, BiChevronRight, BiSearch } from "react-icons/bi";
import { CgChevronDoubleDown } from "react-icons/cg";
import { BsApp, BsAppIndicator } from "react-icons/bs";
import {
  TiLocationOutline,
  TiLocation,
  TiPlusOutline,
  TiPlus,
} from "react-icons/ti";
import { HiOutlineMap, HiMap } from "react-icons/hi";
import RoutingPage from "../page/RoutingPage";
import MapPage from "../page/MapPage";
import { useState } from "react";
import NewsPage from "../page/NewsPage";

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
