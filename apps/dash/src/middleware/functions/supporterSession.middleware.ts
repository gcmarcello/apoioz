"use server";
import { Supporter } from "prisma/client";
import { cookies } from "next/headers";
import { prisma } from "prisma/prisma";
import { UserWithoutPassword } from "prisma/types/User";
import { UserSessionMiddlewareReturn } from "./userSession.middleware";
import { MiddlewareReturnType } from "./useMiddlewares";

export async function SupporterSessionMiddleware<R, A>({
  request,
}: UserSessionMiddlewareReturn<R, A>) {
  const campaignId = cookies().get("activeCampaign")!.value;

  const supporter = await prisma.supporter.findFirst({
    where: {
      campaignId,
      userId: request.userSession.id,
    },
  });

  if (!supporter)
    throw "Você não tem permissão para acessar os dados dessa campanha.";

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

export type SupporterSessionMiddlewareReturn<R, A> = MiddlewareReturnType<
  typeof SupporterSessionMiddleware<R, A>
>;
