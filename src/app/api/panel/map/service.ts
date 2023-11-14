import prisma from "prisma/prisma";
import { getZonesByCampaign } from "../../elections/zones/service";
import {
  contrastingColor,
  generateRandomHexColor,
} from "@/app/(frontend)/_shared/utils/colors";

export async function generateMapData(campaignId: string) {
  const cityId = await prisma.campaign
    .findUnique({ where: { id: campaignId } })
    .then((campaign) => campaign!.cityId);

  if (!cityId) throw new Error("City not found");

  const mapData = await prisma.address.findMany({
    where: { cityId },
    include: {
      Section: {
        include: {
          Supporter: true,
          Zone: true,
        },
      },
    },
  });
  const zones = await getZonesByCampaign(campaignId);
  const zonesInfo = [];
  for (const zone of zones) {
    zonesInfo.push(await fetchZoneGeoJSON(zone.id));
  }

  const neighborhoods = await prisma.neighborhoods.findMany({
    where: { cityId },
  });

  return { addresses: mapData, zonesInfo, neighborhoods };
}

export async function fetchZoneGeoJSON(zoneId: string) {
  const json = await prisma.zone.findFirst({
    where: { id: zoneId },
    include: { ZoneGeoJSON: { select: { geoJSON: true } } },
  });
  return { ...json, color: generateRandomHexColor() };
}
