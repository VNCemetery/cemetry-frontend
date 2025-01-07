import { Avatar, Badge, Flex, Group, Text } from "@mantine/core";
import classes from "./UserInfoIcons.module.css";

export default function UserInfoIcons({ item, selectItem }) {
  return (
    <div
      onClick={selectItem}
      className="hover:bg-gray-100 cursor-pointer hover:border-blue-400 mb-2 w-full mt-2 border-[1px] rounded-xl p-1"
    >
      <Group wrap="wrap">
        <Flex gap={1} align={"center"} direction={"column"} className="w-full">
          <div className="flex justify-between gap-2 w-full p-2">
            <Avatar
              size={50}
              src={item.avatar}
              radius={50}
              className={classes.avatar}
            />
            <div className="flex flex-col w-full justify-start">
              <Text fw={600} size="md">
                {item.fullName}
              </Text>
              <Text fw={400} size="md" lineClamp={1}>
                {item.rankPositionUnit}
              </Text>
              {item.homeTown && (
                <Text fw={400} size="md" lineClamp={1}>
                  Quê quán: {item.homeTown}
                </Text>
              )}
            </div>
          </div>
          <div className="flex justify-start p-2 w-full gap-2 items-center ">
            <Badge color="blue">Khu {item.areaName}</Badge>
            <Badge color="blue">Hàng {item.rowName}</Badge>
          </div>
        </Flex>
      </Group>
    </div>
  );
}

// import { Avatar, Badge, Group, Text } from "@mantine/core";
// import VIETNAM_LOGO from "../../../assets/VIETNAM_FLAG_LOGO.png";

// const SearchResultEntry = ({ item }) => {
//   return (
//     <div
//       onClick={() => {
//         alert(JSON.stringify(item));
//       }}
//       key={item.id}
//       className="border-[1px] mb-1 border-gray-200 rounded-2xl p-2 hover:bg-gray-100 cursor-pointer"
//     >
//       <Group gap="sm">
//         <Avatar size={50} src={""} radius={50} />

//         </div>
//       </Group>
//     </div>
//   );
// };

// export default SearchResultEntry;
