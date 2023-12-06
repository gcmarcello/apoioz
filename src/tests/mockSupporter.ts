"use server";

import { normalizeEmail, normalizePhone } from "@/_shared/utils/format";
import { readZonesByCampaign } from "@/app/api/elections/zones/actions";
import { readSupportersFromGroup } from "@/app/api/panel/supporters/actions";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { cookies } from "next/headers";

export async function mockSupporter(campaignId?: string, ownerId?: string) {
  if (!campaignId && !cookies().get("activeCampaign")?.value) return;

  const zones = await readZonesByCampaign(
    campaignId || cookies().get("activeCampaign")!.value
  );

  const supporters = await readSupportersFromGroup({
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
  /* const data = {
    name: faker.person.fullName(),
    email: normalizeEmail(faker.internet.email()),
    phone: normalizePhone(phone),
    zoneId: zones[zoneIndex].id,
    sectionId:
      zones[zoneIndex].[
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
  }; */

  /* return data; */
}
