import { Grid, Paper, Text, Title, Group, Stack, RingProgress } from '@mantine/core';
import { lazy, Suspense } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend
} from 'chart.js';
import StatsCard from '../../ui/admin/StatsCard';

// Lazy load các icons
const IconUsers = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconUsers })));
const IconUserCheck = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconUserCheck })));
const IconMap = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconMap })));
const IconHistory = lazy(() => import('@tabler/icons-react').then(module => ({ default: module.IconHistory })));

// Icon wrapper component
const IconWrapper = ({ icon: Icon, ...props }) => (
  <Suspense fallback={<span style={{ width: props.size, height: props.size }} />}>
    <Icon {...props} />
  </Suspense>
);

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend
);

// Mock data - sau này sẽ thay bằng API call
const STATS = {
  totalMartyrs: 1234,
  totalContributors: 156,
  pendingContributors: 23,
  totalAreas: 8,
  recentActivities: [
    { id: 1, type: 'add', user: 'Nguyễn Văn A', action: 'Thêm liệt sĩ mới', time: '2024-02-20T15:30:45' },
    { id: 2, type: 'edit', user: 'Trần Thị B', action: 'Cập nhật thông tin', time: '2024-02-20T14:20:30' },
    { id: 3, type: 'register', user: 'Lê Văn C', action: 'Đăng ký đóng góp', time: '2024-02-20T13:15:10' },
  ],
  martyrsByArea: [
    { area: 'Khu A', count: 300 },
    { area: 'Khu B', count: 250 },
    { area: 'Khu C', count: 200 },
    { area: 'Khu D', count: 180 },
    { area: 'Khu E', count: 150 },
  ],
  websiteStats: {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    visitors: [150, 230, 180, 290, 200, 320, 400],
    pageViews: [300, 450, 360, 580, 400, 640, 800],
  },
  feedbackStats: {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    good: [65, 75, 70, 80, 85, 72, 78, 90, 85, 88, 92, 95],
    notGood: [35, 25, 30, 20, 15, 28, 22, 10, 15, 12, 8, 5],
  }
};

export default function Dashboard() {
  const totalMartyrs = STATS.martyrsByArea.reduce((sum, area) => sum + area.count, 0);

  const websiteStatsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê truy cập trong tuần'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const websiteStatsData = {
    labels: STATS.websiteStats.labels,
    datasets: [
      {
        label: 'Lượt truy cập',
        data: STATS.websiteStats.visitors,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3
      },
      {
        label: 'Lượt xem trang',
        data: STATS.websiteStats.pageViews,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3
      }
    ]
  };

  const feedbackStatsData = {
    labels: STATS.feedbackStats.labels,
    datasets: [
      {
        label: 'Đánh giá tốt',
        data: STATS.feedbackStats.good,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      },
      {
        label: 'Đánh giá chưa tốt',
        data: STATS.feedbackStats.notGood,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1
      }
    ]
  };

  const feedbackStatsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê đánh giá theo tháng'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        stacked: true
      }
    }
  };

  return (
    <>
      <Title order={2} mb="lg">Tổng quan</Title>
      
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatsCard
            title="Tổng số liệt sĩ"
            value={STATS.totalMartyrs.toLocaleString()}
            description="Tổng số liệt sĩ đã ghi nhận"
            icon={<IconWrapper icon={IconUsers} size={32} stroke={1.5} />}
            color="blue"
          />
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatsCard
            title="Người đóng góp"
            value={STATS.totalContributors.toLocaleString()}
            description={`${STATS.pendingContributors} chờ duyệt`}
            icon={<IconWrapper icon={IconUserCheck} size={32} stroke={1.5} />}
            color="green"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatsCard
            title="Khu vực"
            value={STATS.totalAreas}
            description="Tổng số khu vực quản lý"
            icon={<IconWrapper icon={IconMap} size={32} stroke={1.5} />}
            color="violet"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
          <StatsCard
            title="Hoạt động"
            value={STATS.recentActivities.length}
            description="Hoạt động trong ngày"
            icon={<IconWrapper icon={IconHistory} size={32} stroke={1.5} />}
            color="orange"
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" h="100%">
            <Line options={{
              ...websiteStatsOptions,
              maintainAspectRatio: false
            }} 
            data={websiteStatsData}
            style={{ minHeight: '400px' }}
            />
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" h="100%">
            <Bar options={{
              ...feedbackStatsOptions,
              maintainAspectRatio: false
            }} 
            data={feedbackStatsData}
            style={{ minHeight: '400px' }}
            />
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper withBorder p="md">
            <Title order={3} mb="md">Hoạt động gần đây</Title>
            <Stack>
              {STATS.recentActivities.map(activity => (
                <Group key={activity.id} justify="space-between">
                  <div>
                    <Text size="sm" fw={500}>{activity.user}</Text>
                    <Text size="xs" c="dimmed">{activity.action}</Text>
                  </div>
                  <Text size="xs" c="dimmed">
                    {new Date(activity.time).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="md">
            <Title order={3} mb="md">Phân bố theo khu</Title>
            <Stack>
              {STATS.martyrsByArea.map(area => (
                <Group key={area.area} justify="space-between">
                  <Text size="sm">{area.area}</Text>
                  <Group gap="xs">
                    <Text size="sm" fw={500}>
                      {area.count.toLocaleString()}
                    </Text>
                    <Text size="xs" c="dimmed">
                      ({((area.count / totalMartyrs) * 100).toFixed(1)}%)
                    </Text>
                  </Group>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
} 