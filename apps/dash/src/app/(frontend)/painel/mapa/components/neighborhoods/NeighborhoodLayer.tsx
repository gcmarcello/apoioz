import L, { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import {
  MapAddressType,
  MapNeighborhoodType,
} from "../../providers/MapDataProvider";
import { useMapData } from "../../hooks/useMapData";
import { createClusterCustomIcon } from "../zones/ZoneLayer";
import { viewModeFilter } from "../../utils/viewModeFilter";

export const NeighborhoodLayer = ({ isVisible }: { isVisible: boolean }) => {
  const map = useMap();
  const {
    neighborhoods,
    addresses,
    selectedNeighborhood,
    selectedAddress,
    setSelectedNeighborhood,
    setSelectedAddress,
    addressViewMode,
  } = useMapData();
  const layersRef = useRef<L.LayerGroup>(L.layerGroup().addTo(map));

  useEffect(() => {
    layersRef.current.clearLayers();

    neighborhoods
      .filter((n) => n.checked)
      .forEach((neighborhood) => {
        const neighborhoodLayer = new L.GeoJSON(neighborhood.geoJSON, {
          style: {
            color:
              selectedNeighborhood?.id === neighborhood.id
                ? "#4f46e5"
                : neighborhood.color,
            weight: selectedNeighborhood?.id === neighborhood.id ? 10 : 3,
            fillOpacity:
              selectedNeighborhood?.id === neighborhood.id ? 0.5 : 0.2,
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
              a.neighborhood === neighborhood.name &&
              (selectedNeighborhood?.id === neighborhood.id ||
                !selectedNeighborhood)
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
              setSelectedNeighborhood(neighborhood);
              setSelectedAddress(address);
            });

            if (selectedNeighborhood) {
              layersRef.current.addLayer(marker);
            } else {
              supporterCluster.addLayer(marker);
            }
          });

        if (!selectedNeighborhood) layersRef.current.addLayer(supporterCluster);
        layersRef.current.addLayer(neighborhoodLayer);

        neighborhoodLayer.on("click", () => {
          if (selectedNeighborhood?.id === neighborhood.id) {
            setSelectedNeighborhood(null);
          } else {
            setSelectedNeighborhood(neighborhood);
            setSelectedAddress(null);
            if (!neighborhood?.geoJSON) return;
            const bounds = L.geoJSON(neighborhood.geoJSON).getBounds();
            map.flyToBounds(bounds, { maxZoom: 15 });
          }
        });
      });

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
    neighborhoods,
    isVisible,
    selectedNeighborhood,
    selectedAddress,
    addressViewMode,
  ]);

  return null; // No need to render anything, everything is handled in the effect
};
