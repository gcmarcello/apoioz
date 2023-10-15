"use server";
import prisma from "@/backend/prisma/prisma";
import {
  getCampaign,
  listSupporters,
} from "@/backend/resources/campaign/campaign.service";
import { listUsers } from "@/backend/resources/users/users.service";
import { getZonesByCampaign } from "@/backend/resources/zones/zones.service";
import { fakerPT_BR as faker } from "@faker-js/faker";
import dayjs from "dayjs";

export async function mockCampaign(userId?: string) {
  let user: any;

  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: { info: true },
    });
  } else {
    const users = await listUsers();
    if (users) user = users[Math.floor(Math.random() * users.length)];
  }

  const date = dayjs(faker.date.soon({ days: Math.ceil(Math.random() * 30) }));

  return {
    userId: user?.id || "11362aaa-def8-487c-8bfe-a7905cb8c20b",
    name: faker.person.fullName() + " " + date.format("YYYY"),
    type: "vereador",
    cityId: user.info.cityId,
    stateId: null,
    year: date.format("YYYY"),
  };
}
