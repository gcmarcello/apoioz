import L, { LatLngExpression, MarkerCluster } from "leaflet";
import "leaflet.markercluster"; // Import the marker cluster plugin
import "leaflet.markercluster/dist/MarkerCluster.css";
import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import { useMapData } from "../../hooks/useMapData";
import { viewModeFilter } from "../../utils/viewModeFilter";
import { add } from "lodash";

export const createClusterCustomIcon = function (cluster: MarkerCluster) {
  const supporterCount = cluster.getAllChildMarkers();

  return L.divIcon({
    html: `<div class="relative text-white font-bold flex justify-center items-center w-12 h-12">
    <div class="bg-${"gray"}-400 absolute rounded-full opacity-70 h-10 w-10"></div>
    <div class="bg-${"gray"}-500 flex justify-center items-center rounded-full h-8 w-8 z-10">
        ${supporterCount.length}
    </div>
    </div>`,
    className: "custom-marker-cluster",
    iconSize: L.point(44, 44, true),
  });
};

export const ZoneLayer = ({ isVisible }: { isVisible: boolean }) => {
  const map = useMap();
  const {
    zones,
    setSelectedZone,
    selectedZone,
    addresses,
    setSelectedAddress,
    selectedAddress,
    addressViewMode,
  } = useMapData();
  const layersRef = useRef<L.LayerGroup>(L.layerGroup().addTo(map));

  useEffect(() => {
    // Clear previous layers
    layersRef.current.clearLayers();

    zones
      .filter((z) => z.checked)
      .forEach((zone) => {
        const zoneLayer = new L.GeoJSON(zone.geoJSON, {
          style: {
            color: selectedZone?.id === zone.id ? "#4f46e5" : zone.color,
            weight: selectedZone?.id === zone.id ? 10 : 3,
            fillOpacity: selectedZone?.id === zone.id ? 0.5 : 0.2,
          },
        });

        const supporterCluster = L.markerClusterGroup({
          iconCreateFunction: createClusterCustomIcon,
          showCoverageOnHover: false,
          animateAddingMarkers: true,
          spiderfyOnMaxZoom: true,
          zoomToBoundsOnClick: true,
          animate: true,
          chunkedLoading: true,
          maxClusterRadius: 40, // Same here
        });

        const viewModeAddressFilter = addresses.filter(
          viewModeFilter(addressViewMode)
        );

        viewModeAddressFilter
          .filter(
            (a) =>
              a.zoneId === zone.id &&
              (selectedZone?.id === zone.id || !selectedZone)
          )
          .forEach((address) => {
            const supporterCount = address.supportersCount;
            const marker = L.marker(address.geocode as LatLngExpression, {
              icon: L.divIcon({
                html: `<div class="relative h-14 w-14"><img src="${
                  supporterCount ? "/urnagreen.png" : "/urnared.png"
                }" alt="placeholder" class="h-14 w-14"/><div class="absolute top-4 left-0 right-0 bottom-0 flex items-center justify-center font-bold text-white">${supporterCount}</div></div>`,
                className: "custom-marker-cluster",
                iconSize: L.point(44, 44, true),
              }),
            });

            marker.on("click", () => {
              map.flyTo(address.geocode as LatLngExpression, 15);
              setSelectedZone(zone);
              setSelectedAddress(address);
            });

            if (selectedZone) {
              layersRef.current.addLayer(marker);
            } else {
              supporterCluster.addLayer(marker);
            }
          });

        if (!selectedZone) {
          layersRef.current.addLayer(supporterCluster);
        }
        layersRef.current.addLayer(zoneLayer);

        zoneLayer.on("click", () => {
          if (selectedZone?.id === zone.id) {
            setSelectedZone(null);
          } else setSelectedZone(zone);
          setSelectedAddress(null);
        });
      });

    // Manage visibility
    if (isVisible) {
      map.addLayer(layersRef.current);
    } else {
      map.removeLayer(layersRef.current);
    }

    return () => {
      map.removeLayer(layersRef.current); // Clean up on unmount
    };
  }, [
    map,
    zones,
    isVisible,
    selectedZone,
    addresses,
    addressViewMode,
    selectedAddress,
  ]);

  return null; // No need to render anything, everything is handled in the effects
};
