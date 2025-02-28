import { ActionIcon, Anchor, Container, Group, Text } from "@mantine/core";
import SUPPORT_LOGO from "../../assets/SUPPORT_LOGO.png";
import DONG_THAP_LOGO from "../../assets/DONG_THAP_LOGO.png";

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
        onClick={(event) => {
          window.open(link.link, "_blank");
        }}
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
        <div className={classes.logo} style={{ marginBottom: "1rem" }}>
          <img
            src={SUPPORT_LOGO}
            alt="Trường Đại Học Sư Phạm Kỹ Thuật TP.HCM"
          />
          <Text
            size="sm"
            // No break word

            ta="center"
            mt={10}
            c="black"
            className={classes.description}
          >
            Trường Đại Học Sư Phạm Kỹ Thuật TP. HCM
          </Text>
        </div>
        <div className={classes.logo}>
          <img src={DONG_THAP_LOGO} alt="Tỉnh Đoàn Đồng Tháp" />
          <Text
            size="sm"
            ta="center"
            mt={10}
            c="black"
            className={classes.description}
          >
            Tỉnh Đồng Tháp
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Group className="w-full text-center flex items-center justify-center">
          <Text ta="center" c="dimmed" size="sm">
            Công trình thanh niên phối hợp giữa Đoàn Trường Đại Học Sư Phạm Kỹ
            Thuật TP.HCM & <br />
            Tỉnh đoàn, Hội LHTN Việt Nam tỉnh Đồng Tháp
          </Text>
          <Text ta="center" c="dimmed" size="sm">
            © 2025 Bản quyền thuộc về <a></a>
            <Anchor href="https://tuoitre.hcmute.edu.vn" target="_blank">
              Đoàn Trường Đại Học Sư Phạm Kỹ Thuật TP.HCM
            </Anchor>{" "}
          </Text>
        </Group>
      </Container>
    </footer>
  );
}
