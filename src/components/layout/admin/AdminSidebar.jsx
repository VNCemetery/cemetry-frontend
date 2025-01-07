import { NavLink, Stack, Button } from '@mantine/core';
import { lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';

// Lazy load các icons
const IconDashboard = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconDashboard })));
const IconUsers = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconUsers })));
const IconSettings = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconSettings })));
const IconUserPlus = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconUserPlus })));

// Icon wrapper component
const IconWrapper = ({ icon: Icon, ...props }) => (
  <Suspense fallback={<span style={{ width: props.size, height: props.size }} />}>
    <Icon {...props} />
  </Suspense>
);

const menuItems = [
  {
    label: 'Tổng quan',
    icon: (props) => <IconWrapper icon={IconDashboard} {...props} />,
    path: '/admin/dashboard'
  },
  {
    label: 'Quản lý liệt sĩ',
    icon: (props) => <IconWrapper icon={IconUsers} {...props} />,
    path: '/admin/martyrs'
  },
  {
    label: 'Người đóng góp',
    icon: (props) => <IconWrapper icon={IconUserPlus} {...props} />,
    path: '/admin/contributors'
  },
  {
    label: 'Cài đặt',
    icon: (props) => <IconWrapper icon={IconSettings} {...props} />,
    path: '/admin/settings'
  }
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  return (
    <Stack gap="sm">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          label={item.label}
          leftSection={<item.icon size="1.2rem" stroke={1.5} />}
          onClick={() => navigate(item.path)}
          active={location.pathname === item.path}
        />
      ))}
      <Button 
        onClick={handleLogout}
        variant="subtle"
        color="red"
        fullWidth
      >
        Đăng xuất
      </Button>
    </Stack>
  );
} 