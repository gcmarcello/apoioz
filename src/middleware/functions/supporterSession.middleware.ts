"use server";
import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";
import { User } from "@prisma/client";
import { cookies } from "next/headers";
import prisma from "prisma/prisma";
import { MiddlewareArguments } from "../types/types";
import { UserSessionMiddlewareReturnType } from "./userSession.middleware";

export async function SupporterSessionMiddleware({
  request,
}: UserSessionMiddlewareReturnType) {
  const campaignId = cookies().get("activeCampaign")!.value;

  const supporter = await prisma.supporter.findFirst({
    where: {
      campaignId,
      userId: request.userSession.id,
    },
  });

  if (!supporter)
    throw _NextResponse.rawError({
      message: "Você não tem permissão para acessar os dados dessa campanha.",
      status: 403,
    });

  return {
    request: {
      ...request,
      supporterSession: supporter,
    },
  };
}

export type SupporterSessionMiddlewareReturnType = Awaited<
  ReturnType<typeof SupporterSessionMiddleware>
>;
