import { SectionType } from "../../../common/types/locationTypes";
import prisma from "../../../common/utils/prisma";

export async function findSection({ sectionId }: { sectionId: string }) {
  return await prisma.section.findUnique({ where: { id: sectionId } });
}

export async function listSections({ sectionIds }: { sectionIds: string[] }) {
  return await prisma.section.findMany({ where: { id: { in: sectionIds } } });
}

export async function deleteSection({ sectionId }: { sectionId: string }) {
  return await prisma.section.delete({ where: { id: sectionId } });
}

export async function updateSections({ sectionId, sectionData }: { sectionId: string; sectionData: SectionType }) {
  return await prisma.section.update({ where: { id: sectionId }, data: sectionData });
}

export async function createSection({ sectionData }: { sectionData: SectionType }) {
  return await prisma.section.create({ data: sectionData });
}
