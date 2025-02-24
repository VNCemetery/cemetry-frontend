import {
  Button,
  Drawer,
  Flex,
  Image,
  ScrollArea,
  Text,
  CloseButton,
} from "@mantine/core";
import React from "react";
import { FiHome, FiInfo, FiMap } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import BANNER from "../../assets/BANNER.jpg";

export const navigationItems = [
  { label: "Trang chủ", href: "/", icon: <FiHome /> },
  { label: "Bản đồ chỉ dẫn phần mộ", href: "/map", icon: <FiMap /> },
  { label: "Liên hệ", href: "/contact", icon: <FiInfo /> },
];

export const AppDrawer = ({ opened, toggleDrawer, closeDrawer }) => {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  return (
    <Drawer
      opened={opened}
      withCloseButton={false}
      onClose={closeDrawer}
      size={{ base: "100%", sm: 300 }}
      padding="0"
      zIndex={1000000}
    >
      {/* Make a div w */}
      <Image src={BANNER} />
      <CloseButton
        onClick={closeDrawer}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "white",
          borderRadius: "50%",
        }}
      />
      <ScrollArea h="calc(100vh - 80px)" className="px-4 pt-8" mx="-md">
        <Flex className="w-full flex-col gap-2 p-4">
          {navigationItems.map((item) => (
            <Button
              key={item.href}
              rightSection={item.icon}
              variant={pathname === item.href ? "filled" : "default"}
              radius="xl"
              size="lg"
              component="a"
              onClick={() => {
                navigate(item.href);
                closeDrawer();
              }}
            >
              {item.label}
            </Button>
          ))}
        </Flex>
      </ScrollArea>
    </Drawer>
  );
};
