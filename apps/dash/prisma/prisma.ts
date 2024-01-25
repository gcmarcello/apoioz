/* eslint-disable no-var */
import { PrismaClient } from "./client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma! ?? prismaClientSingleton()!;

globalThis.prisma = prisma;
