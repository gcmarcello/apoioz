"use server";

import dayjs from "dayjs";
import { listSupporters } from "../../api/services/campaign";

export async function getLatestSupporters(userId: string, campaignId: string): Promise<any[] | number | undefined> {
  return await listSupporters(userId, campaignId, {
    take: 4,
    dateFrom: dayjs().subtract(1, "week").toISOString(),
  });
}
