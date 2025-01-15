import { Grid, Paper, Text, Title, Group, Stack } from "@mantine/core";
import { lazy, Suspense } from "react";
import { useEffect, useState } from "react";
import { useMatyrStore } from "../../../store/useMatyrStore";
import { getStats } from "../../../services/martyrManagementService";

// Lazy load icons
const IconUsers = lazy(() =>
  import("@tabler/icons-react").then((module) => ({
    default: module.IconUsers,
  }))
);
const IconUserCheck = lazy(() =>
  import("@tabler/icons-react").then((module) => ({
    default: module.IconUserCheck,
  }))
);
const IconMap = lazy(() =>
  import("@tabler/icons-react").then((module) => ({ default: module.IconMap }))
);
const IconHistory = lazy(() =>
  import("@tabler/icons-react").then((module) => ({
    default: module.IconHistory,
  }))
);

// Icon wrapper
const IconWrapper = ({ icon: Icon, ...props }) => (
  <Suspense
    fallback={<span style={{ width: props.size, height: props.size }} />}
  >
    <Icon {...props} />
  </Suspense>
);

export default function Dashboard() {
  const { loadAdminMartyrs } = useMatyrStore();
  const [stats, setStats] = useState({
    totalMartyrs: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getStats();
        console.log("Stats response:", response);

        setStats((prev) => ({
          ...prev,
          totalMartyrs: response.totalMartyrs,
        }));
      } catch (error) {
        console.error("Error loading stats:", error);
        setStats((prev) => ({
          ...prev,
          totalMartyrs: 0,
        }));
      }
    };

    loadStats();
  }, []);

  return (
    <>
      <Title order={2} mb="lg">
        Tổng quan
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatsCard
            title="Tổng số liệt sĩ"
            value={stats.totalMartyrs.toLocaleString()}
            description="Tổng số liệt sĩ đã ghi nhận"
            icon={<IconWrapper icon={IconUsers} size={32} stroke={1.5} />}
            color="blue"
          />
        </Grid.Col>

        {/* ... rest of your dashboard code ... */}
      </Grid>
    </>
  );
}

// StatsCard component (if not already defined elsewhere)
function StatsCard({ title, value, description, icon, color }) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <Stack gap={0}>
          <Text size="xs" c="dimmed">
            {title}
          </Text>
          <Text fw={700} size="xl">
            {value}
          </Text>
          <Text size="xs" c="dimmed">
            {description}
          </Text>
        </Stack>
        <div style={{ color: `var(--mantine-color-${color}-filled)` }}>
          {icon}
        </div>
      </Group>
    </Paper>
  );
}
