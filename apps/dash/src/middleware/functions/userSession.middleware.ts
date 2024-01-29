"use server";
import { headers } from "next/headers";
import { prisma } from "prisma/prisma";
import { UserWithoutPassword } from "prisma/types/User";
import { MiddlewareArguments, MiddlewareReturnType } from "./useMiddlewares";

export async function UserSessionMiddleware<R, A>({
  request,
}: MiddlewareArguments<R, A>) {
  const userId = headers().get("userId")!;

  if (!userId) throw "Usuário não encontrado";

  const user = await prisma.user
    .findFirst({
      where: {
        id: userId,
      },
    })
    .then((user) => user!);

  if (!user) throw "Usuário não encontrado";

  const { password, ...rest } = user;

  return {
    request: {
      ...request,
      userSession: rest,
    },
  };
}

export type UserSession = UserWithoutPassword;

export type UserSessionMiddlewareReturn<R, A> = MiddlewareReturnType<
  typeof UserSessionMiddleware<R, A>
>;
