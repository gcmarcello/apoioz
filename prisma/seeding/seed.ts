import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { promises as fs } from "fs";

async function main() {}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
