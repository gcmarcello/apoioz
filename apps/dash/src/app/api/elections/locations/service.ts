import { SupporterSession } from "@/middleware/functions/supporterSession.middleware";
import { fullTextSearch } from "odinkit";
import { prisma } from "prisma/prisma";
import { ReadAddressDto } from "./dto";

export async function readStates() {
  return await prisma.state.findMany({ orderBy: { name: "asc" } });
}

export async function readCitiesByState(stateId: string) {
  return await prisma.city.findMany({
    where: { stateId: stateId },
    select: {
      id: true,
      name: true,
    },
  });
}

export async function readAddressFulltext(
  request: ReadAddressDto & {
    supporterSession: SupporterSession;
  }
) {
  const city = await prisma.city.findFirst({
    where: { Campaign: { some: { id: request.supporterSession.campaignId } } },
  });

  if (!city) throw "City not found";

  const searchQuery = request.where?.location
    ? `'${request.where?.location}':*`
    : "";

  const query = await fullTextSearch({
    table: ["elections", "Address"],
    tableAlias: "a",
    where: [`a."cityId" = '${city.id}'`],
    searchField: ["a", "location"],
    orderBy: ["a", "id"],
  });

  const locations = await prisma.$queryRawUnsafe<any[]>(query, searchQuery, 10);

  return locations;
}

export async function readAddresses(
  data: ReadAddressDto & {
    supporterSession: SupporterSession;
  }
) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: data.supporterSession.campaignId },
  });

  return await prisma.address.findMany({
    where: { location: data.where?.location, cityId: campaign?.cityId! }, //@todo states
    take: data.pagination?.take || 10,
    skip: data.pagination?.skip || 0,
  });
}

export async function readNeighborhoodsByCampaign(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) throw "Campanha não encontrada.";

  if (campaign.cityId === null)
    throw "A busca de bairros só é permitida para campanhas municipais.";

  return await prisma.neighborhood.findMany({
    where: { cityId: campaign.cityId },
  });
}
