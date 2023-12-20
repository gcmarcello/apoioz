"use client";

import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toProperCase } from "@/_shared/utils/format";
import { generateRandomHexColor } from "@/app/(frontend)/_shared/utils/colors";
import { ExtractSuccessResponse } from "@/app/api/_shared/utils/ActionResponse";
import { createMapData } from "@/app/api/panel/map/actions";

export default function MapDataProvider({
  children,
  value: { zones, neighborhoods, addresses },
}: {
  children: any;
  value: ExtractSuccessResponse<typeof createMapData>;
}) {
  const parsedNeighborhoods = neighborhoods
    .map((n) => ({
      ...n,
      label: toProperCase(n.name),
      color: generateRandomHexColor(),
      checked: false,
    }))
    .sort((a: any, b: any) => a.label - b.label);

  const parsedZones = zones!
    .map((z) => ({
      ...z,
      label: z.number,
      color: generateRandomHexColor(),
      checked: false,
    }))
    .sort((a: any, b: any) => a.label - b.label);

  const parsedAddresses = addresses.map((a) => {
    const sectionsCount = a.Section.length;
    const supportersCount = a.Section.reduce((accumulator, section) => {
      return accumulator + section.Supporter.length;
    }, 0);
    return {
      address: a.address,
      geocode: [Number(a.lat), Number(a.lng)],
      location: a.location,
      neighborhood: a.neighborhood,
      zone: a.Section[0].Zone.number,
      sectionsCount,
      supportersCount,
      id: a.id,
    };
  });

  const mapData = useForm({
    defaultValues: {
      addresses: parsedAddresses,
      zones: parsedZones,
      neighborhoods: parsedNeighborhoods,
      sections: {
        showEmptySections: false,
      },
    },
    mode: "onChange",
  });

  return <FormProvider {...mapData}>{children}</FormProvider>;
}
