import { Paper, Text, Title, Group } from "@mantine/core";

export default function StatsCard({
  title,
  value,
  description,
  icon,
  color = "blue",
}) {
  return (
    <Paper withborder p="md" radius="md">
      <Group justify="space-between" mb="xs">
        <Text size="xs" c="dimmed" tt="uppercase">
          {title}
        </Text>
        <div style={{ color: `var(--mantine-color-${color}-filled)` }}>
          {icon}
        </div>
      </Group>
      <Title order={1} fw={700} mb="xs">
        {value}
      </Title>
      <Text size="sm" c="dimmed">
        {description}
      </Text>
    </Paper>
  );
}
