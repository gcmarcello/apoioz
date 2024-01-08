import { toProperCase } from "@/_shared/utils/format";
import { generateRandomHexColor } from "@/app/(frontend)/_shared/utils/colors";
import { RawMapData } from "../types/RawMapData";

export function parsedNeighborhoods(
  neighborhoods: RawMapData["neighborhoods"]
) {
  return neighborhoods
    .map((n) => ({
      ...n,
      label: toProperCase(n.name),
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
