import {
  Anchor,
  Card,
  Group,
  SimpleGrid,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import classes from "./ActionsGrid.module.css";
import { FiLink } from "react-icons/fi";

const mockdata = [
  { title: "Credit cards", icon: <FiLink />, color: "violet" },
  { title: "Banks nearby", icon: <FiLink />, color: "indigo" },
  { title: "Transfers", icon: <FiLink />, color: "blue" },
  { title: "Refunds", icon: <FiLink />, color: "green" },
  { title: "Receipts", icon: <FiLink />, color: "teal" },
  { title: "Taxes", icon: <FiLink />, color: "cyan" },
  { title: "Reports", icon: <FiLink />, color: "pink" },
  { title: "Payments", icon: <FiLink />, color: "red" },
  { title: "Cashback", icon: <FiLink />, color: "orange" },
];

export default function ActionsGrid() {
  const theme = useMantineTheme();

  const items = mockdata.map((item) => (
    <UnstyledButton key={item.title} className={classes.item}>
      {item.icon}
      <Text size="xs" mt={7}>
        {item.title}
      </Text>
    </UnstyledButton>
  ));

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Group justify="space-between">
        <Text className={classes.title}>Services</Text>
        <Anchor size="xs" c="dimmed" style={{ lineHeight: 1 }}>
          + 21 other services
        </Anchor>
      </Group>
      <SimpleGrid cols={3} mt="md">
        {items}
      </SimpleGrid>
    </Card>
  );
}
