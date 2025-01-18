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
    <div className="">
      <div className="gap-2 flex py-1 w-full justify-between">
        {items.map((item) => {
          return (
            <button
              key={item.to}
              className={`flex py-2 gap-1 transition-all ease-in-out border-[1px] duration-50 justify-center   items-center w-full rounded-lg  ${
                item.to === pathname ? "text-blue-500 " : "text-slate-500"
              } 
 
               ${matches ? "flex-row" : "flex-col"}
             
              `}
              onClick={() => navigate(item.to)}
            >
              {item.icon}
              {item.to === pathname && (
                <span className="text-[.9rem] font-bold">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
