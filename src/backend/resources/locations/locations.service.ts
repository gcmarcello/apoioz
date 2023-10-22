"use server";
import prisma from "@/backend/prisma/prisma";

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
  return await prisma.state.findMany({ orderBy: { name: "asc" } });
}

export async function getCities({ stateId }: { stateId: string }) {
  return await prisma.city.findMany({
    where: { stateId: stateId },
    select: {
      id: true,
      name: true,
    },
  });
}
