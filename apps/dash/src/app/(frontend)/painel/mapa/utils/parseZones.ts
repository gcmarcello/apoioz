"use client";
import { generateRandomHexColor } from "@/app/(frontend)/_shared/utils/colors";
import { Supporter, Zone } from "prisma/client";

export function parseZones(
  zones: (Zone & { supporters?: Supporter[] })[],
  topSupporters?: number
) {
  return zones
    ?.map((z) => ({
      ...z,
      geoJSON: z.geoJSON as any,
      label: z.number,
      color:
        topSupporters && z.supporters?.length
          ? geoJSONColor(z.supporters.length, topSupporters)
          : generateRandomHexColor([
              "#b2c29d",
              "#e9cbb0",
              "#f0eee4",
              "#f2f3f0",
            ]),
      checked: true,
    }))
    .sort((a: any, b: any) => a.label - b.label);
}

export function geoJSONColor(
  supportersNumber: number,
  topSupportersNumber: number
) {
  const red = "#ef4444";
  const green = "#22c55e";
  const yellow = "#facc15";
  if (supportersNumber < topSupportersNumber * 0.25) return red;
  if (supportersNumber < topSupportersNumber * 0.75) return yellow;
  if (supportersNumber >= topSupportersNumber * 0.75) return green;
  return generateRandomHexColor([red, yellow, green]);
}
