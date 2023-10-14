import prisma from "../../../common/utils/prisma";

export async function findAddressBySection({
  sectionId,
}: {
  sectionId: string;
}) {
  return await prisma.address.findUnique({
    where: { id: sectionId },
    include: { City: true },
  });
}

export async function getStates() {
  return await prisma.state.findMany();
}

export async function getCities({
  stateId,
  idOnly,
}: {
  stateId: string;
  idOnly: boolean;
}) {
  return await prisma.city.findMany({
    where: { stateId: stateId },
    select: {
      id: true,
      name: true,
      zone: idOnly ? false : { select: { id: true, number: true, City: true } },
    },
  });
}

export async function getZones({
  cityId,
  stateId,
  zoneId,
}: {
  cityId?: string;
  stateId?: string;
  zoneId?: string;
}) {
  try {
    if (zoneId) {
      return await prisma.zone.findMany({ where: { id: zoneId } });
    }
    if (stateId) {
      const cities = (await getCities({ stateId, idOnly: true })).map(
        (city) => city.id
      );
      const zones = prisma.zone.findMany({
        where: { cityId: { in: cities } },
        orderBy: { number: "asc" },
      });
      return zones;
    }
    return await prisma.zone.findMany({
      where: { cityId: cityId },
      orderBy: { number: "asc" },
    });
  } catch (error) {
    console.log(error);
  }
}
