"use server";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { getZonesByCampaign } from "../../resources/api/services/zones";
import {
  getCampaign,
  listSupporters,
} from "../../resources/api/services/campaign";

export async function mockSupporter(campaignId: string, referralId: string) {
  const campaign: any = await getCampaign(campaignId);
  const zones = await getZonesByCampaign(campaignId);
  const supporters = await listSupporters({
    pagination: { pageIndex: 0, pageSize: 500 },
  });

  if (!zones || !campaign) return;

  const zoneIndex = Math.floor(Math.random() * zones.length);
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
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
        ].id,
      campaignId: campaignId,
    },
  };
}
