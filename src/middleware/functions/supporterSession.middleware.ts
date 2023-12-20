"use server";
import { Supporter } from "@prisma/client";
import { cookies } from "next/headers";
import { prisma } from "prisma/prisma";
import { UserSessionMiddlewareReturnType } from "./userSession.middleware";
import { UserWithoutPassword } from "prisma/types/User";

export async function SupporterSessionMiddleware<T>({
  request,
}: UserSessionMiddlewareReturnType<T>) {
  const campaignId = cookies().get("activeCampaign")!.value;

  const supporter = await prisma.supporter.findFirst({
    where: {
      campaignId,
      userId: request.userSession.id,
    },
  });

  if (!supporter) throw "Você não tem permissão para acessar os dados dessa campanha.";

  return {
    request: {
      ...request,
      supporterSession: {
        ...supporter,
        user: request.userSession,
      },
    },
  };
}

export type SupporterSession = Supporter & { user: UserWithoutPassword };

export type SupporterSessionMiddlewareReturnType<T> = Awaited<
  ReturnType<typeof SupporterSessionMiddleware<T>>
>;
