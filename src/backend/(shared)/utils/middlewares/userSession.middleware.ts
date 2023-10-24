"use server";
import prisma from "@/backend/prisma/prisma";
import { MiddlewarePayload } from "@/next_decorators/decorators/UseMiddlewares";
import { User } from "@prisma/client";
import { headers } from "next/headers";
import "reflect-metadata";

export async function UserSessionMiddleware({
  bind,
}: MiddlewarePayload<any, { userSession: Omit<User, "password"> }>) {
  const userId = headers().get("userId")!;

  const user = await prisma.user
    .findFirst({
      where: {
        id: userId,
      },
    })
    .then((user) => user!);

  const { password, ...rest } = user;

  bind["userSession"] = rest;
}
