import MapView from "../ui/MapView";
import { useEffect, useRef, useState } from "react";
import MatyrSearch from "../ui/MatyrSearch";
import { findPath, provideFeedback } from "../../services/pathFindingService";
import { useInfoStore } from "../../store/useInfoStore";
import { useMatyrStore } from "../../store/useMatyrStore";
import { useMapStore } from "../../store/useMapStore";
import { Paper, ActionIcon, Text } from "@mantine/core";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { notifications } from "@mantine/notifications";

export default function RoutingPage() {
  // Move refs here
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const markerElementRef = useRef(null);
  const previousRotationRef = useRef(0);
  const totalRotationRef = useRef(0);

  const [viewport, setViewport] = useState({
    latitude: 10.461780290048,
    longitude: 105.645622290328,
    bearing: 50,
    zoom: 5,
  });

  const mapInstance = useRef(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [showLocationMarker, setShowLocationMarker] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

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

      //back
      showRoute(start, end, [start, ...coordinates], data);

      const bounds = new maplibregl.LngLatBounds();
      coordinates.forEach((coord) => bounds.extend(coord));
      mapInstance.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000,
      });
    } catch (error) {
      console.error("Error finding route:", error);
    }
  };

  const handleCancelSelection = () => {
    setIsSelectingLocation(false);
    setShowLocationMarker(false);
  };

  const [currentPath, setCurrentPath] = useState(null);

  const showRoute = (start, end, coordinates = [], data = null) => {
    // Define all route-related layers

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
          6, // Reduced from 8
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
          ["exponential", 1.5],
          ["zoom"],
          5,
          0.5, // Reduced from 1
          18,
          1.5, // Reduced from 2
        ],
        "line-color": "#0a11d8", // Changed to darker blue
        "line-gap-width": [
          "interpolate",
          ["exponential", 1.5],
          ["zoom"],
          5,
          1, // Reduced from 1.5
          18,
          5, // Reduced from 10
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
        "circle-radius": 8,
        "circle-color": "#25b058", // Changed to green
        "circle-stroke-width": 3,
        "circle-stroke-color": "#4de373", // Changed to lighter green
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
        "circle-radius": 8,
        "circle-color": "#FF0000", // Changed to red
        "circle-stroke-width": 3,
        "circle-stroke-color": "#FF4444", // Changed to lighter red
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
  const handleShowTestRoute = async () => {
    if (!mapInstance.current) return;
    if (!selectedMartyr) return;
    // Example coordinates for testing
    const start = [105.644921898426, 10.461701682269];
    let graveRowId = findGraveRowIdByName(selectedMartyr.rowName);
    let currentLocation = {
      latitude: start[1],
      longitude: start[0],
    };
    let data = await findPath(currentLocation, graveRowId);
    let coordinates = data?.features[0].geometry.coordinates;
    let end = coordinates[coordinates.length - 1];
    showRoute(start, end, [start, ...coordinates], data);
    // After drawing route, show feedback UI
  };

  const {
    currentPosition: currentLocation,
    setCurrentPosition: setCurrentLocation,
  } = useMapStore((state) => state);

  const handleRouteFromCurrentLocation = async () => {
    setShowLocationMarker(false);
    if (!mapInstance.current || !selectedMartyr) return;

    try {
      // Get current position

      const start = [currentLocation.longitude, currentLocation.latitude];
      let graveRowId = findGraveRowIdByName(selectedMartyr.rowName);

      let data = await findPath(currentLocation, graveRowId);
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
    } catch (error) {
      console.error("Error finding route:", error);
      // Handle error appropriately
    }
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

  return (
    <div className="h-full relative">
      <MatyrSearch
        onRouteFromCurrentLocation={handleRouteFromCurrentLocation}
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
