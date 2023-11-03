"use server";

import * as supportersService from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";
import { revalidatePath } from "next/cache";
import { ListSupportersMiddleware } from "./middlewares";
import { CreateSupportersDto, ListSupportersDto } from "./dto";

export async function listSupporters(request: ListSupportersDto) {
  const parsedRequest = await UserSessionMiddleware({ request })
    .then((request) => SupporterSessionMiddleware({ request }))
    .then((request) => ListSupportersMiddleware({ request }));

  return supportersService.listSupporters(parsedRequest);
}

export async function getSupporterByUser(data: { userId: string; campaignId: string }) {
  return supportersService.getSupporterByUser(data);
}

export async function createSupporter(request: CreateSupportersDto) {
  try {
    const parsedRequest = await UserSessionMiddleware({ request }).then((request) =>
      SupporterSessionMiddleware({ request })
    );

    const newSupporter = await supportersService.createSupporter(parsedRequest);

    revalidatePath("/painel");

    return newSupporter;
  } catch (err: any) {
    throw new Error(err);
  }
}

export async function signUpAsSupporter(request: CreateSupportersDto) {
  const newSupporter = await supportersService.signUpAsSupporter(request);

  return newSupporter;
}
