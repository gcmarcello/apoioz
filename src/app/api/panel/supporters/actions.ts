"use server";

import * as supportersService from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { revalidatePath } from "next/cache";
import { CreateSupportersLevelMiddleware, ReadSupportersMiddleware } from "./middlewares";
import { CreateSupportersDto, ReadSupportersAsTreeDto, ReadSupportersDto } from "./dto";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../../_shared/utils/ActionResponse";

export async function readSupportersFromGroup(request?: ReadSupportersDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware)
      .then(ReadSupportersMiddleware);

    const { data, pagination } =
      await supportersService.readSupportersFromGroup(parsedRequest);

    return ActionResponse.success({
      data,
      pagination,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readSupportersFromGroupWithRelations(request?: ReadSupportersDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware)
      .then(ReadSupportersMiddleware);

    const { data, pagination } =
      await supportersService.readSupportersFromGroupWithRelations(parsedRequest);

    return ActionResponse.success({
      data,
      pagination,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readSupporterFromUser(data: {
  userId: string;
  campaignId: string;
}) {
  return supportersService.readSupporterFromUser(data);
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

export async function readSupportersAsTree(request?: ReadSupportersAsTreeDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const supporters = await supportersService.readSupportersAsTree(parsedRequest);

    return ActionResponse.success({
      data: supporters,
    });
  } catch (err) {
    ActionResponse.error(err);
  }
}

export async function signUpAsSupporter(request: CreateSupportersDto) {
  try {
    const newSupporter = await supportersService.signUpAsSupporter(request);

    return ActionResponse.success({
      data: newSupporter,
      message: "Sucesso ao criar novo apoiador!",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
