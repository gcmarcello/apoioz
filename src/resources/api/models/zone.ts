import { ZoneType } from "../../../common/types/locationTypes";
import prisma from "../../../common/utils/prisma";

export async function findZone({ zoneId }: { zoneId: string }) {
  return await prisma.zone.findUnique({ where: { id: zoneId } });
}

export async function listZones({ zoneIds }: { zoneIds: string[] }) {
  return await prisma.zone.findMany({ where: { id: { in: zoneIds } } });
}

export async function deleteZone({ zoneId }: { zoneId: string }) {
  return await prisma.zone.delete({ where: { id: zoneId } });
}

export async function updateZones({ zoneId, zoneData }: { zoneId: string; zoneData: ZoneType }) {
  return await prisma.zone.update({ where: { id: zoneId }, data: zoneData });
}

export async function createZone({ zoneData }: { zoneData: ZoneType }) {
  return await prisma.zone.create({ data: zoneData });
}
