import Logo from "../ui/Logo";
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
  FaMapMarkerAlt,
  FaNewspaper,
  FaSearch,
  FaShare,
  FaUser,
} from "react-icons/fa";
import TabBar from "../ui/TabBar";
import { FaMap, FaSailboat } from "react-icons/fa6";
import { Outlet, useLocation } from "react-router";
import { BiChevronDown, BiChevronRight, BiSearch } from "react-icons/bi";
import { CgChevronDoubleDown } from "react-icons/cg";
import { BsApp, BsAppIndicator } from "react-icons/bs";

function ClientAppLayout() {
  const { pathname } = useLocation();
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
    // navbar={{
    //   width: 300,
    //   breakpoint: "sm",
    //   collapsed: { mobile: !opened },
    // }}
    >
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
      <AppShell.Footer>
        <TabBar
          currentItem={pathname}
          items={[
            {
              icon: <FaMapMarkerAlt />,
              label: "Chỉ đường",
              to: "/",
            },
            {
              icon: <FaMap />,
              label: "Sơ đồ",
              to: "/map",
            },
            {
              icon: <FaNewspaper />,
              label: "Tin tức",
              to: "/news",
            },
            {
              icon: <BsAppIndicator />,
              label: "Liên hệ",
              to: "/contact",
            },
          ]}
        />
      </AppShell.Footer>
    </AppShell>
  );
}

export default ClientAppLayout;
