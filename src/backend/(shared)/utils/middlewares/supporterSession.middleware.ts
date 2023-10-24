"use server";
import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";
import prisma from "@/backend/prisma/prisma";
import { MiddlewarePayload } from "@/next_decorators/decorators/UseMiddlewares";
import { Supporter, User } from "@prisma/client";
import { cookies } from "next/headers";
import "reflect-metadata";

export async function SupporterSessionMiddleware({
  bind,
}: MiddlewarePayload<any, { userSession: User; supporterSession: Supporter }>) {
  const campaignId = cookies().get("activeCampaign")!.value;

  const supporter = await prisma.supporter.findFirst({
    where: {
      campaignId,
      userId: bind.userSession.id,
    },
  });

  if (!supporter)
    throw _NextResponse.rawError({
      message: "Você não tem permissão para acessar os dados dessa campanha.",
      status: 403,
    });

  bind["supporterSession"] = supporter;
}
