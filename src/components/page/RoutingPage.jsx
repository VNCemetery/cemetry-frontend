import MapView from "../ui/MapView";
import { useEffect, useRef, useState } from "react";
import MatyrSearch from "../ui/MatyrSearch";
import { findPath, provideFeedback } from "../../services/pathFindingService";
import { useInfoStore } from "../../store/useInfoStore";
import { useMatyrStore } from "../../store/useMatyrStore";
import { useMapStore } from "../../store/useMapStore";
import { Paper, ActionIcon, Text, Modal, Button, Drawer } from "@mantine/core";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { MdLocationOff } from "react-icons/md"; // Add this import
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { AppDrawer } from "../ui/AppDrawer";
import { Marker, Popup } from "maplibre-gl";
export default function RoutingPage() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const markerElementRef = useRef(null);
  const previousRotationRef = useRef(0);
  const totalRotationRef = useRef(0);
  const popupRef = useRef(null);
  let ROOT_NODE = {
    latitude: 10.461784428052027,
    longitude: 105.64503962080443,
  };

  const mapInstance = useRef(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [showLocationMarker, setShowLocationMarker] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleStartLocationSelection = () => {
    setIsSelectingLocation(true);
    setShowLocationMarker(true);
  };

  const handleLocationSelected = async (location) => {
    setIsSelectingLocation(false);
    setShowLocationMarker(false);

    if (!selectedMartyr) return;

    try {
      const start = [location.longitude, location.latitude];
      let graveRowId = findGraveRowIdByName(
        selectedMartyr.rowName,
        selectedMartyr.areaName
      );

      let data = await findPath(location, graveRowId);
      let coordinates = data?.features[0].geometry.coordinates;
      let end = coordinates[coordinates.length - 1];

      showRoute(start, end, [start, ...coordinates], data);

      const bounds = new maplibregl.LngLatBounds();
      coordinates.forEach((coord) => bounds.extend(coord));
      mapInstance.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000,
      });
    } catch (error) {
      if (error.response?.data?.code === 400) {
        setShowErrorModal(true);
        setErrorMessage(
          <div className="flex flex-col items-center gap-6 p-6">
            <MdLocationOff size={120} color="#ff6b6b" className="mb-4" />
            <Text
              size="28px"
              weight={700}
              align="center"
              style={{ lineHeight: 1.6 }}
              className="max-w-[400px]"
              color="#333"
            >
              Vui lòng kiểm tra lại:
            </Text>
            <Text
              size="24px"
              weight={600}
              align="center"
              style={{ lineHeight: 1.6 }}
              color="#444"
            >
              • Chỉ hỗ trợ tìm trong khu vực nghĩa trang
            </Text>
          </div>
        );
      }
    }
  };

  const handleCancelSelection = () => {
    setIsSelectingLocation(false);
    setShowLocationMarker(false);
  };

  const flyToMartyr = () => {
    const lng = 105.645323;
    const lat = 10.461975;
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 17.3,
        duration: 1000, // Animation duration in milliseconds
      });
    }
  };

  const [currentPath, setCurrentPath] = useState(null);

  const showRoute = (start, end, coordinates = [], data = null) => {
    flyToMartyr();
    // Define all route-related layers
    if (popupRef.current) {
      popupRef.current.remove();
    }

    const routeLayers = ["route", "route-case", "route-start", "route-end"];
    if (data?.features[0].properties.pathId) {
      // Set showFeedback to true if pathId is available
      setShowFeedback(true);
      setCurrentPath(data.features[0].properties.pathId);
    }
    // Clean up existing layers and sources
    routeLayers.forEach((layer) => {
      if (map.current.getLayer(layer)) {
        map.current.removeLayer(layer);
      }
    });

    // Clean up sources
    ["route", "start-point", "end-point"].forEach((source) => {
      if (map.current.getSource(source)) {
        map.current.removeSource(source);
      }
    });

    // Add new source and layers
    // If coordinates are not provided and geojson_data is provided, use geojson_data
    if (!coordinates && geojson_data) {
      map.current.addSource("route", {
        type: "geojson",
        data: geojson_data,
      });
    } else {
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates || [start, end],
          },
        },
      });
    }

    map.current.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#0f53ff", // Changed to specified blue
        "line-width": [
          "interpolate",
          ["exponential", 1.5],
          ["zoom"],
          5,
          1, // Reduced from 1.5
          18,
          8, // Reduced from 8
        ],
      },
    });

    map.current.addLayer({
      id: "route-case",
      type: "line",
      source: "route",
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-width": [
          "interpolate",
          ["exponential", 1.75],
          ["zoom"],
          5,
          0.5, // Reduced from 1
          18,
          3, // Reduced from 2
        ],
        "line-color": "#0a11d8", // Changed to darker blue
        "line-gap-width": [
          "interpolate",
          ["exponential", 1.5],
          ["zoom"],
          5,
          1, // Reduced from 1.5
          18,
          8, // Reduced from 10
        ],
      },
    });

    // Add start point marker
    map.current.addSource("start-point", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: start,
        },
      },
    });

    map.current.addLayer({
      id: "route-start",
      type: "circle",
      source: "start-point",
      paint: {
        "circle-radius": 8, // Increased size
        "circle-color": "#2470ff", // Bright blue
        "circle-stroke-width": 4, // Thicker border
        "circle-stroke-color": "#FFFFFF", // Dark blue border for contrast
        "circle-opacity": 1,
      },
    });

    // Add end point marker
    map.current.addSource("end-point", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: end,
        },
      },
    });

    map.current.addLayer({
      id: "route-end",
      type: "circle",
      source: "end-point",
      paint: {
        "circle-radius": 8, // Increased size
        "circle-color": "#08cc5d", // Bright blue
        "circle-stroke-width": 4, // Thicker border
        "circle-stroke-color": "#FFFFFF", // Dark blue border for contrast
        "circle-opacity": 1,
      },
    });
  };

  const handleFeedback = async (isGood) => {
    try {
      await provideFeedback(currentPath, isGood);
      notifications.show({
        title: "Cảm ơn bạn!",
        message: "Phản hồi của bạn đã được ghi nhận",
        color: "green",
      });
      setShowFeedback(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      notifications.show({
        title: "Có lỗi xảy ra",
        message: "Không thể gửi phản hồi",
        color: "red",
      });
    }
  };

  const { findGraveRowIdByName } = useInfoStore();
  const { selectedMartyr } = useMatyrStore();

  const {
    currentPosition: currentLocation,
    setCurrentPosition: setCurrentLocation,
  } = useMapStore((state) => state);

  const handleRoute = async (start, currentCoordinates) => {
    if (popupRef.current) {
      popupRef.current.remove();
    }
    setShowLocationMarker(false);
    if (!mapInstance.current || !selectedMartyr) return;

    try {
      // Get current position

      let graveRowId =
        selectedMartyr.graveRow.id ||
        findGraveRowIdByName(selectedMartyr.rowName, selectedMartyr.areaName);

      let data = await findPath(currentCoordinates, graveRowId);

      let coordinates = data?.features[0].geometry.coordinates;
      let end = coordinates[coordinates.length - 1];

      // Show the route
      showRoute(start, end, coordinates, data);

      // Optional: Fit map to show entire route
      const bounds = new maplibregl.LngLatBounds();
      coordinates.forEach((coord) => bounds.extend(coord));
      mapInstance.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000,
      });

      // Add popup after showing route
      popupRef.current = new Popup({
        closeButton: false,
        closeOnClick: false,
        className: "custom-popup",
      })
        .setLngLat(end)
        .setHTML(
          `
          <div style="padding: 10px; text-align: center;">
            <strong style="font-size: 16px; color: #333;">Vị trí mộ của liệt sĩ</strong>
            <p style="margin: 5px 0; color: #666;">${
              selectedMartyr?.name || "Không có tên"
            }</p>
          </div>
        `
        )
        .addTo(map.current);
    } catch (error) {
      if (error.response?.data?.code === 400) {
        setErrorMessage(
          "Không tìm thấy đường đi!\nVui lòng đảm bảo bạn đang ở trong khuôn viên nghĩa trang."
        );
        setShowErrorModal(true);
      }
    }
  };

  const handleRouteFromCurrentLocation = async () => {
    const start = [currentLocation.longitude, currentLocation.latitude];
    handleRoute(start, currentLocation);
  };

  const handleRouteFromGate = async () => {
    let start = [ROOT_NODE.longitude, ROOT_NODE.latitude];
    handleRoute(start, ROOT_NODE);
  };

  const onClearRouteHandler = () => {
    setShowLocationMarker(false);
    setCurrentPath(null);
    setShowFeedback(false);
    // Clear route on mapInstance
    // Clean up existing layers
    ["route", "route-case", "route-start", "route-end"].forEach((layer) => {
      if (map.current.getLayer(layer)) {
        map.current.removeLayer(layer);
      }
    });

    // Clean up existing sources
    ["route", "start-point", "end-point"].forEach((source) => {
      if (map.current.getSource(source)) {
        map.current.removeSource(source);
      }
    });
  };

  const clearPopupMartyr = () => {
    // Clear previous popup if exists
    if (popupRef.current) {
      popupRef.current.remove();
    }

    // Clear previous layers/sources
    if (map.current.getLayer("route-end-t")) {
      map.current.removeLayer("route-end-t");
    }
    if (map.current.getSource("end-point-t")) {
      map.current.removeSource("end-point-t");
    }
  };

  const renderMarker = (coordinates) => {
    onClearRouteHandler();
    clearPopupMartyr();

    // Create and set popup
    popupRef.current = new Popup({
      closeButton: false,
      closeOnClick: false,
      className: "custom-popup",
    })
      .setLngLat(coordinates)
      .setHTML(
        `<div style="
        font-family: 'Manrope', sans-serif;
        padding: 1px; text-align: center;">
          <p style="margin: 1px 0; color: #666; font-weight: 900">LIỆT SĨ: ${
            selectedMartyr?.fullName || "Không có tên"
          }</p>
        </div>`
      )
      .addTo(map.current);

    // Add end point marker source
    map.current.addSource("end-point-t", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: coordinates,
        },
      },
    });

    // Add the main marker layer
    map.current.addLayer({
      id: "route-end-t",
      type: "circle",
      source: "end-point-t",
      paint: {
        "circle-radius": 8,
        "circle-color": "#FF0000",
        "circle-stroke-width": 4,
        "circle-stroke-color": "#FFFFFF",
        "circle-opacity": 1,
      },
    });

    // Create blinking effect
    let isVisible = true;
    const blink = () => {
      if (!map.current) return;

      if (isVisible) {
        map.current.setPaintProperty(
          "route-end-t",
          "circle-stroke-opacity",
          0.9
        );
        map.current.setPaintProperty("route-end-t", "circle-opacity", 0.9);
      } else {
        map.current.setPaintProperty("route-end-t", "circle-opacity", 1);
        map.current.setPaintProperty("route-end-t", "circle-stroke-opacity", 1);
      }
      isVisible = !isVisible;

      setTimeout(blink, 900); // Blink every 500ms
    };

    blink();
  };

  const handleMapLoad = (map) => {
    mapInstance.current = map;
  };
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
  useEffect(() => {
    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
    };
  }, []);
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const getMartyrGraveLocation = async () => {
    // Get the root element of the marker

    let graveRowId =
      selectedMartyr.graveRow.id ||
      findGraveRowIdByName(selectedMartyr.rowName, selectedMartyr.areaName);

    let data = await findPath(ROOT_NODE, graveRowId);

    let coordinates = data?.features[0].geometry.coordinates;
    let end = coordinates[coordinates.length - 1];
    renderMarker(end);
  };

  useEffect(() => {
    map.current.on("load", () => {
      if (selectedMartyr) {
        getMartyrGraveLocation();
      }
    });
  }, [map.current]);

  useEffect(() => {
    if (map.current && selectedMartyr) {
      getMartyrGraveLocation();
    }
  }, [selectedMartyr]);

  return (
    <div className="h-full relative">
      <AppDrawer
        opened={openedDrawer}
        closeDrawer={closeDrawer}
        title="Authentication"
      />
      <Modal
        opened={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={
          <Text
            size="30px"
            weight={900}
            color="red"
            align="center"
            className="mb-4"
          >
            Không tìm được đường đi
          </Text>
        }
        centered
        size="lg"
        padding="xl"
        radius="lg"
      >
        <div className="flex flex-col items-center gap-6 p-6">
          <MdLocationOff size={120} color="#ff6b6b" className="mb-4" />
          <Text
            size="28px"
            weight={700}
            align="center"
            style={{ lineHeight: 1.6 }}
            className="max-w-[400px]"
            color="#333"
          >
            Vui lòng kiểm tra lại:
          </Text>
          <div className="flex flex-col gap-4">
            <Text
              className="text-xl font-bold"
              align="center"
              style={{ lineHeight: 1.6 }}
              color="#444"
            >
              • Bạn đã cho phép ứng dụng xác định vị trí
            </Text>
            <Text
              className="text-xl font-bold"
              align="center"
              style={{ lineHeight: 1.6 }}
              color="#444"
            >
              • Bạn đang ở trong khuôn viên nghĩa trang
            </Text>
          </div>
          <Button
            size="xl"
            fullWidth
            onClick={() => setShowErrorModal(false)}
            mt="xl"
          >
            Đã hiểu
          </Button>
        </div>
      </Modal>

      <MatyrSearch
        clearPopupMartyr={clearPopupMartyr}
        openDrawer={() => {
          openDrawer();
        }}
        openedDrawer={openedDrawer}
        onClearRoute={onClearRouteHandler}
        onRouteFromCurrentLocation={handleRouteFromCurrentLocation}
        onRouteFromGate={handleRouteFromGate}
        onSelectLocationOnMap={handleStartLocationSelection}
      />

      {showFeedback && (
        <Paper
          className="fixed bottom-24 left-1/2 transform -translate-x-1/2 
            px-6 py-3 rounded-full flex justify-center  w-full z-[2] bg-transparent"
        >
          <div
            className="flex px-4 items-center gap-4  bg-white/95 
            border border-gray-200 p-2 rounded-xl shadow-lg"
          >
            <Text size="sm" c="dimmed">
              Chỉ đường có tốt không?
            </Text>
            <div className="flex gap-2">
              <ActionIcon
                variant="light"
                color="green"
                onClick={() => handleFeedback(true)}
                className="hover:scale-110 transition-transform"
              >
                <FaThumbsUp size={18} />
              </ActionIcon>
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => handleFeedback(false)}
                className="hover:scale-110 transition-transform"
              >
                <FaThumbsDown size={18} />
              </ActionIcon>
            </div>
          </div>
        </Paper>
      )}

      <div className="h-full w-full top-0 absolute">
        <MapView
          mapContainer={mapContainer}
          map={map}
          markerRef={markerRef}
          markerElementRef={markerElementRef}
          previousRotationRef={previousRotationRef}
          totalRotationRef={totalRotationRef}
          onMapLoad={handleMapLoad}
          isSelectingLocation={isSelectingLocation}
          onLocationSelected={handleLocationSelected}
          onCancelSelection={handleCancelSelection}
          showSelectionMarker={showLocationMarker}
          currentPosition={currentLocation}
        />
      </div>
    </div>
  );
}
