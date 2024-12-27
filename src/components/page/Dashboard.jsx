import { Container, Title, Text, Group, Paper } from '@mantine/core';

export default function Dashboard() {
  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl">
        Bảng điều khiển
      </Title>
      
      <Group grow>
        <Paper shadow="xs" p="md">
          <Title order={3} size="h4" mb="xs">
            Thống kê
          </Title>
          <Text>Nội dung thống kê sẽ được hiển thị ở đây</Text>
        </Paper>
        
        <Paper shadow="xs" p="md">
          <Title order={3} size="h4" mb="xs">
            Hoạt động gần đây
          </Title>
          <Text>Các hoạt động gần đây sẽ được hiển thị ở đây</Text>
        </Paper>
      </Group>
    </Container>
  );
} 