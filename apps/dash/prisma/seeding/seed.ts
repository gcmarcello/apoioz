import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { hashInfo } from "odinkit/server";
const prisma = new PrismaClient();

async function main() {}

main()
  .then(async () => {
    const userId = crypto.randomUUID();
    const supporterId = crypto.randomUUID();

    await prisma.user.create({
      data: {
        id: userId,
        role: "admin",
        email: "fernando@gmail.com",
        password: await hashInfo("123456"),
        name: "Fernando",
        info: {
          create: {
            birthDate: dayjs("09-17-2004", "DD/MM/YYYY").toISOString(),
            sectionId: "83ee5839-84d3-4dd4-9c17-33531fcf3cbc",
            zoneId: "fabf3f3e-b83a-4542-84f8-f5b2ab733251",
          },
        },
        campaign: {
          create: {
            name: "Campanha 1",
            slug: "campanha-1",
            type: "vereador",
            year: "2024",
            cityId: "3548500",
            supporters: {
              create: {
                id: supporterId,
                userId: userId,
                level: 4,
                sectionId: "83ee5839-84d3-4dd4-9c17-33531fcf3cbc",
                zoneId: "fabf3f3e-b83a-4542-84f8-f5b2ab733251",
                SupporterGroup: {
                  create: {
                    memberships: {
                      create: {
                        supporterId: supporterId,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
