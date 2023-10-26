"use server";
import type {
  CreateSupportersDto,
  ListSupportersDto,
} from "@/backend/dto/schemas/supporters/supporters";
import * as supportersService from "./supporters.service";
import { ListSupportersMiddleware } from "./middlewares/listSupporters.middleware";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";

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

    console.log(parsedRequest);

    return await supportersService.createSupporter(parsedRequest);
  } catch (err: any) {
    return _NextResponse.rawError({
      message: err,
    });
  }
}
