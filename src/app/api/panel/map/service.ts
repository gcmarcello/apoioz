import prisma from "prisma/prisma";

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
        },
      },
    },
  });
  return mapData;
}
