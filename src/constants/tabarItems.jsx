import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { FaAccusoft, FaEarDeaf } from "react-icons/fa6";
import { HiMap, HiOutlineMap } from "react-icons/hi";

import {
  TiLocation,
  TiLocationOutline,
  TiPlus,
  TiPlusOutline,
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
    outline: <TiPlusOutline />,
    filled: <TiPlus className="text-blue-600" />,
    label: "Đóng góp",
    to: "/contact",
  },
];
