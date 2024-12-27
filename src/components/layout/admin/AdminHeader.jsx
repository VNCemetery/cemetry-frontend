import { Burger, Group, Title, Button } from '@mantine/core';
import { useAuthStore } from '../../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function AdminHeader({ opened, toggle }) {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Title order={3}>HeroVN Admin</Title>
      </Group>

      <Button variant="subtle" onClick={handleLogout}>
        Đăng xuất
      </Button>
    </Group>
  );
} 