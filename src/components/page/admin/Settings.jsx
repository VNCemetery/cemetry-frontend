import { Container, Title, Stack } from '@mantine/core';
import ChangePassword from './ChangePassword';

export default function Settings() {
  return (
    <Container size="sm">
      <Title order={2} mb="xl">Cài đặt</Title>
      
      <Stack>
        <ChangePassword />
        {/* Các phần cài đặt khác có thể thêm ở đây */}
      </Stack>
    </Container>
  );
} 