import {
  AspectRatio,
  Card,
  Container,
  Image,
  SimpleGrid,
  Text,
  Stack,
} from "@mantine/core";
import { ActionGrid } from "./ActionGrid";
import classes from "./NewsPage.module.css";

const mockdata = [
  {
    title:
      "Sa Đéc: Tổ chức Lễ Thắp Nến Tri Ân - Kỷ niệm 76 năm ngày Thương binh Liệt sĩ",
    image:
      "https://sadec.dongthap.gov.vn/documents/481527/0/dai+bieu+tham+du+%283%29.jpg/3a188f6d-6ff7-c4bb-4ad4-4f604458881c?t=1658895589118",
    date: "27/7/2023",
    description:
      "Nhân Kỷ niệm 76 năm ngày Thương binh Liệt sĩ (27/7/1947 - 27/7/2023), toàn Đảng, toàn quân, toàn dân và thế hệ trẻ tưởng nhớ trước công lao to lớn của các anh hùng, liệt sĩ...",
    link: "http://tinhdoandongthap.org.vn/chi-tiet-bai-viet/-/asset_publisher/1mOzUrGkrdAE/content/id/15831088",
  },
  {
    title: "Đồng Tháp – nhiều hoạt động kỷ niệm ngày Thương binh – Liệt sĩ",
    image:
      "https://dongthap.gov.vn/documents/34223/0/IMG_9920.jpg/12be57d6-f45a-a19c-75c4-89ef28b99983?t=1688546189645",
    date: "05/7/2023",
    description:
      "Thông tin này được ông Phạm Việt Công – Giám đốc Sở Lao động – Thương binh và Xã hội chia sẻ tại Hội nghị Giao ban báo chí tháng 6...",
    link: "https://dongthap.gov.vn/chi-tiet-bai-viet/-/asset_publisher/1mOzUrGkrdAE/content/id/15646298",
  },
];

export default function NewsPage() {
  const cards = mockdata.map((article) => (
    <Card
      key={article.title}
      p="md"
      radius="md"
      component="a"
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className={classes.card}
    >
      <AspectRatio ratio={1920 / 1080}>
        <Image src={article.image} alt={article.title} />
      </AspectRatio>
      <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
        {article.date}
      </Text>
      <Text className={classes.title} mt={5} lineClamp={2}>
        {article.title}
      </Text>
      <Text c="dimmed" size="sm" mt="sm" lineClamp={3}>
        {article.description}
      </Text>
    </Card>
  ));

  return (
    <Container py="xl">
      <Stack gap="xl">
        <ActionGrid />
        <SimpleGrid cols={{ base: 1, sm: 2 }}>{cards}</SimpleGrid>
      </Stack>
    </Container>
  );
}
