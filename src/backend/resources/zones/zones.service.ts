"use server";

import prisma from "@/backend/prisma/prisma";

export async function getZonesByCampaign(campaignId: string) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        city: {
          include: {
            City_To_Zone: { include: { Zone: { include: { Section: true } } } },
          },
        },
      },
    });

    if (campaign?.city) {
      return campaign.city.City_To_Zone.flatMap(
        (cityToZone) => cityToZone.Zone
      );
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getZonesByCity(cityId: string) {
  const selectedZones = await prisma.city_To_Zone.findMany({
    where: { cityId },
    select: { City: true, Zone: true },
    orderBy: { Zone: { number: "asc" } },
  });
  return {
    city: selectedZones[0].City,
    zones: selectedZones.flatMap((zone) => zone.Zone),
    count: selectedZones.flatMap((zone) => zone.Zone).length,
  };
}

export async function getZonesByState(stateId: string) {
  const selectedZones = await prisma.zone.findMany({
    where: { stateId },
    include: { State: true },
  });
  return {
    state: selectedZones[0].State,
    zones: selectedZones.map((zone) => ({ id: zone.id, number: zone.number })),
    count: selectedZones.map((zone) => ({ id: zone.id, number: zone.number }))
      .length,
  };
}
