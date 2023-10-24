"use server";
import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";
import prisma from "@/backend/prisma/prisma";
import { User } from "@prisma/client";
import { cookies } from "next/headers";

export async function SupporterSessionMiddleware<
  R extends { userSession: Omit<User, "password"> },
>({ request }: { request: R }) {
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
    ...request,
    supporterSession: supporter,
  };
}
