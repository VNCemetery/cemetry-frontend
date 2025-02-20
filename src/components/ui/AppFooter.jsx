import { ActionIcon, Container, Group, Text } from "@mantine/core";
import SUPPORT_LOGO from "../../assets/SUPPORT_LOGO.png";

import classes from "./AppFooter.module.css";
import { FiFacebook, FiTwitch, FiYoutube } from "react-icons/fi";
import { HiThumbDown } from "react-icons/hi";
import { FaFacebook, FaYoutube } from "react-icons/fa";

const data = [
  {
    title: "Liên kết",
    links: [
      { label: "Cổng thông tin", link: "https://dongthap.gov.vn/" },
      { label: "Tỉnh Đoàn Đồng Tháp", link: "http://tinhdoandongthap.org.vn/" },
    ],
  },
];

export default function AppFooter() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <img src={SUPPORT_LOGO} alt="Mantine logo" />
          <Text size="md" mt={24} c="dimmed" className={classes.description}>
            Công trình thanh niên
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          @ 2025 Bản quyền thuộc về Đoàn Trường Đại Học Sư Phạm Kỹ Thuật TP.HCM
        </Text>

        <Group
          gap={0}
          className={classes.social}
          justify="flex-end"
          wrap="nowrap"
        >
          <ActionIcon size="lg" color="gray" variant="subtle">
            <FaFacebook size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
