import {
  TextInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  Box,
  BackgroundImage,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../services/authService';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email không hợp lệ'),
    },
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setError('');
    try {
      await forgotPassword(values.email);
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
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
          <Paper withBorder shadow="xl" p={30} radius="md" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)'
          }}>
            <Box ta="center" mb={30}>
              <Title order={2} mb="xs">Quên mật khẩu</Title>
              <Text c="dimmed" size="sm">
                Nhập email của bạn để nhận mã xác thực
              </Text>
            </Box>

            {success ? (
              <Box ta="center">
                <Text c="green" mb="md">
                  Mã xác thực đã được gửi đến email của bạn
                </Text>
                <Link to="/admin/reset-password" style={{ textDecoration: 'none' }}>
                  <Button fullWidth>
                    Tiếp tục đặt lại mật khẩu
                  </Button>
                </Link>
              </Box>
            ) : (
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  required
                  {...form.getInputProps('email')}
                />

                {error && (
                  <Text c="red" size="sm" mt="sm">
                    {error}
                  </Text>
                )}

                <Button 
                  fullWidth 
                  mt="xl"
                  type="submit"
                  loading={isLoading}
                >
                  Gửi mã xác thực
                </Button>

                <Text ta="center" mt="md">
                  <Link to="/admin/login" style={{ textDecoration: 'none' }}>
                    Quay lại đăng nhập
                  </Link>
                </Text>
              </form>
            )}
          </Paper>
        </Container>
      </div>
    </BackgroundImage>
  );
} 