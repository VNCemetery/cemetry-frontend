import HeaderWrapper from "../ui/HeaderWrapper";
import { Input, Tabs } from "@mantine/core";
import { BiSearch } from "react-icons/bi";
import ReactMapGL, { Layer, Marker, Source } from "@goongmaps/goong-map-react";
import { useEffect, useState } from "react";
import { SVGOverlay } from "@goongmaps/goong-map-react";
import SearchForm from "../ui/SearchForm";
import LocationSearchForm from "../ui/LocationSearchForm";

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

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 4,
      "circle-color": "#007cbf",
    },
  };
  const [geojson, setGeojson] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("../src/path.geojson");
      const data = await res.json();
      setGeojson(data);
    })();
  }, []);

  const handleSearch = (searchData) => {
    try {
      console.log('Thông tin:', searchData);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
    } 
  };

  const handleLocationSearch = (locationData) => {
    try {
      console.log('Vị trí:', locationData);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm vị trí:', error);
    }
  };

  return (
    <div className="h-full relative">
      <HeaderWrapper>
        <Tabs defaultValue="info">
          <Tabs.List style={{ backgroundColor: '#F2E7ED' }}>
            <Tabs.Tab value="info">Thông tin</Tabs.Tab>
            <Tabs.Tab value="location">Vị trí</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="info">
            <SearchForm onSearch={handleSearch} />
          </Tabs.Panel>

          <Tabs.Panel value="location">
            <LocationSearchForm onSearch={handleLocationSearch} />
          </Tabs.Panel>
        </Tabs>
      </HeaderWrapper>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <ReactMapGL
          width="100%"
          height="100%"
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
