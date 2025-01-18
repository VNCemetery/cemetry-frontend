import {
  FiHome,
  FiMapPin,
  FiBook,
  FiFlag,
  FiCalendar,
  FiUsers,
  FiHeart,
  FiAward,
} from "react-icons/fi";
import {
  Anchor,
  Card,
  Group,
  SimpleGrid,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import classes from "./ActionGrid.module.css";
import { MdFiberNew } from "react-icons/md";
import { HiNewspaper } from "react-icons/hi";
import { CgOrganisation } from "react-icons/cg";

const linkData = [
  {
    title: "Cổng thông tin",
    icon: FiHome,
    color: "violet",
    link: "https://dongthap.gov.vn/",
  },
  {
    title: "Du lịch Cao Lãnh",
    icon: FiMapPin,
    color: "indigo",
    link: "https://dulichcaolanh.dongthap.gov.vn/places/historical-sites/di-tich-nghia-trang-liet-si-tinh-dong-thap",
  },
  {
    title: "Báo Đồng Tháp",
    icon: HiNewspaper,
    color: "blue",
    link: "https://www.baodongthap.vn/",
  },
  {
    title: "Sở Lao Động - Thương binh và Xã hội Đồng Tháp",
    icon: CgOrganisation,
    color: "red",
    link: "https://sldtbxh.dongthap.gov.vn/vi/trang-chu",
  },

  {
    title: "Lịch sử",
    icon: FiBook,
    color: "green",
    link: "https://dongthap.gov.vn/lich-su-hinh-thanh-tinh-dong-thap",
  },
  {
    title: "Thành tựu",
    icon: FiAward,
    color: "orange",
    link: "https://thdt.vn/tin-tuc/tuoi-tre-dong-thap-tu-hao-thanh-tuu-kinh-te-xa-hoi-chang-duong-5-nam",
  },
];

export function ActionGrid() {
  const theme = useMantineTheme();

  const items = linkData.map((item) => (
    <UnstyledButton
      key={item.title}
      className={classes.item}
      component="a"
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <item.icon color={theme.colors[item.color][6]} size={32} />
      <Text size="xs" mt={7}>
        {item.title}
      </Text>
    </UnstyledButton>
  ));

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Group justify="space-between">
        <Text className={classes.title}>Liên kết</Text>
        <Anchor
          href="https://dongthap.gov.vn"
          size="xs"
          c="dimmed"
          style={{ lineHeight: 1 }}
        >
          Xem thêm
        </Anchor>
      </Group>
      <SimpleGrid cols={3} mt="md">
        {items}
      </SimpleGrid>
    </Card>
  );
}
