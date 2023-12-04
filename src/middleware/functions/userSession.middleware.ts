"use server";
import { User } from "@prisma/client";
import { headers } from "next/headers";
import { MiddlewareArguments } from "../types/types";
import prisma from "prisma/prisma";

export async function UserSessionMiddleware<P>({ request }: MiddlewareArguments<P>) {
  const userId = headers().get("userId")!;

  const user = await prisma.user
    .findFirst({
      where: {
        id: userId,
      },
    })
    .then((user) => user!);

  const { password, ...rest } = user;

  return {
    request: {
      ...request,
      userSession: rest,
    },
  };
}

export type UserSessionMiddlewareReturnType<T> = Awaited<
  ReturnType<typeof UserSessionMiddleware<T>>
>;
