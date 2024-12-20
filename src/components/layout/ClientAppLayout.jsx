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
import { FaMapMarkerAlt, FaNewspaper, FaSearch, FaShare } from "react-icons/fa";
import TabBar from "../ui/TabBar";
import { FaMap, FaSailboat } from "react-icons/fa6";
import { Outlet, useLocation } from "react-router";
import { BiChevronDown, BiChevronRight, BiSearch } from "react-icons/bi";
import { CgChevronDoubleDown } from "react-icons/cg";

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
      padding="md"
    >
      <Outlet />
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
              icon: <FaSailboat />,
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
