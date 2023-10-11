"use server";

import dayjs from "dayjs";
import { listSupporters } from "../../api/services/campaign";
import { SupporterType } from "../../../common/types/userTypes";

export async function getLatestSupporters(
  userId: string,
  campaignId: string
): Promise<any> {
  const latestSupporters = await listSupporters(userId, campaignId, {
    take: 4,
    dateFrom: dayjs().subtract(1, "week").toISOString(),
  });
  return latestSupporters.supporters;
}
