import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const [opened, { toggle }] = useDisclosure();
  const { accessToken, refreshToken } = useAuthStore();

  // Kiểm tra cả access token và refresh token
  if (!accessToken && !refreshToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header>
        <AdminHeader opened={opened} toggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AdminSidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
} 