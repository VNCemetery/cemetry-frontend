import { Group, Burger, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';

export default function AdminHeader({ opened, toggle }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn chuyển về trang login ngay cả khi có lỗi
      navigate('/admin/login');
    }
  };

  return (
    <Group h="100%" px="md" justify="space-between">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Group>
        <Button onClick={handleLogout} variant="light" color="red">
          Đăng xuất
        </Button>
      </Group>
    </Group>
  );
} 