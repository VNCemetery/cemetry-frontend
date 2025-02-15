import { Button, Drawer, Flex, ScrollArea, Text } from "@mantine/core";
import React from "react";
import { FiHome, FiInfo, FiMap } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const navigationItems = [
  { label: "Trang chủ", href: "/", icon: FiHome },
  { label: "Bản đồ", href: "/map", icon: FiMap },
  { label: "Liên hệ", href: "/contact", icon: FiInfo },
];

export const AppDrawer = ({ opened, toggleDrawer, closeDrawer }) => {
  const navigate = useNavigate();
  return (
    <Drawer
      opened={opened}
      onClose={closeDrawer}
      size="100%"
      padding="md"
      hiddenFrom="sm"
      zIndex={1000000}
    >
      <Text className="w-full text-center text-2xl font-extrabold">
        NGHĨA TRANG LIỆT SĨ ĐỒNG THÁP
      </Text>
      <ScrollArea h="calc(100vh - 80px" mx="-md">
        <Flex className="w-full flex-col gap-2 p-4">
          {navigationItems.map((item) => (
            <Button
              key={item.href}
              rightSection={<item.icon />}
              variant="filled"
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
