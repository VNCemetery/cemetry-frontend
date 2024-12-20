import { Link } from "react-router";
import HeaderWrapper from "../ui/HeaderWrapper";
import { Input } from "@mantine/core";
import { BiSearch } from "react-icons/bi";
import ReactMapGL, { Layer, Marker, Source } from "@goongmaps/goong-map-react";
import { useEffect, useState } from "react";
import { SVGOverlay } from "@goongmaps/goong-map-react";

export default function RoutingPage() {
  const [viewport, setViewport] = useState({
    latitude: 10.461780290048,
    longitude: 105.645622290328,
    bearing: 50,
    zoom: 5,
  });

  const [currentLocaiton, setCurrentLocation] = useState({
    latitude: 10.461780290048,
    longitude: 105.645622290328,
  });
  function redraw({ project }) {
    const [cx, cy] = project([
      currentLocaiton.longitude,
      currentLocaiton.latitude,
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

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 4,
      "circle-color": "#007cbf",
    },
  };
  const [geojson, setGeojson] = useState(null);
  fetch("../src/path.geojson")
    .then((response) => response.json())
    .then((json) => {
      setGeojson(json);
    });
  useEffect(() => {
    (async () => {
      const res = await fetch("../src/path.geojson");
      const data = await res.json();
      setGeojson(data);
    })();
  }, []);
  return (
    <div className="h-full">
      <HeaderWrapper>
        <div className="p-4">
          <Input
            radius={"xl"}
            p={4}
            rightSection={<BiSearch />}
            placeholder="Tìm kiếm mộ liệt sĩ"
          />
        </div>
      </HeaderWrapper>
      <div>
        {/* BODY */}
        <ReactMapGL
          width={"100%"}
          height={"100vh"}
          goongApiAccessToken={import.meta.env.VITE_GOONG_MAPTILES_KEY}
          {...viewport}
          onViewportChange={(nextViewport) => setViewport(nextViewport)}
        >
          <SVGOverlay redraw={redraw} />
        </ReactMapGL>
      </div>
    </div>
  );
}
