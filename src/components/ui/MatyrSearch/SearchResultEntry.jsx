import { Avatar, Group, Text } from "@mantine/core";
import VIETNAM_LOGO from "../../../assets/VIETNAM_FLAG_LOGO.png";

const SearchResultEntry = ({ item }) => {
  return (
    <div
      onClick={() => {
        alert(JSON.stringify(item));
      }}
      key={item.id}
      className="border-[1px] mb-1 border-gray-200 rounded-2xl p-2 hover:bg-gray-100 cursor-pointer"
    >
      <Group gap="sm">
        <Avatar size={50} src={VIETNAM_LOGO} radius={50} />
        <div>
          <Text fz="sm" fw={500}>
            {item.fullName}
          </Text>
          <Text c="dimmed" fz="xs">
            {item.rankPositionUnit}
          </Text>
          <Text c="dimmed" fz="xs">
            {item.province && "Quê quán: " + item.province}
            {item.yearOfBirth && "-"} {item.yearOfBirth}
          </Text>
        </div>
      </Group>
    </div>
  );
};

export default SearchResultEntry;
