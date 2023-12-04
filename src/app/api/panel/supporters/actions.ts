"use server";

import * as supportersService from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { revalidatePath } from "next/cache";
import { CreateSupportersLevelMiddleware, ListSupportersMiddleware } from "./middlewares";
import { CreateSupportersDto, ListSupportersDto } from "./dto";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../../_shared/utils/ActionResponse";

export async function listSupportersFromGroup(request: ListSupportersDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware)
      .then(ListSupportersMiddleware);

    const { data, pagination } =
      await supportersService.listSupportersFromGroup(parsedRequest);

    return ActionResponse.success({
      data,
      pagination,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function getSupporterByUser(data: { userId: string; campaignId: string }) {
  return supportersService.getSupporterByUser(data);
}

export async function createSupporter(request: CreateSupportersDto) {
  try {
    const parsedRequest = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware)
      .then(CreateSupportersLevelMiddleware);

    const newSupporter = await supportersService.createSupporter(parsedRequest);

    if (!newSupporter) throw "Erro ao criar novo apoiador.";

    revalidatePath("/painel");

    return ActionResponse.success({
      data: newSupporter,
      message: "Sucesso ao criar novo apoiador!",
    });
  } catch (err: any) {
    return ActionResponse.error(err);
  }
}

export async function listTreeSuporters() {
  const { request: parsedRequest } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware);

  return supportersService.listSupportersAsTree(parsedRequest);
}

export async function signUpAsSupporter(request: CreateSupportersDto) {
  const newSupporter = await supportersService.signUpAsSupporter(request);

  return newSupporter;
}
