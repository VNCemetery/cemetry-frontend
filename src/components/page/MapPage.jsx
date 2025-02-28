import CarouselImage from "../ui/CarouselImage";

import {
  Container,
  Title,
  Text,
  Timeline,
  ThemeIcon,
  Image,
  Grid,
  Card,
  List,
  Accordion,
  Group,
  Stack,
  Badge,
  Input,
  Modal,
  ScrollArea,
  CloseIcon,
  ActionIcon,
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
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaUserFriends,
} from "react-icons/fa";
import { GiTempleDoor, GiLotus } from "react-icons/gi";
import { useDisclosure } from "@mantine/hooks";
import classes from "./MapPage.module.css";
import { BiSearch } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { useSearchMartyrStore } from "../../store/useSearchMartyrStore";
import SearchPopupModal from "../ui/MatyrSearch/SearchPopupModal";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_SEARCH_SIZE } from "../../utils/constants";
import { BsArrowLeft } from "react-icons/bs";

export default function MapPage() {
  const [drawerOpened, { toggle: toggleDrawer }] = useDisclosure(false);

  const timelineData = [
    {
      title: "Khởi công xây dựng",
      date: "1980",
      icon: <FaMonument size={18} />,
      description: "Bắt đầu xây dựng với diện tích hơn 3,5 héc ta",
    },
    {
      title: "Khánh thành",
      date: "26/7/1984",
      icon: <GiTempleDoor size={18} />,
      description: "Chính thức khánh thành và đưa vào sử dụng",
    },
    {
      title: "Công nhận Di tích",
      date: "10/4/2003",
      icon: <FaLandmark size={18} />,
      description: "Được công nhận di tích lịch sử cấp tỉnh",
    },
  ];

  const stats = [
    { value: "3.5", label: "Héc ta diện tích", icon: <FaLeaf /> },
    { value: "2,500+", label: "Liệt sĩ an nghỉ", icon: <FaMonument /> },
    { value: "18", label: "Bậc thang tưởng niệm", icon: <GiLotus /> },
    { value: "1984", label: "Năm khánh thành", icon: <FaHistory /> },
  ];

  const cardColors = [
    { bg: "blue.0", border: "blue.3", icon: "blue.6", text: "blue.9" },
    { bg: "green.0", border: "green.3", icon: "green.6", text: "green.9" },
    { bg: "pink.0", border: "pink.3", icon: "pink.6", text: "pink.9" },
    { bg: "orange.0", border: "orange.3", icon: "orange.6", text: "orange.9" },
  ];
  const [opened, { open, close }] = useDisclosure(true);

  return (
    <>
      <Container size="xl" className={classes.wrapper}>
        {/* Stats Grid */}
        <Grid my={50}>
          {stats.map((stat, index) => (
            <Grid.Col key={stat.label} span={{ base: 6, sm: 6, md: 3 }}>
              <Card
                className={classes.statCard}
                bg={cardColors[index % cardColors.length].bg}
                withborder
                styles={{
                  root: {
                    borderColor: `var(--mantine-color-${
                      cardColors[index % cardColors.length].border
                    })`,
                    overflow: "visible",
                  },
                  content: {
                    ".mantine-Text-root.statValue": {
                      color: `var(--mantine-color-${
                        cardColors[index % cardColors.length].text
                      })`,
                      fontWeight: 900,
                    },
                    ".mantine-Text-root:last-child": {
                      color: `var(--mantine-color-${
                        cardColors[index % cardColors.length].border
                      })`,
                    },
                  },
                }}
              >
                <div className={classes.iconWrapper}>
                  <ThemeIcon
                    size={80}
                    radius="xl"
                    color={cardColors[index % cardColors.length].icon}
                    className={classes.statIcon}
                  >
                    {stat.icon}
                  </ThemeIcon>
                </div>
                <Text
                  className={classes.statValue}
                  style={{
                    fontSize: "clamp(1.8rem, 3vw, 2rem)",
                    width: "100%",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  mt={45}
                  c={cardColors[index % cardColors.length].text}
                >
                  {stat.value}
                </Text>
                <Text
                  size="sm"
                  c="dimmed"
                  mt={0}
                  style={{ fontSize: "1.1rem" }}
                >
                  {stat.label}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
        <div className="text-center">
          <Title className={classes.heroTitle} c={"blue.6"} pb={20}>
            Hình ảnh Nghĩa trang
          </Title>{" "}
          <CarouselImage />
        </div>
        <Accordion
          multiple
          variant="separated"
          mt={40}
          defaultValue={["visiting"]}
          classNames={{ item: classes.accordionItem }}
        >
          <Accordion.Item value="visiting">
            <Accordion.Control>
              <Group>
                <ThemeIcon color="blue" variant="light" size={34}>
                  <FaMapMarkerAlt size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={600} size="lg">
                    Hướng dẫn thăm quan
                  </Text>
                  <Text size="sm" c="dimmed" style={{ fontSize: "1.1rem" }}>
                    Thông tin chi tiết về thời gian, quy định và tiện ích
                  </Text>
                </div>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Card
                    withborder
                    radius="md"
                    padding="lg"
                    className={classes.infoCard}
                  >
                    <Stack spacing="md">
                      <Group>
                        <ThemeIcon
                          color="blue"
                          size={34}
                          variant="light"
                          radius="xl"
                        >
                          <FaClock size={20} />
                        </ThemeIcon>
                        <Text fw={600} size="xl">
                          Thời gian tham quan
                        </Text>
                      </Group>
                      <List spacing="sm" size="md" ml={10}>
                        <List.Item
                          icon={
                            <ThemeIcon color="blue" size={24} variant="light">
                              <FaClock size={14} />
                            </ThemeIcon>
                          }
                        >
                          <Text fw={500} size="lg">
                            Giờ mở cửa:
                          </Text>
                          <Text ml={10} size="md">
                            6:00 - 17:30 hàng ngày
                          </Text>
                        </List.Item>
                        <List.Item
                          icon={
                            <ThemeIcon color="green" size={24} variant="light">
                              <FaLeaf size={14} />
                            </ThemeIcon>
                          }
                        >
                          <Text fw={500} size="lg">
                            Thời gian lý tưởng:
                          </Text>
                          <Text ml={10} size="md">
                            Sáng sớm (6:00 - 8:00)
                          </Text>
                          <Text ml={10} size="md">
                            Chiều mát (15:30 - 17:00)
                          </Text>
                        </List.Item>
                        <List.Item
                          icon={
                            <ThemeIcon color="grape" size={24} variant="light">
                              <FaHistory size={14} />
                            </ThemeIcon>
                          }
                        >
                          <Text fw={500} size="lg">
                            Thời lượng đề xuất:
                          </Text>
                          <Text ml={10} size="md">
                            1-2 giờ để tham quan đầy đủ
                          </Text>
                        </List.Item>
                      </List>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Card
                    withborder
                    radius="md"
                    padding="lg"
                    className={classes.infoCard}
                  >
                    <Stack spacing="md">
                      <Group>
                        <ThemeIcon
                          color="teal"
                          size={34}
                          variant="light"
                          radius="xl"
                        >
                          <FaInfoCircle size={20} />
                        </ThemeIcon>
                        <Text fw={600} size="xl">
                          Quy định tham quan
                        </Text>
                      </Group>
                      <List spacing="sm" size="sm" ml={10}>
                        <List.Item
                          icon={
                            <ThemeIcon color="blue" size={24} variant="light">
                              <FaUserFriends size={14} />
                            </ThemeIcon>
                          }
                        >
                          <Text fw={500} size="lg">
                            Trang phục:
                          </Text>
                          <Text
                            ml={10}
                            size="md"
                            style={{ fontSize: "1.1rem" }}
                          >
                            Lịch sự, trang nghiêm
                          </Text>
                        </List.Item>
                        <List.Item
                          icon={
                            <ThemeIcon color="orange" size={24} variant="light">
                              <FaInfoCircle size={14} />
                            </ThemeIcon>
                          }
                        >
                          <Text fw={500} size="lg">
                            Ứng xử:
                          </Text>
                          <Text
                            ml={10}
                            size="md"
                            style={{ fontSize: "1.1rem" }}
                          >
                            Giữ yên lặng, trang nghiêm
                          </Text>
                          <Text
                            ml={10}
                            size="md"
                            style={{ fontSize: "1.1rem" }}
                          >
                            Không gây ồn ào, nói chuyện lớn tiếng
                          </Text>
                        </List.Item>
                        <List.Item
                          icon={
                            <ThemeIcon color="red" size={24} variant="light">
                              <FaInfoCircle size={14} />
                            </ThemeIcon>
                          }
                        >
                          <Text fw={500} size="lg">
                            Lưu ý:
                          </Text>
                          <Text
                            ml={10}
                            size="md"
                            style={{ fontSize: "1.1rem" }}
                          >
                            Không mang đồ ăn, thức uống
                          </Text>
                          <Text
                            ml={10}
                            size="md"
                            style={{ fontSize: "1.1rem" }}
                          >
                            Không hút thuốc trong khuôn viên
                          </Text>
                        </List.Item>
                      </List>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Card
                    withborder
                    radius="md"
                    padding="lg"
                    className={classes.infoCard}
                  >
                    <Stack spacing="md">
                      <Group>
                        <ThemeIcon
                          color="violet"
                          size={34}
                          variant="light"
                          radius="xl"
                        >
                          <FaMapMarkedAlt size={20} />
                        </ThemeIcon>
                        <Text fw={600} size="xl">
                          Tiện ích
                        </Text>
                      </Group>
                      <List spacing="sm" size="sm" ml={10}>
                        <List.Item
                          icon={
                            <ThemeIcon color="indigo" size={24} variant="light">
                              <FaMonument size={14} />
                            </ThemeIcon>
                          }
                        >
                          <Text fw={500} size="lg">
                            Khu vực tâm linh:
                          </Text>
                          <Text ml={10} size="md">
                            Khu đặt hoa, thắp hương
                          </Text>
                          <Text ml={10} size="md">
                            Nhà tưởng niệm
                          </Text>
                        </List.Item>
                        <List.Item
                          icon={
                            <ThemeIcon color="cyan" size={24} variant="light">
                              <FaMapMarkerAlt size={14} />
                            </ThemeIcon>
                          }
                        >
                          <Text fw={500} size="lg">
                            Cơ sở vật chất:
                          </Text>
                          <Text ml={10} size="md">
                            Bãi đỗ xe rộng rãi, miễn phí
                          </Text>
                        </List.Item>
                        <List.Item
                          icon={
                            <ThemeIcon color="green" size={24} variant="light">
                              <FaUserFriends size={14} />
                            </ThemeIcon>
                          }
                        >
                          <Text fw={500} size="lg">
                            Hỗ trợ:
                          </Text>
                          <Text ml={10} size="md">
                            Hướng dẫn viên miễn phí
                          </Text>
                          <Text ml={10} size="md">
                            Bảo vệ 24/7
                          </Text>
                          <Text ml={10} size="md">
                            Sơ cứu y tế
                          </Text>
                        </List.Item>
                      </List>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="info">
            <Accordion.Control>
              <Group>
                <ThemeIcon color="blue" variant="light" size={34}>
                  <FaUserFriends size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={600} size="lg">
                    Thông tin chi tiết
                  </Text>
                  <Text size="sm" c="dimmed">
                    Lịch sử và ý nghĩa của di tích
                  </Text>
                </div>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Card
                    withborder
                    radius="md"
                    padding="lg"
                    className={classes.infoCard}
                  >
                    <Stack spacing="lg">
                      <Group>
                        <ThemeIcon
                          color="blue"
                          size={34}
                          variant="light"
                          radius="xl"
                        >
                          <FaMonument size={20} />
                        </ThemeIcon>
                        <Text fw={600} size="xl">
                          Giới thiệu chung
                        </Text>
                      </Group>
                      <Text
                        size="md"
                        style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
                      >
                        Nghĩa trang liệt sĩ tỉnh Đồng Tháp được khởi công xây
                        dựng vào năm 1980 với diện tích hơn 3,5 héc ta và khánh
                        thành vào ngày 26/7/1984. Hiện nay nơi đây đã quy tập
                        được gần 2.500 liệt sĩ có danh tính.
                      </Text>
                      <Text
                        size="md"
                        style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
                      >
                        Với công trình kiến trúc gồm phía trước là tượng đài
                        người lính, ngực đính huân chương, trầm mặc cầm đóa sen
                        đến thăm đồng đội. Tất cả mộ chí đều được phủ màu xanh
                        của cây và hoa. Chân đài tưởng niệm có 18 bậc thang,
                        tượng trưng 18 đời vua Hùng kế tiếp nhau dựng nước. Dưới
                        chân tượng đài là hoa văn trống đồng Ngọc Lũ và ba bức
                        phù điêu minh họa các thời kỳ lịch sử trong tỉnh.
                      </Text>
                      <Text
                        size="md"
                        style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
                      >
                        Nhìn từ trên xuống, nghĩa trang như một bông sen đang nở
                        xòe mà nhụy hoa là hồ nước ở giữa, mỗi bên là ba cánh
                        sen. Trên các cánh sen là nơi an nghỉ của hơn 3.000 liệt
                        sĩ đã hy sinh trong hai cuộc kháng chiến. Tất cả quần
                        thể kiến trúc này khiến cho nơi đây được xem là một
                        trong những nghĩa trang đẹp nhất ở miền Tây Nam bộ.
                      </Text>
                      <Text
                        size="md"
                        style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
                      >
                        Nơi đây được Ủy ban Nhân dân tỉnh Đồng Tháp ra quyết
                        định xếp hạng và công nhận di tích lịch sử lưu niệm cấp
                        tỉnh vào ngày 10/4/2003.
                      </Text>
                      <Group mt="md">
                        <Badge size="lg" variant="light" color="blue">
                          Di tích cấp tỉnh
                        </Badge>
                        <Badge size="lg" variant="light" color="green">
                          Mở cửa tự do
                        </Badge>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Card
                    withborder
                    radius="md"
                    padding="lg"
                    className={classes.infoCard}
                  >
                    <Stack spacing="md">
                      <Group>
                        <ThemeIcon
                          color="teal"
                          size={34}
                          variant="light"
                          radius="xl"
                        >
                          <FaLandmark size={20} />
                        </ThemeIcon>
                        <Text fw={600} size="xl">
                          Kiến trúc
                        </Text>
                      </Group>
                      <List
                        spacing="sm"
                        size="sm"
                        center
                        icon={
                          <ThemeIcon color="teal" size={24} variant="light">
                            <GiLotus size={14} />
                          </ThemeIcon>
                        }
                      >
                        <List.Item>
                          <Text size="md">Diện tích: 3.5 héc ta</Text>
                        </List.Item>
                        <List.Item>
                          <Text size="md">Thiết kế theo hình bông sen nở</Text>
                        </List.Item>
                        <List.Item>
                          <Text size="md">
                            18 bậc thang tượng trưng cho 18 đời vua Hùng
                          </Text>
                        </List.Item>
                        <List.Item>
                          <Text size="md">Tượng đài trung tâm cao 39m</Text>
                        </List.Item>
                        <List.Item>
                          <Text size="md">Hệ thống chiếu sáng hiện đại</Text>
                        </List.Item>
                      </List>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <Grid mt={60} mb={60}>
          <Grid.Col span={12}>
            <Card
              withborder
              padding="xl"
              radius="md"
              className={classes.infoCard}
            >
              <Stack spacing="lg">
                <Group>
                  <ThemeIcon color="blue" size={34} variant="light" radius="xl">
                    <FaHistory size={20} />
                  </ThemeIcon>
                  <Text fw={600} size="xl">
                    Lịch sử phát triển
                  </Text>
                </Group>

                <Timeline
                  active={3}
                  bulletSize={34}
                  lineWidth={2}
                  color="blue"
                  sx={{ padding: "20px 0" }}
                >
                  {timelineData.map((item, index) => (
                    <Timeline.Item
                      key={index}
                      bullet={
                        <ThemeIcon
                          size={34}
                          radius="xl"
                          variant="gradient"
                          gradient={{ from: "blue", to: "cyan" }}
                        >
                          {item.icon}
                        </ThemeIcon>
                      }
                      title={
                        <Group gap="xs" align="center" sx={{ marginBottom: 5 }}>
                          <Text fw={600} size="lg" color="blue.9">
                            {item.title}
                          </Text>
                          <Badge size="lg" variant="filled" color="blue">
                            {item.date}
                          </Badge>
                        </Group>
                      }
                    >
                      <Card
                        withborder
                        mt="sm"
                        radius="md"
                        padding="md"
                        bg="white"
                        shadow="sm"
                      >
                        <Stack spacing="xs">
                          <Text size="md" fw={500} color="gray.8">
                            {item.description}
                          </Text>
                          {index === 0 && (
                            <Text
                              size="sm"
                              c="dimmed"
                              style={{ fontSize: "1.1rem" }}
                            >
                              Khởi công xây dựng trên khu đất rộng hơn 3,5 héc
                              ta, với sự đóng góp của nhân dân trong tỉnh
                            </Text>
                          )}
                          {index === 1 && (
                            <Text
                              size="sm"
                              c="dimmed"
                              style={{ fontSize: "1.1rem" }}
                            >
                              Khánh thành và đưa vào sử dụng với sự tham dự của
                              lãnh đạo tỉnh và đông đảo nhân dân
                            </Text>
                          )}
                          {index === 2 && (
                            <Text
                              size="sm"
                              c="dimmed"
                              style={{ fontSize: "1.1rem" }}
                            >
                              Được Bộ Văn hóa - Thông tin công nhận là di tích
                              lịch sử văn hóa cấp tỉnh
                            </Text>
                          )}
                        </Stack>
                      </Card>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
