import { ActionIcon, Button, Flex, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { FaAccusoft, FaEarDeaf } from "react-icons/fa6";
import { useLocation, useNavigate, useNavigation } from "react-router";

export default function TabBar({ items, currentItem }) {
  const navigate = useNavigate();
  const matches = useMediaQuery("(min-width: 768px)");
  const { pathname } = useLocation();
  return (
    <div>
      <div className="p-1 gap-2 flex w-full justify-between">
        {items.map((item) => {
          return (
            <button
              className={`flex justify-center   items-center gap-1 w-full py-2 rounded-lg  ${
                item.to === pathname
                  ? "bg-blue-500 text-white "
                  : "text-blue-500"
              } 

               ${matches ? "flex-row" : "flex-col"}
             
              `}
              onClick={() => navigate(item.to)}
            >
              {item.icon}
              <span className="text-[0.65rem] font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
    // <Group justify="center" gap={4} className="p-4">
    //   {items.map((item) => {
    //     return (
    //       <Button
    //         component="a"
    //         href="https://mantine.dev"
    //         size="sm"
    //         aria-label="Open in a new tab"
    //         onClick={(event) => event.preventDefault()}
    //       >
    //         {item.icon}
    //         {item.label}
    //       </Button>
    //     );
    //   })}
    // </Group>
  );
}
