"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { Neighborhood, Supporter, Zone } from "prisma/client";
import { parsedNeighborhoods } from "../utils/parseNeighborhoods";
import { parseZones } from "../utils/parseZones";
import { parseAddresses } from "../utils/parseAddresses";
import { RawMapData } from "../types/RawMapData";
import { SupporterSession } from "@/middleware/functions/supporterSession.middleware";

export type MapNeighborhoodType = {
  label: string | undefined;
  color: string;
  checked: boolean;
  id: string;
  name: string;
  cityId: string;
  geoJSON: GeoJSON.GeoJsonObject;
};

export type MapZoneType = {
  label: number;
  color: string;
  checked: boolean;
  number: number;
  id: string;
  stateId: string;
  geoJSON: GeoJSON.GeoJsonObject;
};

export type MapAddressType = {
  address: string | null;
  geocode: number[];
  location: string | null;
  neighborhood: string | null;
  zoneId: string;
  sectionsCount: number;
  supportersCount: number;
  id: string;
};

export class MapContextProps {
  neighborhoods: MapNeighborhoodType[];
  setNeighborhoods: Dispatch<SetStateAction<MapNeighborhoodType[]>>;
  zones: MapZoneType[];
  setZones: Dispatch<SetStateAction<MapZoneType[]>>;
  selectedZone: MapZoneType | null;
  setSelectedZone: Dispatch<SetStateAction<MapZoneType | null>>;
  selectedNeighborhood: MapNeighborhoodType | null;
  setSelectedNeighborhood: Dispatch<SetStateAction<MapNeighborhoodType | null>>;
  selectedAddress: MapAddressType | null;
  setSelectedAddress: Dispatch<SetStateAction<MapAddressType | null>>;
  addresses: MapAddressType[];
  supporterSession: SupporterSession;
  neighborhoodsWithSupporters: (Neighborhood & { supporters: Supporter[] })[];
  zonesWithSupporters: (Zone & { supporters: Supporter[] })[];
  supportersTopNeighborhood?: Neighborhood & { supporters: Supporter[] };
  supportersTopZone?: Zone & { supporters: Supporter[] };
  setViewMode: Dispatch<SetStateAction<"neighborhood" | "zone">>;
  viewMode: "neighborhood" | "zone";
  addressViewMode: "all" | "some" | "empty";
  setAddressViewMode: Dispatch<SetStateAction<"all" | "some" | "empty">>;
  setMapBound: Dispatch<SetStateAction<L.LatLngBounds | null>>;
  mapBound: L.LatLngBounds | null;
}

export const MapContext = createContext<MapContextProps>(new MapContextProps());

export default function MapDataProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: RawMapData;
}) {
  const [viewMode, setViewMode] = useState<"neighborhood" | "zone">("zone");
  const [selectedZone, setSelectedZone] = useState<MapZoneType | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<MapNeighborhoodType | null>(null);

  const neighborhoodsWithSupporters = useMemo(() => {
    return value.neighborhoods.map((n) => ({
      ...n,
      supporters: value.addresses
        .filter((a) => a.neighborhood === n.name)
        .flatMap((a) => a.Supporter),
    }));
  }, [value.neighborhoods, value.addresses]);

  const zonesWithSupporters = useMemo(() => {
    return value.zones.map((z) => {
      const zoneAddresses = value.addresses.filter(
        (a) => a.Supporter[0]?.zoneId === z.id
      );
      return {
        ...z,
        supporters: zoneAddresses.flatMap((a) => a.Supporter),
      };
    });
  }, [value.zones, value.addresses]);

  const supportersTopNeighborhood = useMemo(() => {
    return neighborhoodsWithSupporters.sort(
      (a, b) => b.supporters.length - a.supporters.length
    )[0];
  }, [neighborhoodsWithSupporters]);

  const supportersTopZone = useMemo(() => {
    return zonesWithSupporters.sort(
      (a, b) => b.supporters.length - a.supporters.length
    )[0];
  }, [zonesWithSupporters]);

  const [zones, setZones] = useState<MapZoneType[]>(
    parseZones(zonesWithSupporters, supportersTopZone?.supporters.length)
  );
  const [neighborhoods, setNeighborhoods] = useState<MapNeighborhoodType[]>(
    parsedNeighborhoods(
      neighborhoodsWithSupporters,
      supportersTopNeighborhood?.supporters.length
    )
  );
  const [addresses, setAddresses] = useState<MapAddressType[]>(
    parseAddresses(value.addresses)
  );

  const [selectedAddress, setSelectedAddress] = useState<MapAddressType | null>(
    null
  );

  const [mapBound, setMapBound] = useState<L.LatLngBounds | null>(null);

  const [addressViewMode, setAddressViewMode] = useState<
    "all" | "some" | "empty"
  >("all");

  return (
    <MapContext.Provider
      value={{
        viewMode,
        selectedZone,
        setSelectedZone,
        selectedNeighborhood,
        setSelectedNeighborhood,
        selectedAddress,
        setSelectedAddress,
        setViewMode,
        addressViewMode,
        setAddressViewMode,
        setMapBound,
        mapBound,
        addresses,
        zones,
        setZones,
        neighborhoods,
        setNeighborhoods,
        neighborhoodsWithSupporters,
        zonesWithSupporters,
        supportersTopNeighborhood: supportersTopNeighborhood,
        supportersTopZone: supportersTopZone,
        supporterSession: value.supporterSession,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
