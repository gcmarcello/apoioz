import type {
  CreateSupportersDto,
  ListSupportersDto,
} from "@/(shared)/dto/schemas/supporters/supporters";
import * as supportersService from "./supporters.service";
import { ListSupportersMiddleware } from "./middlewares/listSupporters.middleware";
import { Supporter, User } from "@prisma/client";
import { UseMiddlewares } from "@/next_decorators/decorators/UseMiddlewares";
import { SupporterSessionMiddleware } from "@/backend/(shared)/utils/middlewares/supporterSession.middleware";
import { UserSessionMiddleware } from "@/backend/(shared)/utils/middlewares/userSession.middleware";

class SupportersActions {
  @UseMiddlewares(
    UserSessionMiddleware,
    SupporterSessionMiddleware,
    ListSupportersMiddleware
  )
  async listSupporters(
    data: ListSupportersDto,
    bind?: { userSession: User; supporterSession: Supporter }
  ) {
    return supportersService.listSupporters(data, bind!.supporterSession);
  }

  async getSupporterByUser(data: { userId: string; campaignId: string }) {
    return supportersService.getSupporterByUser(data);
  }

  async createSupporter(data: CreateSupportersDto) {
    return supportersService.createSupporter(data);
  }
}
export const { listSupporters, getSupporterByUser, createSupporter } =
  new SupportersActions();
