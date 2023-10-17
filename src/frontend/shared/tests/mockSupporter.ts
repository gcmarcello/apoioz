"use server";
import prisma from "@/backend/prisma/prisma";
import {
  getCampaign,
  listSupporters,
} from "@/backend/resources/campaign/campaign.service";
import { findCampaignLeader } from "@/backend/resources/supporters/supporters.service";
import { getZonesByCampaign } from "@/backend/resources/zones/zones.service";
import { normalizeEmail, normalizePhone } from "@/shared/utils/format";
import { fakerPT_BR as faker } from "@faker-js/faker";

export async function mockSupporter(campaignId: string) {
  const campaign: any = await getCampaign(campaignId);
  const zones = await getZonesByCampaign(campaignId);
  const supporters = await listSupporters({
    pagination: { pageIndex: 0, pageSize: 500 },
  });
  const leader = await findCampaignLeader(campaignId);

  if (!zones || !campaign) return;

  const zoneIndex = Math.floor(Math.random() * zones.length);
  return {
    name: faker.person.fullName(),
    email: normalizeEmail(faker.internet.email()),
    phone: normalizePhone(faker.phone.number()),
    zoneId: zones[zoneIndex].id,
    sectionId:
      zones[zoneIndex].Section[
        Math.floor(Math.random() * zones[zoneIndex].Section.length)
      ].id,
    birthDate: faker.date.birthdate(),
    campaign: {
      referralId:
        supporters?.supporters[
          Math.floor(Math.random() * supporters.supporters.length)
        ]?.id ||
        (
          await prisma.supporter.findFirst({
            where: { campaignId: campaignId },
          })
        )?.id,
      campaignId: campaignId,
    },
  };
}
