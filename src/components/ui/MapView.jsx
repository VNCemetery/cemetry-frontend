import React, { useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapStore } from "../../store/useMapStore";
import { Paper, Text } from "@mantine/core";
import { HiOutlineCursorClick } from "react-icons/hi";

export default function MapViewPage({
  mapContainer,
  map,
  markerRef,
  markerElementRef,
  previousRotationRef,
  totalRotationRef,
  onMapLoad,
  isSelectingLocation = false,
  onLocationSelected,
  onCancelSelection,
  showSelectionMarker = false,
  currentPosition,
}) {
  const lng = 105.644921898426;
  const lat = 10.461701682269;
  const zoom = 17.3;
  const mapUrl = import.meta.env.VITE_MAPTILES_URL;
  const mapKey = import.meta.env.VITE_MAPTILES_KEY;

  const { setCurrentPosition, setCurrentHeading, currentHeading } = useMapStore(
    (state) => state
  );

  const centerOnLocation = () => {
    if (map.current && currentPosition.latitude && currentPosition.longitude) {
      map.current.flyTo({
        center: [currentPosition.longitude, currentPosition.latitude],
        zoom: 17.3,
        duration: 1000, // Animation duration in milliseconds
      });
    }
  };

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `${mapUrl}goong_satellite.json?api_key=${mapKey}`,
      center: [lng, lat],
      zoom: zoom,
      bearing: 55,
    });

    map.current.on("load", () => {
      onMapLoad(map.current);
    });
  }, [mapKey, lng, lat, zoom, onMapLoad]);

  // Create and maintain marker
  useEffect(() => {
    if (!map.current) return;

    // Create marker element
    const markerEl = document.createElement("div");
    markerEl.className = "bg-transparent w-8 scale-300 h-8";
    markerEl.innerHTML = `
<svg class="navigation-arrow" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16.058" cy="23.799" r="7.295" fill="#4285F4" stroke="white" style="stroke-width: 0.5px;"></circle>
  <path d="M 16 0.476 L 26.818 19.272 L 16 13.633 L 5.182 19.272 L 16 0.476 Z" fill="#4285F4" stroke="white" style="stroke-width: 0.5px;"></path>
</svg>
    `;
    markerElementRef.current = markerEl;

    // Create marker
    markerRef.current = new maplibregl.Marker({
      element: markerEl,
      scale: 1.0,
      rotationAlignment: "map",
      pitchAlignment: "map",
    })
      .setLngLat([currentPosition.longitude, currentPosition.latitude])
      .addTo(map.current);

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map.current]);

  // Handle heading updates
  useEffect(() => {
    const handleOrientation = (event) => {
      let heading = event.webkitCompassHeading || Math.abs(event.alpha - 360);
      // Calculate continuous rotation
      const previousRotation = previousRotationRef.current;
      let deltaRotation = heading - (previousRotation % 360);
      alert(JSON.stringify(event));
      // Adjust for crossing 0/360 boundary
      if (deltaRotation > 180) {
        deltaRotation -= 360;
      } else if (deltaRotation < -180) {
        deltaRotation += 360;
      }

      // Update total rotation
      totalRotationRef.current += deltaRotation;
      previousRotationRef.current = heading;

      setCurrentHeading(heading);

      // Update marker rotation with continuous value
      if (markerElementRef.current) {
        const arrow =
          markerElementRef.current.querySelector(".navigation-arrow");
        if (arrow) {
          arrow.style.transform = `rotate(${totalRotationRef.current}deg)`;
        }
      }
    };

    window.addEventListener(
      "deviceorientationabsolute",
      handleOrientation,
      true
    );
    return () => {
      window.removeEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true
      );
    };
  }, []);

  // Handle position updates
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ latitude, longitude });

        // Update marker position
        if (markerRef.current) {
          markerRef.current.setLngLat([longitude, latitude]);
        }
      },
      (error) => console.error("Error getting location:", error),
      { enableHighAccuracy: true }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Add temporary selection marker
  useEffect(() => {
    if (!map.current || !showSelectionMarker || !currentPosition.latitude)
      return;

    const tempMarker = new maplibregl.Marker({
      color: "#FF0000",
    })
      .setLngLat([currentPosition.longitude, currentPosition.latitude])
      .addTo(map.current);

    // Add popup
    const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
      '<div class="text-sm font-medium">Bạn đang ở đây</div>'
    );

    tempMarker.setPopup(popup);
    popup.addTo(map.current);

    return () => {
      tempMarker.remove();
      popup.remove();
    };
  }, [showSelectionMarker, currentPosition]);

  // Handle click for location selection
  useEffect(() => {
    if (!map.current) return;

    const handleMapClick = (e) => {
      if (!isSelectingLocation) return;

      const { lng, lat } = e.lngLat;
      onLocationSelected({ longitude: lng, latitude: lat });
    };

    if (isSelectingLocation) {
      map.current.getCanvas().style.cursor = "crosshair";
      map.current.on("click", handleMapClick);
    } else {
      map.current.getCanvas().style.cursor = "";
      map.current.off("click", handleMapClick);
    }

    return () => {
      if (map.current) {
        map.current.off("click", handleMapClick);
        map.current.getCanvas().style.cursor = "";
      }
    };
  }, [isSelectingLocation, onLocationSelected]);

  return (
    <>
      <style>
        {`
          .navigation-arrow {
            width: 32px;
            height: 32px;
            transform-origin: center;
            transition: transform 0.3s ease;
            will-change: transform;
            filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
          }
          .center-location-button {
            transform-origin: center;
            transition: all 0.2s ease;
          }
          .center-location-button:active {
            transform: scale(0.95);
          }
        `}
      </style>

      <button
        onClick={centerOnLocation}
        className="fixed bottom-20 right-5 bg-white/90 p-3 rounded-full shadow-md z-[3] hover:bg-white/100 center-location-button"
        aria-label="Center on current location"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <circle cx="12" cy="12" r="3" strokeWidth="2" />
          <path d="M12 2v3m0 14v3M2 12h3m14 0h3" strokeWidth="2" />
        </svg>
      </button>

      {isSelectingLocation && (
        <Paper
          className="fixed top-20 left-1/2 transform -translate-x-1/2 px-6 py-3 
            rounded-full shadow-lg z-[1000] bg-white/95 backdrop-blur-sm
            border border-gray-200 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <HiOutlineCursorClick className="text-blue-500 w-5 h-5 " />
              <Text size="sm" fw={500} className="text-gray-700">
                Chọn vị trí trên bản đồ
              </Text>
            </div>
            <div className="w-[1px] h-4 bg-gray-300" />
            <button
              onClick={onCancelSelection}
              className="text-red-500 hover:text-red-600 text-sm font-medium 
                transition-colors focus:outline-none active:scale-95"
            >
              Hủy
            </button>
          </div>
        </Paper>
      )}

      <div ref={mapContainer} className="absolute z-[0] w-full h-screen" />
    </>
  );
}
