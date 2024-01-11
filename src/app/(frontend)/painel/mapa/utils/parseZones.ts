import { generateRandomHexColor } from "@/app/(frontend)/_shared/utils/colors";
import { RawMapData } from "../types/RawMapData";

export function parseZones(zones: RawMapData["zones"]) {
  return zones!
    .map((z) => ({
      ...z,
      label: z.number,
      color: generateRandomHexColor([
        "#b2c29d",
        "#e9cbb0",
        "#f0eee4",
        "#f2f3f0",
      ]),
      checked: false,
    }))
    .sort((a: any, b: any) => a.label - b.label);
}
