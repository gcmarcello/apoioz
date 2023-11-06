"use server";
import { Supporter, User } from "@prisma/client";
import { MiddlewareArguments } from "@/middleware/types/types";
import { CreateSupportersDto, ListSupportersDto } from "./dto";

export async function ListSupportersMiddleware({
  request,
}: MiddlewareArguments<
  ListSupportersDto & { supporterSession: Supporter; userSession: Omit<User, "password"> }
>) {
  if (request.data && request.supporterSession.level != 4) {
    request.data.ownerId = "";
    request.data.campaignOwnerId = "";
  }

  return {
    request,
  };
}

export async function CreateSupportersLevelMiddleware({
  request,
}: MiddlewareArguments<
  CreateSupportersDto & {
    supporterSession: Supporter;
    userSession: Omit<User, "password">;
  }
>) {
  const { supporterSession, userSession, ...rest } = request;

  const referral = supporterSession;
  const supporter = rest;

  if (referral.level <= supporter.level)
    throw new Error(
      "Você não pode adicionar um apoiador com o mesmo nível ou superior ao seu."
    );

  return request;
}
