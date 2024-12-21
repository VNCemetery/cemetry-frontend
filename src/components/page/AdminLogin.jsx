import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Image,
  Text,
  Box,
  BackgroundImage,
} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.target);
      const username = formData.get('username');
      const password = formData.get('password');

      await login(username, password);
      navigate('/admin');
    } catch (error) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundImage 
      src="https://scontent.iocvnpt.com/resources/portal/Images/DTP/linhln/thang_7/tap_chi_du_lich/1_325196302.jpg"
      style={{ minHeight: '100vh' }}
    >
      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container size={420}>
          <Paper 
            withBorder 
            shadow="xl" 
            p={30} 
            radius="md" 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)'
            }}
          >
            <Box ta="center" mb={30}>
              <Title order={2} mb="xs" style={{ color: '#1a1b1e' }}>
                HeroVN Admin
              </Title>
              <Text c="dimmed" size="sm">
                Vui lòng đăng nhập để tiếp tục
              </Text>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextInput
                label="Tên đăng nhập"
                name="username"
                placeholder="admin"
                required
                mb="md"
                size="md"
              />
              <PasswordInput
                label="Mật khẩu"
                name="password"
                placeholder="Nhập mật khẩu của bạn"
                required
                mb="md"
                size="md"
              />

              {error && (
                <Text c="red" size="sm" mb="sm">
                  {error}
                </Text>
              )}

              <Button 
                type="submit" 
                fullWidth 
                loading={loading}
                size="md"
                style={{
                  backgroundColor: '#228be6',
                  '&:hover': {
                    backgroundColor: '#1c7ed6'
                  }
                }}
              >
                Đăng nhập
              </Button>
            </form>
          </Paper>
        </Container>
      </div>
    </BackgroundImage>
  );
}
