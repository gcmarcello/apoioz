import { CityType } from "../../../common/types/locationTypes";
import prisma from "../../../common/utils/prisma";

export async function findCity({ cityId }: { cityId: string }) {
  return await prisma.city.findUnique({ where: { id: cityId } });
}

export async function listCities({ cityIds }: { cityIds: string[] }) {
  return await prisma.city.findMany({ where: { id: { in: cityIds } } });
}

export async function deleteCity({ cityId }: { cityId: string }) {
  return await prisma.city.delete({ where: { id: cityId } });
}

export async function updateCities({ cityId, cityData }: { cityId: string; cityData: CityType }) {
  return await prisma.city.update({ where: { id: cityId }, data: cityData });
}

export async function createCity({ cityData }: { cityData: CityType }) {
  return await prisma.city.create({ data: cityData });
}
