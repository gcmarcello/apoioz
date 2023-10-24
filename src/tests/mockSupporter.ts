"use server";
import prisma from "@/backend/prisma/prisma";
import { getZonesByCampaign } from "@/backend/resources/elections/zones/zones.service";
import { normalizeEmail, normalizePhone } from "@/(shared)/utils/format";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { cookies } from "next/headers";
import { listSupporters } from "@/backend/resources/supporters/supporters.actions";

export async function mockSupporter(campaignId?: string, ownerId?: string) {
  if (!campaignId && !cookies().get("activeCampaign")?.value) return;

  const zones = await getZonesByCampaign(
    campaignId || cookies().get("activeCampaign")!.value
  );

  const supporters = await listSupporters({
    data: {
      campaignOwnerId: campaignId,
      ownerId: ownerId,
    },
    pagination: {
      pageIndex: 1,
      pageSize: 100,
    },
  });

  if (!zones) return;

  const zoneIndex = Math.floor(Math.random() * zones.length);
  const phone = faker.phone.number();
  const data = {
    name: faker.person.fullName(),
    email: normalizeEmail(faker.internet.email()),
    phone: normalizePhone(phone),
    zoneId: zones[zoneIndex].id,
    sectionId:
      zones[zoneIndex].Section[
        Math.floor(Math.random() * zones[zoneIndex].Section.length)
      ].id,
    birthDate: faker.date.birthdate(),
    campaign: {
      referralId:
        supporters?.supporters[Math.floor(Math.random() * supporters.supporters.length)]
          ?.id ||
        (
          await prisma.supporter.findFirst({
            where: { campaignId: campaignId },
          })
        )?.id,
      campaignId: campaignId,
    },
  };

  return data;
}
