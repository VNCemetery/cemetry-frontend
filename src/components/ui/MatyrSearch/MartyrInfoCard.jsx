import { Avatar, Button, Card, Flex, Group, Text } from "@mantine/core";
import { FaDirections, FaInfo, FaPrint, FaStar } from "react-icons/fa";

export default function MartyrInfoCard({ fullName }) {
  return (
    <Card withBorder padding="xl" radius="md">
      <Avatar
        src=""
        className="bg-white"
        size={80}
        radius={80}
        mx="auto"
        mt={-20}
      />
      <div className="flex flex-col items-center">
        <Text ta={"center"}>Liệt sĩ</Text>
        <Text ta="center" fz="lg" fw={700}>
          {fullName}
        </Text>
      </div>
      <Text ta="center" fz="sm" c="dimmed"></Text>

      <div className="flex  mt-4 gap-2">
        <Button
          color="green"
          className="flex items-center justify-center "
          fullWidth
          radius="md"
          size="md"
          variant="filled"
        >
          <Text>In thông tin</Text>
          <FaPrint className="m-2" />
        </Button>{" "}
        <Button
          color="orange"
          className="flex items-center justify-center "
          fullWidth
          radius="md"
          size="md"
          variant="filled"
        >
          <Text>Đóng góp</Text>
          <FaStar className="m-2" />
        </Button>
      </div>
    </Card>
  );
}
