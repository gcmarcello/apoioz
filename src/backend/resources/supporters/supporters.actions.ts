"use server";

import * as supportersService from "./supporters.service";

class SupportersActions {
  async listSupporters(data) {
    return supportersService.listSupporters(data);
  }

  async getSupporterByUser(data) {
    return supportersService.getSupporterByUser(data);
  }

  async createSupporter(data) {
    return supportersService.createSupporter(data);
  }
}
export const { listSupporters, getSupporterByUser, createSupporter } =
  new SupportersActions();
