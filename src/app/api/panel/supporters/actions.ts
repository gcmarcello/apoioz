"use server";

import * as supportersService from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";
import { revalidatePath } from "next/cache";
import { CreateSupportersLevelMiddleware, ListSupportersMiddleware } from "./middlewares";
import { CreateSupportersDto, ListSupportersDto } from "./dto";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";

export async function listSupporters(request: ListSupportersDto) {
  const { request: parsedRequest } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware)
    .then(ListSupportersMiddleware);

  return supportersService.listSupporters(parsedRequest);
}

export async function getSupporterByUser(data: { userId: string; campaignId: string }) {
  return supportersService.getSupporterByUser(data);
}

export async function createSupporter(request: CreateSupportersDto) {
  try {
    const parsedRequest = await UseMiddlewares()
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware)
      .then(CreateSupportersLevelMiddleware);

    const newSupporter = await supportersService.createSupporter(parsedRequest);

    revalidatePath("/painel");

    return newSupporter;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function listTreeSuporters() {
  const { request: parsedRequest } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware);

  return supportersService.listTreeSuporters(parsedRequest);
}

export async function signUpAsSupporter(request: CreateSupportersDto) {
  const newSupporter = await supportersService.signUpAsSupporter(request);

  return newSupporter;
}
