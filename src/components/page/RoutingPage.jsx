import MapView from "../ui/MapView";
import { useEffect, useRef, useState } from "react";
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
