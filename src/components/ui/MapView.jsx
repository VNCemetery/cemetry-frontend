import React, { useRef, useEffect } from "react";
import maplibregl, { Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function NewsPage() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const lng = 105.644921898426;
  const lat = 10.461701682269;
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

  function displayRoute(route, startCoords, endCoords, distance, time) {
    if (map.current.getSource("route")) {
      map.current.removeLayer("route");
      map.current.removeSource("route");
    }
    map.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: route,
        },
      },
    });
    map.current.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#3887be",
        "line-width": 5,
        "line-opacity": 0.9,
      },
    });
  }

  return (
    <>
      <button
        className="bg-red-200 z-[10000] absolute hidden"
        onClick={async () => {
          // Paris [lng, lat]
          const start = [105.644921898426, 10.46170169];
          // Marseille [lng, lat]
          const end = [105.645425424665, 10.4617956417];
          // ADD MARKER

          // Format the coordinates for OSRM
          const coordinates = `${start.join()};${end.join()}`; // '2.3522,48.8566;5.3698,43.2965'

          let accessToken =
            "jywDIALYOUSbDYQB3lkthZfebwwxMjACvnzhzyKYEDXhXTC1Dzd5oswfSULe6pOs";
          // Get the fastest route.
          // See https://www.jawg.io/docs/apidocs/routing/osrm for more information about the request parameters and response format.
          const response = await fetch(
            `https://api.jawg.io/routing/route/v1/car/${coordinates}?alternatives=false&geometries=geojson&overview=full&access-token=${accessToken}`
          ).then((response) => response.json());
          map.current.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: [
                  [105.644921898426, 10.461701682269],
                  [105.644817428754, 10.461912344452],
                  [105.644869525181, 10.461915612591],
                  [105.645051707477, 10.461528920793],
                  [105.645081431843, 10.461570329746],
                  [105.644979182676, 10.461739198497],
                  [105.645034002399, 10.461771589942],
                  [105.645141562873, 10.461658136487],
                  [105.645258258101, 10.461624368727],
                  [105.64536653885, 10.461670005967],
                  [105.645471779795, 10.461750267266],
                  [105.645551346649, 10.461829806506],
                  [105.645636475968, 10.461922796616],
                  [105.64572297224, 10.461937991319],
                  [105.6457565955, 10.461948371688],
                  [105.645807819165, 10.461997611468],
                  [105.645807160519, 10.462100618618],
                  [105.645833282727, 10.46227664768],
                  [105.645681365712, 10.462303627085],
                  [105.645600299392, 10.462350593077],
                  [105.645517045157, 10.462334603328],
                  [105.645480799199, 10.462307088129],
                  [105.645436472374, 10.462244305634],
                  [105.645311313702, 10.462212958079],
                  [105.645208507447, 10.462181627715],
                  [105.645095571107, 10.462124299593],
                  [105.64500114843, 10.462039913142],
                  [105.644976933694, 10.461924478129],
                  [105.645094633008, 10.461810218109],
                  [105.645184953444, 10.461724316039],
                  [105.645277737968, 10.461699655412],
                  [105.645358082225, 10.461721950086],
                  [105.645425424665, 10.461770956417],
                  [105.645482589893, 10.461821334662],
                  [105.645535781908, 10.461873084245],
                  [105.645572243645, 10.461920653877],
                  [105.64540628969, 10.462196960785],
                  [105.645348614943, 10.462185786422],
                  [105.645265785094, 10.462164925109],
                  [105.645202798079, 10.462131937153],
                  [105.645133672541, 10.462095020777],
                  [105.645070959782, 10.462016870234],
                  [105.64506275507, 10.461920784301],
                  [105.64557510667, 10.462182833008],
                  [105.645572682112, 10.462074314052],
                  [105.645670516699, 10.462037132343],
                  [105.645586380456, 10.461783050551],
                  [105.645622290328, 10.461780290048],
                  [105.645663921221, 10.46178006858],
                  [105.64569717556, 10.461743968574],
                  [105.645684498172, 10.461671062366],
                  [105.645666819571, 10.461633445954],
                  [105.645645609988, 10.46160502147],
                  [105.645643632396, 10.461581808877],
                  [105.64561719331, 10.461581566346],
                ],
              },
            },
          });
          map.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#13BBFA",
              "line-width": [
                "interpolate",
                ["exponential", 1.5],
                ["zoom"],
                5,
                1, // Adjusted from 3 to 1 for thinner line
                18,
                4, // Adjusted from 8 to 4 for thinner line
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
                2, // Adjusted from 2 to 1.5 for better fit
                18,
                3, // Adjusted from 3 to 2.5 for better fit
              ],
              "line-color": "#4D93E3",
              "line-gap-width": [
                "interpolate",
                ["exponential", 1.5],
                ["zoom"],
                5,
                0.5, // Adjusted from 3 to 0.5 for better fit
                18,
                1.5, // Adjusted from 8 to 1.5 for better fit
              ],
            },
            // Add the layer before the first label layer e.g. "road-shield"
          });

          map.current.addLayer({
            id: "route-start",
            type: "circle",
            source: {
              type: "geojson",
              data: {
                type: "MultiPoint",
                coordinates: [
                  [105.644921898426, 10.461701682269],
                  [105.64561719331, 10.461581566346],
                ],
              },
            },
            paint: {
              "circle-radius": [
                "interpolate",
                ["exponential", 1.5],
                ["zoom"],
                5,
                4,
                16,
                6,
              ],
              "circle-color": "#13BBFA",
              "circle-stroke-width": 3,
              "circle-stroke-color": "#4D93E3",
            },
            // Add the layer before the first label layer e.g. "road-shield"
          });
        }}
      >
        New marker
      </button>
      <div ref={mapContainer} className="absolute w-full h-screen" />
    </>
  );
}

// export default function NewsPage() {
//   return <>HELLO</>;
// }
