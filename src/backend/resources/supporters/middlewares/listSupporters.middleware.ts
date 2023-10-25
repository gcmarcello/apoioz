"use server";
import { ListSupportersDto } from "@/(shared)/dto/schemas/supporters/supporters";
import { Supporter, User } from "@prisma/client";
import { MiddlewareArguments } from "@/middleware/types/types";

export async function ListSupportersMiddleware({
  request,
}: MiddlewareArguments<
  ListSupportersDto & { supporterSession: Supporter; userSession: Omit<User, "password"> }
>) {
  if (request.data && request.supporterSession.level != 4) {
    request.data.ownerId = "";
    request.data.campaignOwnerId = "";
  }

  return request;
}
