import { Container, Grid, SimpleGrid } from "@mantine/core";
import MartyrInfoCard from "./MartyrInfoCard";
import {
  FiUser,
  FiCalendar,
  FiHome,
  FiNavigation,
  FiMap,
  FiFileText,
  FiFlag,
  FiMapPin,
  FiInfo,
} from "react-icons/fi";
import classes from "./BadgeCard.module.css";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Image,
  Text,
} from "@mantine/core";
import { MdDirections } from "react-icons/md";

const MartyrDetail = ({ martyr, onRoute }) => {
  const PRIMARY_COL_HEIGHT = "300px";
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

  return (
    <Container my="md">
      <div height={PRIMARY_COL_HEIGHT}>
        <MartyrInfoCard {...martyr} />
      </div>

      <Grid gutter="md">
        <Grid.Col>
          <Card
            withBorder
            radius="md"
            p="md"
            className={classes.card}
            sx={{ borderColor: "#228be6" }}
          >
            <Card.Section className={classes.section}>
              <Text mt="md" className={classes.label} c="blue">
                9 Vị trí an nghỉ
              </Text>
              <Group gap={7} mt={5}>
                <Badge color="blue">Khu {martyr.areaName}</Badge>
                <Badge color="blue">Hàng {martyr.rowName}</Badge>
              </Group>
            </Card.Section>

            <Group mt="xs">
              <Button
                radius="md"
                style={{ flex: 1 }}
                color="blue"
                onClick={onRoute}
                className="flex items-center justify-center"
                fullWidth
                size="md"
                variant="filled"
              >
                <Text>Chỉ đường</Text>
                <FiNavigation className="m-2" />
              </Button>
            </Group>
          </Card>
        </Grid.Col>

        <Grid.Col>
          <Card
            withBorder
            radius="md"
            p="md"
            className={classes.card}
            sx={{ borderColor: "#40c057" }}
          >
            <Card.Section className={classes.section}>
              <Text mt="md" className={classes.label} c="green">
                Thông tin cá nhân
              </Text>
              <div className="space-y-4 mt-4">
                <Grid align="center">
                  <Grid.Col
                    span={2}
                    className="flex items-center justify-center"
                  >
                    <FiUser size={24} className="text-green-500" />
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <Text size="sm">
                      <Text span fw={500}>
                        Họ và tên:{" "}
                      </Text>
                      {martyr.fullName}
                    </Text>
                    {martyr.codeName && (
                      <Text size="xs" c="dimmed">
                        <Text span fw={500}>
                          Bí danh:{" "}
                        </Text>
                        {martyr.codeName}
                      </Text>
                    )}
                  </Grid.Col>
                </Grid>

                <Grid align="center">
                  <Grid.Col
                    span={2}
                    className="flex items-center justify-center"
                  >
                    <FiCalendar size={24} className="text-green-500" />
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <Text size="sm">
                      <Text span fw={500}>
                        Năm sinh:{" "}
                      </Text>
                      {martyr.yearOfBirth || "Chưa có thông tin"}
                    </Text>
                  </Grid.Col>
                </Grid>

                <Grid align="center">
                  <Grid.Col
                    span={2}
                    className="flex items-center justify-center"
                  >
                    <FiHome size={24} className="text-green-500" />
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <Text size="sm">
                      <Text span fw={500}>
                        Quê quán:{" "}
                      </Text>
                      {martyr.homeTown || "Chưa có thông tin"}
                    </Text>
                  </Grid.Col>
                </Grid>

                <Grid align="center">
                  <Grid.Col
                    span={2}
                    className="flex items-center justify-center"
                  >
                    <FiMapPin size={24} className="text-green-500" />
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <Text size="sm">
                      <Text span fw={500}>
                        Địa chỉ:{" "}
                      </Text>
                      {martyr.commune && martyr.district
                        ? `${martyr.commune}, ${martyr.district}`
                        : "Chưa có thông tin"}
                    </Text>
                  </Grid.Col>
                </Grid>
              </div>
            </Card.Section>
          </Card>
        </Grid.Col>

        <Grid.Col>
          <Card
            withBorder
            radius="md"
            p="md"
            className={classes.card}
            sx={{ borderColor: "#fd7e14" }}
          >
            <Card.Section className={classes.section}>
              <Text mt="md" className={classes.label} c="orange">
                Thông tin quân ngũ
              </Text>
              <div className="space-y-4 mt-4">
                <Grid align="center">
                  <Grid.Col
                    span={2}
                    className="flex items-center justify-center"
                  >
                    <FiFlag size={24} className="text-orange-500" />
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <Text size="sm">
                      <Text span fw={500}>
                        Chức vụ - Đơn vị:{" "}
                      </Text>
                      {martyr.rankPositionUnit || "Chưa có thông tin"}
                    </Text>
                  </Grid.Col>
                </Grid>

                <Grid align="center">
                  <Grid.Col
                    span={2}
                    className="flex items-center justify-center"
                  >
                    <FiCalendar size={24} className="text-orange-500" />
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <Text size="sm">
                      <Text span fw={500}>
                        Ngày nhập ngũ:{" "}
                      </Text>
                      {martyr.dateOfEnlistment || "Chưa có thông tin"}
                    </Text>
                  </Grid.Col>
                </Grid>

                <Grid align="center">
                  <Grid.Col
                    span={2}
                    className="flex items-center justify-center"
                  >
                    <FiCalendar size={24} className="text-orange-500" />
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <Text size="sm">
                      <Text span fw={500}>
                        Ngày hy sinh:{" "}
                      </Text>
                      {martyr.dateOfDeath || "Chưa có thông tin"}
                    </Text>
                  </Grid.Col>
                </Grid>

                <Grid align="center">
                  <Grid.Col
                    span={2}
                    className="flex items-center justify-center"
                  >
                    <FiMap size={24} className="text-orange-500" />
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <Text size="sm">
                      <Text span fw={500}>
                        Nơi quy tập:{" "}
                      </Text>
                      {martyr.placeOfExhumation || "Chưa có thông tin"}
                    </Text>
                  </Grid.Col>
                </Grid>
              </div>
            </Card.Section>
          </Card>
        </Grid.Col>

        {martyr.note && (
          <Grid.Col>
            <Card
              withBorder
              radius="md"
              p="md"
              className={classes.card}
              sx={{ borderColor: "#868e96" }}
            >
              <Card.Section className={classes.section}>
                <Text mt="md" className={classes.label} c="gray">
                  Ghi chú
                </Text>
                <Grid align="center">
                  <Grid.Col
                    span={2}
                    className="flex items-center justify-center"
                  >
                    <FiInfo size={24} className="text-gray-500" />
                  </Grid.Col>
                  <Grid.Col span={10}>
                    <Text size="sm">{martyr.note}</Text>
                  </Grid.Col>
                </Grid>
              </Card.Section>
            </Card>
          </Grid.Col>
        )}
      </Grid>
    </Container>
  );
};

export default MartyrDetail;
