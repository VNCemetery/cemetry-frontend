import { Carousel } from "@mantine/carousel";
import { Button, Paper, Text, Title, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import classes from "./CarouselImage.module.css";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

function Card({ image, title, category }) {
  return (
    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{ backgroundImage: `url(${image})` }}
      className={classes.card}
    ></Paper>
  );
}

const data = [
  {
    image:
      "https://dulichcaolanh.dongthap.gov.vn/storage/travel/place/di-tich-nghia-trang-liet-si-tinh-dong-thap/nghiatrang-1.jpg",
  },
  {
    image:
      "https://media-cdn-v2.laodong.vn/storage/newsportal/2023/10/18/1255909/Dai-Bieu-Dai-Hoi-Con-08.jpg",
    category: "nature",
  },
  {
    image:
      "https://dongthap.gov.vn/documents/34223/0/IMG_6555.jpg/d71e4243-a4b9-f64f-ece7-aa051cb1eaa8?t=1627349868975",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/f3/Cao_Lanh-_nghia_trang_liet_sy%2C_quoc_lo_30_-_panoramio.jpg",
  },
];

export default function CardsCarousel() {
  const theme = useMantineTheme();

  const autoplay = useRef(Autoplay({ delay: 2000 }));
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const slides = data.map((item) => (
    <Carousel.Slide key={item.title}>
      <Card {...item} />
    </Carousel.Slide>
  ));

  return (
    <Carousel
      slideSize={{ base: "100%", sm: "50%" }}
      slideGap={{ base: 2, sm: "xl" }}
      align="start"
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      controlSize={40}
      loop={true}
      slidesToScroll={mobile ? 1 : 1}
    >
      {slides}
    </Carousel>
  );
}
