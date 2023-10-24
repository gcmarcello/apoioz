"use server";
import { listSupporters } from "@/backend/resources/supporters/supporters.actions";
import { fakerPT_BR as faker } from "@faker-js/faker";
import dayjs from "dayjs";

export async function mockEvent(campaignId: string) {
  const supporters = await listSupporters({
    pagination: { pageIndex: 0, pageSize: 500 },
  });

  const date = dayjs(faker.date.soon({ days: Math.ceil(Math.random() * 30) }));

  return {
    name: "Encontro de Apoiadores " + faker.location.county(),
    campaignId: campaignId,
    dateStart: date.toISOString(),
    dateEnd: date.add(2, "hour").toISOString(),
    description: faker.lorem.paragraph(),
    location: faker.location.streetAddress(),
    status: "pending",
    hostId: supporters?.supporters.filter((supporter) => supporter.level > 1)[
      Math.floor(
        Math.random() *
          supporters?.supporters.filter((supporter) => supporter.level > 1).length
      )
    ].id,
  };
}
