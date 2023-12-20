import { hashInfo } from "@/_shared/utils/bCrypt";
import { compareEnv } from "@/_shared/utils/settings";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma! ?? prismaClientSingleton()!;

globalThis.prisma = prisma;
