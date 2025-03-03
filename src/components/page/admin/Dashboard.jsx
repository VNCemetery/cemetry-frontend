import { Grid, Paper, Text, Title, Group, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useMatyrStore } from "../../../store/useMatyrStore";
import { getStats } from "../../../services/martyrManagementService";
import { FiUsers, FiUserCheck, FiMap, FiClock } from "react-icons/fi";

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
            icon={<FiUsers size={32} />}
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
    <Paper withborder p="md" radius="md">
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
