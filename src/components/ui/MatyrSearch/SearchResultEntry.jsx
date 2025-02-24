import { Badge, Flex, Group, Text } from "@mantine/core";
import classes from "./SearchResultEntry.module.css";

export default function SearchResultEntry({ item, selectItem }) {
  return (
    <div
      onClick={selectItem}
      className="hover:bg-gray-50 cursor-pointer border border-gray-300 mb-3 w-full rounded-md p-3 transition-all"
    >
      <Flex direction="column" className="w-full">
        <div className=" pb-2">
          <Flex align={"center"} gap={4}>
            <span className="font-bold text-lg">Liệt sĩ</span>
            <span className="font-extrabold text-xl text-blue-500">
              {item.fullName}
            </span>
          </Flex>
        </div>

        <Text size="lg" className="mb-2">
          <span className="text-gray-900">Quê quán:</span>{" "}
          <span className="font-medium">{item.homeTown || "Không rõ"}</span>
        </Text>

        <Flex gap={2}>
          <Badge size="xl" radius="lg">
            Hàng: {item.graveRow.rowName}
          </Badge>
          <Badge size="xl" bg={"green"} radius="lg">
            Khu: {item.graveRow.areaName}
          </Badge>
        </Flex>
      </Flex>
    </div>
  );
}
