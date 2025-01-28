import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Paper,
  ThemeIcon,
  SimpleGrid,
  Box,
  rem,
} from "@mantine/core";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import classes from "./NewsPage.module.css";

const contactData = [
  {
    title: "ĐỊA CHỈ",
    description: "Nghĩa trang Liệt sĩ tỉnh Đồng Tháp,\nPhường 6, TP. Cao Lãnh, Đồng Tháp",
    icon: FiMapPin,
  },
  {
    title: "HOTLINE",
    description: "(0277) 3851 259",
    icon: FiPhone,
  },
  {
    title: "EMAIL",
    description: "abc@gmail.com",
    icon: FiMail,
  },
  {
    title: "GIỜ LÀM VIỆC",
    description: "Thứ 2 - Thứ 6: 7h00 - 17h00\nThứ 7, Chủ nhật: 7h00 - 11h30",
    icon: FiClock,
  },
];

export default function ContactPage() {
  const items = contactData.map((item) => (
    <Paper withBorder p="md" radius="md" key={item.title}>
      <Group>
        <ThemeIcon
          size={40}
          radius="md"
          variant="light"
          color="blue"
        >
          <item.icon size={rem(20)} />
        </ThemeIcon>

        <Box style={{ flex: 1 }}>
          <Text size="sm" tt="uppercase" fw={700} c="dimmed">
            {item.title}
          </Text>
          <Text size="md" fw={500} style={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>
            {item.description}
          </Text>
        </Box>
      </Group>
    </Paper>
  ));

  return (
    <Container py="xl" style={{ marginBottom: '80px' }}>
      <Stack gap="xl">
        <Box>
          <Title order={1} ta="center" mb="xl">
            Liên hệ với Ban quản lý Nghĩa trang Liệt sĩ
          </Title>
          <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto">
            Mọi thông tin chi tiết xin vui lòng liên hệ với Ban quản lý Nghĩa trang Liệt sĩ tỉnh Đồng Tháp
            qua các kênh thông tin sau:
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {items}
        </SimpleGrid>

        <Paper withBorder p="xl" radius="md">
          <Title order={2} size="h3" mb="md">
            Bản đồ chỉ dẫn
          </Title>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.0657563595424!2d105.62999661478386!3d10.27013989247444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310a72c6dad6545f%3A0x4e65f270d623a1d9!2zTmdoxKlhIHRyYW5nIGxp4buHdCBz4bu5IHThu4luaCDEkOG7k25nIFRow6Fw!5e0!3m2!1svi!2s!4v1645167246789!5m2!1svi!2shttps://www.google.com/maps/place/Ngh%C4%A9a+Trang+Li%E1%BB%87t+S%C4%A9+%C4%90%E1%BB%93ng+Th%C3%A1p/@10.4948589,105.6596776,16z/data=!4m20!1m13!4m12!1m4!2m2!1d107.2103424!2d10.4923136!4e1!1m6!1m2!1s0x310a64526b398beb:0xefd2d90d9317b09d!2zRko2VytWNTcgTmdoxKlhIFRyYW5nIExp4buHdCBTxKkgxJDhu5NuZyBUaMOhcCwgUUwzMCwgUGjGsOG7nW5nIE3hu7kgUGjDuiwgVHAuIENhbyBMw6NuaCwgxJDhu5NuZyBUaMOhcA!2m2!1d105.6454066!2d10.4621573!3m5!1s0x310a64526b398beb:0xefd2d90d9317b09d!8m2!3d10.4621573!4d105.6454066!16s%2Fg%2F1tdpcnls?entry=ttu&g_ep=EgoyMDI1MDEyMi4wIKXMDSoASAFQAw%3D%3D"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </Paper>

        <Paper withBorder p="xl" radius="md" mb="xl">
          <Title order={2} size="h3" mb="md">
            Thông tin thêm
          </Title>
          <Text size="lg">
            Ban quản lý Nghĩa trang Liệt sĩ tỉnh Đồng Tháp luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của người thân liệt sĩ và các đoàn khách đến viếng thăm.
            Chúng tôi cam kết phục vụ quý khách với tinh thần trách nhiệm cao nhất.
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
} 