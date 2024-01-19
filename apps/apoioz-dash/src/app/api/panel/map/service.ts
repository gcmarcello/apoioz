import { prisma } from "prisma/prisma";
import { readZonesByCampaign } from "../../elections/zones/service";
import { SupporterSession } from "@/middleware/functions/supporterSession.middleware";
import { zoneWithoutGeoJSON } from "prisma/query/Zone";

export async function createMapData(request: {
  supporterSession: SupporterSession;
}) {
  const cityId = await prisma.campaign
    .findUnique({ where: { id: request.supporterSession.campaignId } })
    .then((campaign) => campaign!.cityId);

  if (!cityId) throw "City not found";

  const addresses = await prisma.address.findMany({
    where: { cityId },
    include: {
      Section: {
        include: {
          Zone: zoneWithoutGeoJSON,
          Supporter: {
            where: {
              supporterGroupsMemberships: {
                some: {
                  supporterGroup: {
                    ownerId: request.supporterSession.id,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const zones = await readZonesByCampaign(
    request.supporterSession.campaignId,
    true
  );

  const neighborhoods = await prisma.neighborhood.findMany({
    where: { cityId },
  });

  return { addresses, zones, neighborhoods };
}
