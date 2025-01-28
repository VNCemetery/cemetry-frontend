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
  rem,
} from "@mantine/core";
import {
  FaMonument,
  FaHistory,
  FaLandmark,
  FaLeaf,
  FaClock,
  FaMapMarkedAlt,
  FaInfoCircle,
  FaExclamationCircle,
} from "react-icons/fa";
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
    <>
      <div className={classes.heroWrapper}>
        <Container size="xl">
          <div className={classes.hero}>
            <Title className={classes.heroTitle} fw={900}>
              Nghĩa Trang Liệt Sĩ Tỉnh Đồng Tháp
            </Title>
            <Text className={classes.heroDescription} fw={500}>
              Di tích lịch sử văn hóa cấp tỉnh
            </Text>
            <Text className={classes.heroDescription} fw={500}>
              Nơi tưởng nhớ và tri ân các anh hùng liệt sĩ
            </Text>
          </div>
        </Container>
      </div>

      <Container size="xl" className={classes.wrapper}>
        {/* Hướng dẫn tham quan - Đưa lên đầu */}
        <Card withBorder radius="md" className={classes.guideCard} mb={50}>
          <Group mb="md">
            <ThemeIcon size={40} radius="md" color="blue" variant="light">
              <FaInfoCircle size={24} />
            </ThemeIcon>
            <Title order={2} fw={700}>Hướng dẫn tham quan</Title>
          </Group>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack spacing="lg">
                <Group>
                  <ThemeIcon size={32} color="blue" variant="light">
                    <FaClock size={18} />
                  </ThemeIcon>
                  <div>
                    <Text fw={700} mb={4}>Thời gian tham quan</Text>
                    <List spacing={8} size="md">
                      <List.Item>Mở cửa: 6:00 - 17:30 hàng ngày</List.Item>
                      <List.Item>Thời gian thắp hương: 6:00 - 17:00</List.Item>
                      <List.Item>Nghỉ trưa: 11:30 - 13:30</List.Item>
                    </List>
                  </div>
                </Group>

                <Group>
                  <ThemeIcon size={32} color="blue" variant="light">
                    <FaExclamationCircle size={18} />
                  </ThemeIcon>
                  <div>
                    <Text fw={700} mb={4}>Quy định chung</Text>
                    <List spacing={8} size="md">
                      <List.Item>Trang phục lịch sự, trang nghiêm</List.Item>
                      <List.Item>Giữ gìn vệ sinh, không xả rác</List.Item>
                      <List.Item>Không gây ồn ào, mất trật tự</List.Item>
                    </List>
                  </div>
                </Group>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack spacing="lg">
                <Group>
                  <ThemeIcon size={32} color="blue" variant="light">
                    <FaMapMarkedAlt size={18} />
                  </ThemeIcon>
                  <div>
                    <Text fw={700} mb={4}>Các khu vực tham quan</Text>
                    <List spacing={8} size="md">
                      <List.Item>Đài tưởng niệm trung tâm</List.Item>
                      <List.Item>Khu mộ liệt sĩ theo khu vực</List.Item>
                      <List.Item>Nhà bia ghi danh</List.Item>
                      <List.Item>Khu vực thắp hương, đặt hoa</List.Item>
                    </List>
                  </div>
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>
        </Card>

        {/* Stats Grid - Chuyển xuống sau */}
        <Grid mb={50}>
          {stats.map((stat, index) => (
            <Grid.Col key={stat.label} span={{ base: 12, sm: 6, md: 3 }}>
              <Card className={classes.statCard}>
                <div className={classes.iconWrapper}>
                  <div className={classes.statIcon}>
                    {stat.icon}
                  </div>
                </div>
                <Text className={classes.statValue} mt={35}>
                  {stat.value}
                </Text>
                <Text size="md" c="dimmed">
                  {stat.label}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* Thông tin chi tiết */}
        <Accordion defaultValue="info" variant="separated" mt={40}>
          <Accordion.Item value="info">
            <Accordion.Control>
              <Group>
                <ThemeIcon size={32} color="blue" variant="light">
                  <FaInfoCircle size={18} />
                </ThemeIcon>
                <Title order={3} fw={700}>Thông tin chi tiết</Title>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack spacing="lg">
                <Text size="lg" style={{ lineHeight: 1.6 }}>
                  Nghĩa trang liệt sĩ tỉnh Đồng Tháp được xây dựng từ năm 1980 trên diện tích hơn 3,5 héc ta. 
                  Đây là nơi yên nghỉ của hơn 2.500 liệt sĩ đã hy sinh trong hai cuộc kháng chiến chống Pháp và chống Mỹ.
                </Text>

                <Text size="lg" style={{ lineHeight: 1.6 }}>
                  Công trình được thiết kế với ý tưởng độc đáo, lấy cảm hứng từ hình tượng bông sen - biểu tượng của vùng đất Sen Hồng Đồng Tháp. 
                  Điểm nhấn của công trình là đài tưởng niệm trung tâm với 18 bậc thang tượng trưng cho 18 đời vua Hùng, thể hiện tinh thần "uống nước nhớ nguồn" của dân tộc.
                </Text>

                <Text size="lg" style={{ lineHeight: 1.6 }}>
                  Kiến trúc tổng thể của nghĩa trang được bố trí hài hòa giữa các khu vực chức năng: khu mộ liệt sĩ, đài tưởng niệm, nhà bia ghi danh, và khu vực thắp hương. 
                  Toàn bộ không gian được bao phủ bởi nhiều cây xanh, tạo nên không gian trang nghiêm, thanh tịnh.
                </Text>
              </Stack>
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
              <Title order={2} size="h3" mb="md" fw={700}>
                Kiến trúc độc đáo
              </Title>
              <List
                spacing="sm"
                size="lg"
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
