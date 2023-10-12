"use server";

import dayjs from "dayjs";
import { listSupporters } from "../../api/services/campaign";
import { SupporterType } from "../../../common/types/userTypes";

export async function getLatestSupporters(
  userId: string,
  campaignId: string
): Promise<any> {
  const latestSupporters = await listSupporters({
    pagination: { pageIndex: 0, pageSize: 5 },
  });

  if (latestSupporters) return latestSupporters.supporters;
}
