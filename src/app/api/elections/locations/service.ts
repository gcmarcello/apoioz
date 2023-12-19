import prisma from "prisma/prisma";

export async function readAddressBySection(sectionId: string) {
  return await prisma.address.findFirst({
    where: { Section: { some: { id: sectionId } } },
    include: { City: true },
  });
}

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

export async function readAddressesByCampaign(campaignId: string) {
  const cityId = await prisma.campaign
    .findUnique({ where: { id: campaignId } })
    .then((campaign) => campaign!.cityId);

  if (!cityId) throw new Error("City not found");

  return await prisma.address.findMany({
    where: { cityId },
  });
}

export async function readNeighborhoodsByCampaign(campaignId: string) {
  const checkForCampaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  });

  if (checkForCampaign.cityId === null)
    throw "Busca de bairros só é permitida para redes de apoio municipais.";

  return await prisma.neighborhood.findMany({
    where: { cityId: checkForCampaign.cityId },
  });
}
