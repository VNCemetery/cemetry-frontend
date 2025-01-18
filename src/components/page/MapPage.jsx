import {
  Container,
  Title,
  Text,
  Timeline,
  ThemeIcon,
  Grid,
  Card,
  List,
} from "@mantine/core";
import { FaMonument, FaHistory, FaLandmark, FaLeaf } from "react-icons/fa";
import { GiTempleDoor, GiLotus } from "react-icons/gi";
import classes from "./MapPage.module.css";

export default function MapPage() {
  const timelineData = [
    {
      title: "Khởi công xây dựng",
      date: "1980",
      icon: <FaMonument />,
      description: "Bắt đầu xây dựng với diện tích hơn 3,5 héc ta",
    },
    {
      title: "Khánh thành",
      date: "26/7/1984",
      icon: <GiTempleDoor />,
      description: "Chính thức khánh thành và đưa vào sử dụng",
    },
    {
      title: "Công nhận Di tích",
      date: "10/4/2003",
      icon: <FaLandmark />,
      description: "Được công nhận di tích lịch sử cấp tỉnh",
    },
  ];

  const stats = [
    { value: "3.5", label: "Héc ta diện tích", icon: <FaLeaf /> },
    { value: "2,500+", label: "Liệt sĩ an nghỉ", icon: <FaMonument /> },
    { value: "18", label: "Bậc thang tưởng niệm", icon: <GiLotus /> },
    { value: "1984", label: "Năm khánh thành", icon: <FaHistory /> },
  ];

  return (
    <Container size="xl" className={classes.wrapper}>
      <div className={classes.hero}>
        <Title className={classes.heroTitle}>
          Nghĩa Trang Liệt Sĩ Tỉnh Đồng Tháp
        </Title>
        <Text className={classes.heroDescription}>
          Di tích lịch sử văn hóa cấp tỉnh - Nơi tưởng nhớ và tri ân các anh
          hùng liệt sĩ
        </Text>
      </div>

      {/* Stats Grid */}
      <Grid my={50}>
        {stats.map((stat) => (
          <Grid.Col key={stat.label} span={{ base: 12, sm: 6, md: 3 }}>
            <Card className={classes.statCard}>
              <ThemeIcon size={40} radius="md" variant="light">
                {stat.icon}
              </ThemeIcon>
              <Text size="xl" fw={700} mt="md">
                {stat.value}
              </Text>
              <Text size="sm" c="dimmed">
                {stat.label}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      {/* <Grid mt={60}>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Timeline active={3} bulletSize={30} lineWidth={2}>
            {timelineData.map((item, index) => (
              <Timeline.Item
                key={index}
                bullet={
                  <ThemeIcon size={30} radius="xl" color="blue"></ThemeIcon>
                    {item.icon}
                  </ThemeIcon>
                }
                title={
                  <Text fw={700} size="lg"></Text>
                    {item.title}
                  </Text>
                }
              >
                <Text size="xs" c="dimmed" mt={4}>{item.date}</Text>
                <Text size="sm" mt={4}>{item.description}</Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" className={classes.featureCard}>
            <Title order={2} size="h3" mb="md">Kiến trúc độc đáo</Title>
            <List spacing="sm" size="sm" center icon={
              <ThemeIcon color="blue" size={24} radius="xl"></ThemeIcon>
                <GiLotus size={16} />
              </ThemeIcon>
            }>
              <List.Item>Tượng đài người lính với đóa sen tưởng niệm</List.Item>
              <List.Item>18 bậc thang tượng trưng cho 18 đời vua Hùng</List.Item>
              <List.Item>Hoa văn trống đồng Ngọc Lũ độc đáo</List.Item>
              <List.Item>Thiết kế hình bông sen nở với hồ nước trung tâm</List.Item>
            </List>
          </Card>
        </Grid.Col>
      </Grid> */}
      {/* Timeline Section */}
    </Container>
  );
}
