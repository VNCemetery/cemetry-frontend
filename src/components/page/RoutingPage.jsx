import HeaderWrapper from "../ui/HeaderWrapper";
import {
  ActionIcon,
  Badge,
  Card,
  CloseIcon,
  Group,
  Image,
  Input,
  Modal,
  Tabs,
  Text,
} from "@mantine/core";
import MapView from "../ui/MapView";
import {
  BiArrowToLeft,
  BiChevronLeft,
  BiMenu,
  BiMicrophone,
  BiSearch,
} from "react-icons/bi";
import ReactMapGL, { Layer, Marker, Source } from "@goongmaps/goong-map-react";
import { useEffect, useRef, useState } from "react";
import { SVGOverlay } from "@goongmaps/goong-map-react";
import SearchForm from "../ui/SearchForm";
import LocationSearchForm from "../ui/LocationSearchForm";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button } from "@mantine/core";
import { FiArrowLeft } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";
import { BsArrowLeft, BsRecord } from "react-icons/bs";
import { IoRecording } from "react-icons/io5";
import MatyrSearch from "../ui/MatyrSearch";

export default function RoutingPage() {
  const [viewport, setViewport] = useState({
    latitude: 10.461780290048,
    longitude: 105.645622290328,
    bearing: 50,
    zoom: 5,
  });

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 10.461780290048,
    longitude: 105.645622290328,
  });

  function redraw({ project }) {
    const [cx, cy] = project([
      currentLocation.longitude,
      currentLocation.latitude,
    ]);
    return <circle cx={cx} cy={cy} r={4} fill="blue" />;
  }

  // get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      },
      () => {},
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  return (
    <div className="h-full relative ">
      <MatyrSearch />
      <div className="h-full w-full top-0 absolute">
        <MapView />
      </div>
    </div>
  );
}
