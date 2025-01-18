import {
  Container,
  Title,
  Text,
  Timeline,
  ThemeIcon,
  Grid,
  Card,
  List,
  Accordion,
  Group,
  Stack,
  Badge,
} from "@mantine/core";
import {
  FaMonument,
  FaHistory,
  FaLandmark,
  FaLeaf,
  FaMapMarkedAlt,
  FaPhoneAlt,
  FaFacebook,
  FaEnvelope,
} from "react-icons/fa";
import { GiTempleDoor, GiLotus } from "react-icons/gi";
import { useDisclosure } from "@mantine/hooks";
import classes from "./MapPage.module.css";

export default function MapPage() {
  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);

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

  const carouselImages = [
    { url: "/ntls1.jpg", caption: "Cổng chính nghĩa trang" },
    { url: "/ntls2.jpg", caption: "Đài tưởng niệm" },
    { url: "/ntls3.jpg", caption: "Khu vực mộ liệt sĩ" },
  ];

  const cardColors = [
    { bg: "blue.0", border: "blue.3", icon: "blue.6", text: "blue.9" }, // Darker shade
    { bg: "green.0", border: "green.3", icon: "green.6", text: "green.9" },
    { bg: "pink.0", border: "pink.3", icon: "pink.6", text: "pink.9" },
    { bg: "orange.0", border: "orange.3", icon: "orange.6", text: "orange.9" },
  ];

  return (
    <>
      <Container size="xl" className={classes.wrapper}>
        <div className={classes.hero}>
          <Title className={classes.heroTitle}>
            Nghĩa Trang Liệt Sĩ Tỉnh Đồng Tháp
          </Title>
          <Text className={classes.heroDescription}>
            Di tích lịch sử văn hóa cấp tỉnh <br /> Nơi tưởng nhớ và tri ân các
            anh hùng liệt sĩ
          </Text>
        </div>

        {/* Stats Grid */}
        <Grid my={50}>
          {stats.map((stat, index) => (
            <Grid.Col key={stat.label} span={{ base: 12, sm: 6, md: 3 }}>
              <Card
                className={classes.statCard}
                bg={cardColors[index].bg}
                withBorder
                styles={{
                  root: {
                    borderColor: `var(--mantine-color-${cardColors[index].border})`,
                    overflow: "visible",
                  },
                  // Update text colors for both value and label
                  content: {
                    ".mantine-Text-root.statValue": {
                      color: `var(--mantine-color-${cardColors[index].text})`,
                      fontWeight: 900,
                    },
                    ".mantine-Text-root:last-child": {
                      color: `var(--mantine-color-${cardColors[index].border})`,
                    },
                  },
                }}
              >
                <div className={classes.iconWrapper}>
                  <ThemeIcon
                    size={80}
                    radius="xl"
                    color={cardColors[index].icon}
                    className={classes.statIcon}
                  >
                    {stat.icon}
                  </ThemeIcon>
                </div>
                <Text
                  className={classes.statValue}
                  mt={45}
                  c={cardColors[index].text} // Add this line to set the text color
                >
                  {stat.value}
                </Text>
                <Text size="lg" c="dimmed" mt={5}>
                  {stat.label}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* Information Accordion */}
        <Accordion
          multiple
          variant="separated"
          mt={40}
          classNames={{ item: classes.accordionItem }}
        >
          <Accordion.Item value="info">
            <Accordion.Control>Thông tin chi tiết</Accordion.Control>
            <Accordion.Panel>
              <Stack spacing="md">
                <Text>
                  Nghĩa trang liệt sĩ tỉnh Đồng Tháp là nơi yên nghỉ của hơn
                  2.500 liệt sĩ đã hy sinh trong hai cuộc kháng chiến. Công
                  trình được xây dựng theo hình tượng bông sen - biểu tượng của
                  vùng đất Sen Hồng.
                </Text>
                <Group>
                  <Badge color="blue">Di tích cấp tỉnh</Badge>
                  <Badge color="green">Mở cửa tự do</Badge>
                  <Badge color="grape">Có hướng dẫn viên</Badge>
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="visiting">
            <Accordion.Control>Hướng dẫn tham quan</Accordion.Control>
            <Accordion.Panel>
              <List spacing="xs">
                <List.Item>Thời gian: 6:00 - 17:30 hàng ngày</List.Item>
                <List.Item>Trang phục: Lịch sự, trang nghiêm</List.Item>
                <List.Item>Không gian: Yên tĩnh, trang nghiêm</List.Item>
                <List.Item>Có khu vực đặt hoa, thắp hương</List.Item>
              </List>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Grid mt={60}>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Timeline active={3} bulletSize={30} lineWidth={2}>
              {timelineData.map((item, index) => (
                <Timeline.Item
                  key={index}
                  bullet={
                    <ThemeIcon size={30} radius="xl" color="blue">
                      {item.icon}
                    </ThemeIcon>
                  }
                  title={
                    <Text fw={700} size="lg">
                      {item.title}
                    </Text>
                  }
                >
                  <Text size="xs" c="dimmed" mt={4}>
                    {item.date}
                  </Text>
                  <Text size="sm" mt={4}>
                    {item.description}
                  </Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card withBorder radius="md" className={classes.featureCard}>
              <Title order={2} size="h3" mb="md">
                Kiến trúc độc đáo
              </Title>
              <List
                spacing="sm"
                size="sm"
                center
                icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <GiLotus size={16} />
                  </ThemeIcon>
                }
              >
                <List.Item>
                  Tượng đài người lính với đóa sen tưởng niệm
                </List.Item>
                <List.Item>
                  18 bậc thang tượng trưng cho 18 đời vua Hùng
                </List.Item>
                <List.Item>Hoa văn trống đồng Ngọc Lũ độc đáo</List.Item>
                <List.Item>
                  Thiết kế hình bông sen nở với hồ nước trung tâm
                </List.Item>
              </List>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
