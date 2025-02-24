import { NavLink, Stack, Button } from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { FiGrid, FiUsers, FiSettings, FiUserPlus } from "react-icons/fi";

const menuItems = [
  {
    label: "Tổng quan",
    icon: FiGrid,
    path: "/admin/dashboard",
  },
  {
    label: "Quản lý liệt sĩ",
    icon: FiUsers,
    path: "/admin/martyrs",
  },
  // {
  //   label: "Người đóng góp",
  //   icon: FiUserPlus,
  //   path: "/admin/contributors",
  // },
  {
    label: "Cài đặt",
    icon: FiSettings,
    path: "/admin/settings",
  },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <Stack gap="sm">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          label={item.label}
          leftSection={<item.icon size="1.2rem" />}
          onClick={() => navigate(item.path)}
          active={location.pathname === item.path}
        />
      ))}
      <Button onClick={handleLogout} variant="subtle" color="red" fullWidth>
        Đăng xuất
      </Button>
    </Stack>
  );
}
