"use server";

import prisma from "prisma/prisma";

export async function readParties() {
  return await prisma.party.findMany({ orderBy: { id: "asc" } });
}
