"use server";
import prisma from "@/backend/prisma/prisma";
import { listUsers } from "@/backend/resources/users/users.service";
import { fakerPT_BR as faker } from "@faker-js/faker";
import dayjs from "dayjs";

export async function mockCampaign(userId?: string) {
  let user: any = null;

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
    userId: "83052d46-a866-4f77-bc4e-75711fe2b4a7",
    name: faker.person.fullName() + " " + date.format("YYYY"),
    type: "vereador",
    cityId: user.info.cityId,
    stateId: null,
    year: date.format("YYYY"),
  };
}
