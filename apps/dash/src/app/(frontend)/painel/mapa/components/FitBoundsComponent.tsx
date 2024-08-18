import { useEffect, useState } from "react";
import {
  MapAddressType,
  MapNeighborhoodType,
  MapZoneType,
} from "../providers/MapDataProvider";
import { retrieveBoundsFromGeoJSONS } from "../utils/coordinates";
import { useMap } from "react-leaflet";
import { useMapData } from "../hooks/useMapData";
import { LatLngBounds } from "leaflet";

export function FitBoundsComponent({
  mapRef,
  neighborhoods,
  zones,
  addresses,
}: {
  mapRef: React.MutableRefObject<any>;
  neighborhoods: MapNeighborhoodType[];
  zones: MapZoneType[];
  addresses: MapAddressType[];
}) {
  const [wasFitted, setWasFitted] = useState(false);
  const { setMapBound } = useMapData();

  const map = useMap();

  useEffect(() => {
    if (wasFitted) return;
    setWasFitted(true);
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = map;
    }

    const markerCoords = addresses?.map(({ geocode }) => geocode);
    let geoJSONBounds: L.LatLngBounds | null = null;

    if (neighborhoods.filter((neighborhood) => neighborhood.checked).length) {
      geoJSONBounds = retrieveBoundsFromGeoJSONS(
        neighborhoods
          .filter((neighborhood) => neighborhood.checked)
          .map((neighborhood) => neighborhood.geoJSON)
      );
    } else if (zones.filter((zone) => zone.checked).length) {
      geoJSONBounds = retrieveBoundsFromGeoJSONS(
        zones.filter((zone) => zone.checked).map((zone) => zone.geoJSON)
      );
    }

    const mapBounds = (!wasFitted && markerCoords) || geoJSONBounds;

    setMapBound(mapBounds as LatLngBounds);

    if (!mapBounds) return;

    map.fitBounds(mapBounds as any);
  }, [map]);

  return null;
}
