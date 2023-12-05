import prisma from "prisma/prisma";
import { readZonesByCampaign } from "../../elections/zones/service";
import {
  contrastingColor,
  generateRandomHexColor,
} from "@/app/(frontend)/_shared/utils/colors";

export async function createMapData(request) {
  const cityId = await prisma.campaign
    .findUnique({ where: { id: request.supporterSession.campaignId } })
    .then((campaign) => campaign!.cityId);

  if (!cityId) throw "City not found";

  const supporterGroup = await prisma.supporterGroupMembership.findFirst({
    where: { supporterId: request.supporterSession.id, isOwner: true },
  });

  const mapData = await prisma.address.findMany({
    where: { cityId },
    include: {
      Section: {
        include: {
          Zone: true,
          Supporter: {
            where: {
              supporterGroupsMemberships: {
                some: { supporterGroupId: supporterGroup.supporterGroupId },
              },
            },
          },
        },
      },
    },
  });

  const zones = await readZonesByCampaign(request.supporterSession.campaignId);
  const zonesInfo = [];
  for (const zone of zones) {
    zonesInfo.push(await readZoneGeoJSON(zone.id));
  }

  const neighborhoods = await prisma.neighborhood.findMany({
    where: { cityId },
  });
  for (const neighborhood of neighborhoods) {
    (neighborhood as any).color = generateRandomHexColor();
  }

  return { addresses: mapData, zonesInfo, neighborhoods };
}

export async function readZoneGeoJSON(zoneId: string) {
  const json = await prisma.zone.findFirst({
    where: { id: zoneId },
    include: { ZoneGeoJSON: { select: { geoJSON: true } } },
  });
  return { ...json, color: generateRandomHexColor() };
}
