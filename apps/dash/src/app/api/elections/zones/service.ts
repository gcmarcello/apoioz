import { prisma } from "prisma/prisma";
import { zoneWithoutGeoJSON } from "prisma/query/Zone";

export async function readZonesByCampaign(
  campaignId: string,
  withGeoJSON = false
) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      city: {
        include: {
          City_To_Zone: {
            include: {
              Zone: withGeoJSON || zoneWithoutGeoJSON,
            },
          },
        },
      },
    },
  });

  return (
    campaign?.city?.City_To_Zone.flatMap((cityToZone) => cityToZone.Zone) ?? []
  );
}

export async function readZonesByCity(cityId: string) {
  const selectedZones = await prisma.city_To_Zone.findMany({
    where: { cityId },
    select: { City: true, Zone: zoneWithoutGeoJSON },
    orderBy: { Zone: { number: "asc" } },
  });
  return {
    city: selectedZones[0]?.City,
    zones: selectedZones.flatMap((zone) => zone.Zone),
    count: selectedZones.flatMap((zone) => zone.Zone).length,
  };
}

export async function readZonesByState(stateId: string) {
  const selectedZones = await prisma.zone.findMany({
    where: { stateId },
    select: { id: true, number: true, stateId: true, State: true },
  });
  return {
    state: selectedZones[0]?.State,
    zones: selectedZones.map((zone) => ({ id: zone.id, number: zone.number })),
    count: selectedZones.map((zone) => ({ id: zone.id, number: zone.number }))
      .length,
  };
}
