import React, { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMapStore } from "../../store/useMapStore";
import { Paper, Text } from "@mantine/core";
import { HiLocationMarker, HiMap, HiOutlineCursorClick } from "react-icons/hi";

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
  const [hasCompassPermission, setHasCompassPermission] = useState(false);

  const lng = 105.645323;
  const lat = 10.461975;
  const zoom = 17.5;
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

  // Create and maintain marker
  useEffect(() => {
    if (!map.current) return;

    // Create marker element
    const markerEl = document.createElement("div");
    markerEl.className = "bg-transparent w-12  scale-300 h-12";
    markerEl.innerHTML = `
<svg class="navigation-arrow" viewBox="0 0 36 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient gradientUnits="userSpaceOnUse" x1="32" y1="0" x2="32" y2="49.836" id="gradient-0" gradientTransform="matrix(0.593665, 0, 0, 0.549534, -0.994057, -0.80968)">
      <stop offset="0" style="stop-color: rgb(66, 133, 244); stop-opacity:0.1;"></stop>
      <stop offset="1" style="stop-color: rgb(66, 133, 244); stop-opacity: 0.8;"></stop>
    </linearGradient>
  </defs>
  <path d="M -0.691 -0.807 L 36.691 -0.807 L 24.481 26.578 C 24.484 26.508 24.484 26.438 24.484 26.368 C 24.484 22.925 21.583 20.136 18.002 20.136 C 14.422 20.136 11.518 22.925 11.518 26.368 C 11.518 26.438 11.519 26.508 11.521 26.578 L -0.691 -0.807 Z" style="fill: url(#gradient-0);"></path>
  <circle cx="18" cy="24" r="7.295" fill="#4285F4" style="stroke: rgb(255, 255, 255);"></circle>
</svg>`;

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

  const handleOrientation = (event) => {
    let heading = event.webkitCompassHeading || Math.abs(event.alpha - 360);
    // Calculate continuous rotation
    const previousRotation = previousRotationRef.current;
    let deltaRotation = heading - (previousRotation % 360);
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
      const arrow = markerElementRef.current.querySelector(".navigation-arrow");
      if (arrow) {
        arrow.style.transform = `rotate(${totalRotationRef.current}deg)`;
      }
    }
  };

  const startCompass = async () => {
    if (hasCompassPermission) {
      window.addEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true
      );
      return;
    }

    const isIOS =
      navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
      navigator.userAgent.match(/AppleWebKit/);

    if (isIOS) {
      try {
        // Only request if we haven't gotten permission yet
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
          const response = await DeviceOrientationEvent.requestPermission();
          if (response === "granted") {
            setHasCompassPermission(true);
            window.addEventListener(
              "deviceorientation",
              handleOrientation,
              true
            );
            window.addEventListener(
              "deviceorientationabsolute",
              handleOrientation,
              true
            );
          }
        } else {
          // If requestPermission is not available, assume granted (older iOS)
          setHasCompassPermission(true);
          window.addEventListener("deviceorientation", handleOrientation, true);
        }
      } catch (error) {
        console.warn("Compass not supported or permission denied:", error);
      }
    } else {
      // For non-iOS devices, just add the listener
      setHasCompassPermission(true);
      window.addEventListener(
        "deviceorientationabsolute",
        handleOrientation,
        true
      );
    }
  };

  useEffect(() => {
    startCompass();
  }, []);

  useEffect(() => {
    // If permission is still not granted, try again
    if (!currentHeading) {
      startCompass();
    }
  }, [currentPosition]);

  // Handle position updates
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ latitude, longitude });
        startCompass();

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

  // Add temporary selection marker
  useEffect(() => {
    if (!map.current || !showSelectionMarker || !currentPosition.latitude)
      return;
    startCompass();

    const tempMarker = new maplibregl.Marker({
      color: "#FF0000",
    })
      .setLngLat([currentPosition.longitude, currentPosition.latitude])
      .addTo(map.current);

    // Add popup
    const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
      '<div className="text-sm font-medium">Bạn đang ở đây</div>'
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
            scale: 2;
            height: 48px;
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
          @media (max-width: 640px) {
            .navigation-arrow {
              width: 28px;
              height: 28px;
            }
          }
        `}
      </style>

      {isSelectingLocation && (
        <div className="absolute inset-x-0 top-0 p-2 md:px-3 md:pt-3 lg:pt-5 lg:px-8 z-[9]">
          <Paper
            className="w-full lg:max-w-3xl mx-auto p-3 sm:p-4 
              rounded-lg md:rounded-xl lg:rounded-2xl 
              shadow-lg sm:shadow-xl bg-white/95 backdrop-blur-md 
              border border-blue-100/80 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
              <div className="flex items-center justify-center gap-2 md:gap-3 w-full md:w-auto">
                <HiLocationMarker className="text-blue-600 w-6 h-6" />
                <Text
                  size="md"
                  fw={600}
                  className="text-gray-800 leading-tight text-xl text-center"
                >
                  Chọn vị trí trên bản đồ
                </Text>
              </div>
              <button
                onClick={onCancelSelection}
                className="w-full md:w-auto px-4 py-3 md:py-2.5 
                  bg-red-100 hover:bg-red-100 text-red-600 
                  rounded-lg text-base font-medium md:font-semibold
                  transition-all focus:outline-none focus:ring-2 
                  focus:ring-red-400 active:scale-98 touch-manipulation"
              >
                Hủy chọn
              </button>
            </div>
          </Paper>
        </div>
      )}

      <div ref={mapContainer} className="fixed inset-0 w-full h-full z-0" />
    </>
  );
}
