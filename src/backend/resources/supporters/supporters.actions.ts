import type {
  CreateSupportersDto,
  ListSupportersDto,
} from "@/(shared)/dto/schemas/supporters/supporters";
import * as supportersService from "./supporters.service";
import { ListSupportersMiddleware } from "./middlewares/listSupporters.middleware";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";

export async function listSupporters(request: ListSupportersDto) {
  const parsedRequest = await UserSessionMiddleware({ request })
    .then((request) => SupporterSessionMiddleware({ request }))
    .then((request) => ListSupportersMiddleware({ request }));

  return supportersService.listSupporters(parsedRequest);
}

export async function getSupporterByUser(data: { userId: string; campaignId: string }) {
  return supportersService.getSupporterByUser(data);
}

export async function createSupporter(data: CreateSupportersDto) {
  return supportersService.createSupporter(data);
}
