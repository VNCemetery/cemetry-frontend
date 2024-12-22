import React, { useRef, useEffect } from "react";
import maplibregl, { Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function NewsPage() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const lng = 105.64556216797104;
  const lat = 10.462125648582175;
  const zoom = 17.3;

  const mapUrl = import.meta.env.VITE_MAPTILES_URL; // you need an account to get url from: https://account.goong.io/keys
  const mapKey = import.meta.env.VITE_MAPTILES_KEY; // you need an account to get key from: https://account.goong.io/keys

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `${mapUrl}goong_satellite.json?api_key=${mapKey}`,
      center: [lng, lat],
      zoom: zoom,
      bearing: 55,
    });
  }, [mapKey, lng, lat, zoom]);

  return (
    <>
      {/* <button
        onClick={() => {
          const geojson = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  coordinates: [
                    [105.645586380456, 10.461780290048],
                    [105.645312742233, 10.462365450839],
                  ],
                  type: "LineString",
                },
              },
            ],
          };

          // Remove existing path if it exists
          if (map.current.getSource("path")) {
            map.current.removeLayer("path-layer");
            map.current.removeSource("path");
          }
          // 'line-gradient' can only be used with GeoJSON sources
          // and the source must have the 'lineMetrics' option set to true
          map.current.addSource("line", {
            type: "geojson",
            lineMetrics: true,
            data: geojson,
          });

          // the layer must be of type 'line'
          map.current.addLayer({
            type: "line",
            source: "line",
            id: "line",
            paint: {
              "line-color": "#a3eb1e",
              "line-width": 5,
              // 'line-gradient' must be specified using an expression
              // with the special 'line-progress' property
            },
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
          });
        }}
        className="h-10 px-5 m-5 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
      >
        New marker
      </button> */}
      <div ref={mapContainer} className="absolute w-full h-screen" />
    </>
  );
}
