"use client";

import { FormProvider, useForm } from "react-hook-form";
import { ReactNode } from "react";
import { Neighborhood, Zone, Address, Prisma } from "@prisma/client";
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
  const form = useForm<MapContextProps>({
    defaultValues: {
      neighborhoods: parsedNeighborhoods(value.neighborhoods),
      zones: parseZones(value.zones),
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
