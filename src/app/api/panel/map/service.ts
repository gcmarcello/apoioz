import { prisma } from "prisma/prisma";
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

  const mapData = await prisma.address.findMany({
    where: { cityId },
    include: {
      Section: {
        include: {
          Zone: { select: { id: true, number: true, stateId: true } },
          Supporter: {
            where: {
              SupporterGroup: {
                ownerId: request.supporterSession.id,
              },
            },
          },
        },
      },
    },
  });

  const zones = await readZonesByCampaign(request.supporterSession.campaignId, true);

  const neighborhoods = await prisma.neighborhood.findMany({
    where: { cityId },
  });

  return { addresses: mapData, zones, neighborhoods };
}
