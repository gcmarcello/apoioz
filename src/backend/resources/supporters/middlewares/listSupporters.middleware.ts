"use server";
import prisma from "@/tests/client";
import { MiddlewareImplementation } from "@/next_decorators/lib/decorators/UseMiddlewares";
import { ListSupportersDto } from "@/(shared)/dto/schemas/supporters/supporters";
import { cookies, headers } from "next/headers";
import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";

export class ListSupportersMiddleware implements MiddlewareImplementation {
  async implementation(payload: ListSupportersDto) {
    const untrustedOwnerId = headers().get("userId")!;
    const campaignId = cookies().get("activeCampaign")!.value;

    const supporterLevel = await prisma.supporter
      .findFirst({
        where: {
          campaignId,
          userId: untrustedOwnerId,
        },
      })
      .then((supporter) => supporter?.level);

    if (payload && payload.data && supporterLevel != 4) {
      payload.data.ownerId = "";
      payload.data.campaignOwnerId = "";
    }
  }
}
