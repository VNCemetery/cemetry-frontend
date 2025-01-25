import { ActionIcon, Button, Flex, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useLocation, useNavigate, useNavigation } from "react-router";
import { tabarItems } from "../../constants/tabarItems.jsx";

export default function TabBar({ currentPath, updateCurrentPath }) {
  const navigate = useNavigate();
  const matches = useMediaQuery("(min-width: 768px)");

  // Create variable to check condition currentItem

  return (
    <div className="flex text-blue-900  bg-gray-100 px-1 gap-2 h-full flex-row items-center justify-center py-1">
      {tabarItems.map((item) => {
        const isActive = item.to === currentPath;
        return (
          <div
            key={item.to}
            onClick={() => {
              updateCurrentPath(item.to);
              navigate(item.to, { replace: true });
            }}
            className="p-1 flex h-full cursor-pointer flex-col  rounded-md border-[1px]  w-full max-w-[9rem] flex "
          >
            <div
              className={`h-full text-gray-600 ${
                isActive
                  ? "text-blue-700 bg-blue-200 border-[1px] border-blue-400"
                  : "text-blue-900"
              } flex justify-center py-2 rounded-md mx-1`}
            >
              {isActive ? item.filled : item.outline}
            </div>
            <div
              className={`h-full text-[1rem] text-center ${
                isActive ? "font-extrabold" : "font-normal"
              }`}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
