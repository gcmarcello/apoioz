"use client";
import { toProperCase } from "@/_shared/utils/format";
import { generateRandomHexColor } from "@/app/(frontend)/_shared/utils/colors";
import { Neighborhood, Supporter } from "prisma/client";

export function parsedNeighborhoods(
  neighborhoods: (Neighborhood & { supporters?: Supporter[] })[],
  topSupporters?: number
) {
  return neighborhoods
    .map((n) => ({
      ...n,
      geoJSON: n.geoJSON as any,
      label: toProperCase(n.name),
      color:
        topSupporters && n.supporters
          ? geoJSONColor(n.supporters.length, topSupporters)
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
