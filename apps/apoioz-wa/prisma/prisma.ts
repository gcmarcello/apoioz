/* eslint-disable no-var */
import { PrismaClient } from "./client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var waPrisma: ReturnType<typeof prismaClientSingleton>;
}

export const waPrisma = globalThis.prisma! ?? prismaClientSingleton()!;

globalThis.waPrisma = waPrisma;
