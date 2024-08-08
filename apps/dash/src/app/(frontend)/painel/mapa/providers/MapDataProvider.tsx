"use client";

import { FormProvider, useForm } from "react-hook-form";
import { ReactNode, useMemo } from "react";
import { Prisma } from "prisma/client";
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
  geoJSON: Prisma.JsonValue;
};

export type MapZoneType = {
  label: number;
  color: string;
  checked: boolean;
  number: number;
  id: string;
  stateId: string;
  geoJSON: Prisma.JsonValue;
};

export type MapAddressType = {
  address: string | null;
  geocode: number[];
  location: string | null;
  neighborhood: string | null;
  zone: number;
  sectionsCount: number;
  supportersCount: number;
  id: string;
};

export type MapContextProps = {
  neighborhoods: MapNeighborhoodType[];
  zones: MapZoneType[];
  addresses: MapAddressType[];
  sections: {
    showEmptySections: boolean;
  };
  supporterSession: SupporterSession;
};

export default function MapDataProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: RawMapData;
}) {
  if (!value.zones || !window) return null;
  const neighborhoodWithSupporters = useMemo(
    () =>
      value.neighborhoods.map((n) => ({
        ...n,
        supporters: value.addresses
          .filter((a) => a.neighborhood === n.name)
          .flatMap((a) => a.Supporter),
      })),
    []
  );

  const zonesWithSupporters = useMemo(
    () =>
      value.zones.map((z) => {
        const zoneAddresses = value.addresses.filter(
          (a) => a.Supporter[0]?.zoneId === z.id
        );
        return {
          ...z,
          supporters: zoneAddresses.flatMap((a) => a.Supporter),
        };
      }),
    []
  );

  const supportersTopNeighborhood = useMemo(
    () =>
      neighborhoodWithSupporters?.sort(
        (a, b) => b.supporters.length - a.supporters.length
      )[0],
    []
  );

  const supportersTopZone = useMemo(
    () =>
      zonesWithSupporters?.sort(
        (a, b) => b.supporters.length - a.supporters.length
      )[0],
    []
  );

  const form = useForm<MapContextProps>({
    defaultValues: {
      neighborhoods: parsedNeighborhoods(
        neighborhoodWithSupporters,
        supportersTopNeighborhood?.supporters.length
      ),
      zones: parseZones(
        zonesWithSupporters,
        supportersTopZone?.supporters.length
      ),
      addresses: parseAddresses(value.addresses),
      supporterSession: value.supporterSession,
      sections: {
        showEmptySections: false,
      },
    },
    mode: "onChange",
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}
