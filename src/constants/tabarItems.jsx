import { FaPhone } from "react-icons/fa";
import { HiMap, HiOutlineMap } from "react-icons/hi";

import {
  TiLocation,
  TiLocationOutline,
} from "react-icons/ti";

export const tabarItems = [
  {
    outline: <TiLocationOutline />,
    filled: <TiLocation className="text-blue-600" />,
    label: "Chỉ đường",
    to: "/",
  },
  {
    outline: <HiOutlineMap />,
    filled: <HiMap className="text-blue-600" />,
    label: "Giới thiệu",
    to: "/map",
  },
  {
    outline: <FaPhone />,
    filled: <FaPhone className="text-blue-600" />,
    label: "Liên hệ",
    to: "/contact",
  },
];
