import type {
  CreateSupportersDto,
  ListSupportersDto,
} from "@/(shared)/dto/schemas/supporters/supporters";
import * as supportersService from "./supporters.service";

class SupportersActions {
  async listSupporters(data: ListSupportersDto) {
    return supportersService.listSupporters(data);
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
