"use server";
import prisma from "@/backend/prisma/prisma";

export async function getParties() {
  return await prisma.party.findMany({ orderBy: { id: "asc" } });
}
