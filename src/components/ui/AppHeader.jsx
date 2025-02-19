import { VscBook, VscCode } from "react-icons/vsc";
import { BiCoin, BiChevronDown, BiPieChartAlt } from "react-icons/bi";
import { FiBarChart, FiBell, FiHome, FiInfo, FiMap } from "react-icons/fi";

import { AppDrawer, navigationItems } from "./AppDrawer";
import LOGO from "../../assets/LOGO.png";
import {
  Anchor,
  Avatar,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Flex,
  Group,
  HoverCard,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./AppHeader.module.css";
import { useNavigate } from "react-router-dom";

const mockdata = [
  {
    icon: VscCode,
    title: "Open source",
    description: "This Pokémon’s cry is very loud and distracting",
  },
  {
    icon: BiCoin,
    title: "Free for everyone",
    description: "The fluid of Smeargle’s tail secretions changes",
  },
  {
    icon: VscBook,
    title: "Documentation",
    description: "Yanma is capable of seeing 360 degrees without",
  },
  {
    icon: FiBarChart,
    title: "Security",
    description: "The shell’s rounded shape and the grooves on its.",
  },
  {
    icon: BiPieChartAlt,
    title: "Analytics",
    description: "This Pokémon uses its flying ability to quickly chase",
  },
  {
    icon: FiBell,
    title: "Notifications",
    description: "Combusken battles with the intensely hot flames it spews",
  },
];

export default function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  const navigate = useNavigate();
  return (
    <Box className="sticky top-0 w-full bg-white z-[9999]">
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <div
            className="p-2 transition-all ease-in-out duration-150 hover:cursor-pointer  hover:bg-gray-100 rounded-xl flex gap-2 items-center justify-center"
            onClick={() => navigate("/")}
          >
            <Avatar src={LOGO} alt="Logo" radius="xl" />
          </div>
          <Group h="100%" gap={4} visibleFrom="sm">
            {[navigationItems[0], navigationItems[2]].map((item) => (
              <Button
                key={item.href}
                variant="default"
                radius={"xl"}
                component="a"
                onClick={() => navigate(item.href)}
              >
                {item.label}
              </Button>
            ))}
          </Group>
          <Group visibleFrom="sm">
            <Button
              variant="filled"
              radius={"xl"}
              component="a"
              onClick={() => navigate("/map")}
              rightSection={<FiMap />}
            >
              Đi tới bản đồ
            </Button>
          </Group>
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="sm"
          />
        </Group>
      </header>

      <AppDrawer
        opened={drawerOpened}
        toggleDrawer={toggleDrawer}
        closeDrawer={closeDrawer}
      />
    </Box>
  );
}
