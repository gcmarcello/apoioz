import { prisma } from "prisma/prisma";
import { readZonesByState } from "../zones/service";

export async function readSectionsByState(stateId: string) {
  const zones = await readZonesByState(stateId);
  const sections = await prisma.section.findMany({
    where: { zoneId: { in: zones.zones.map((zone) => zone.id) } },
  });
  return { state: zones.state, sections, count: sections.length };
}

export async function readSectionsByZone(zoneId?: string) {
  return await prisma.section.findMany({
    where: { zoneId },
    orderBy: { number: "asc" },
  });
}

export async function readSectionsByAddress(addressId: string) {
  const sections = await prisma.section.findMany({
    where: { addressId },
    orderBy: { number: "asc" },
    select: {
      Supporter: { select: { user: { select: { name: true } } } },
      number: true,
    },
  });
  return sections;
}

export async function readSectionsByCity(cityId: string) {
  const addresses = await prisma.address.findMany({
    where: { cityId },
    include: { City: true },
  });
  const sections = await prisma.section.findMany({
    where: { addressId: { in: addresses.map((address) => address.id) } },
    orderBy: { number: "asc" },
  });
  return {
    city: addresses[0]?.City,
    sections: sections,
    count: sections.length,
  };
}

export async function readSectionsByCampaign(campaignId: string) {
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
        (cityToZone) => cityToZone.Zone.Section
      );
    }
  } catch (error) {
    console.log(error);
  }
}
