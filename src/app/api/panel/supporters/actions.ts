"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { revalidatePath } from "next/cache";
import { CreateSupportersLevelMiddleware, ReadSupportersMiddleware } from "./middlewares";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../../_shared/utils/ActionResponse";
import { cookies } from "next/headers";
import * as service from "./service";
import { ReadSupportersDto, CreateSupportersDto, ReadSupporterBranchesDto } from "./dto";

export async function readSupportersFromSupporterGroup(request?: ReadSupportersDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware)
      .then(ReadSupportersMiddleware);

    const { data, pagination } =
      await service.readSupportersFromSupporterGroup(parsedRequest);

    return ActionResponse.success({
      data,
      pagination,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readSupportersFromSupporterGroupWithRelation(
  request?: ReadSupportersDto
) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware)
      .then(ReadSupportersMiddleware);

    const { data, pagination } =
      await service.readSupportersFromSupporterGroupWithRelation(parsedRequest);

    console.log(data, pagination);

    return ActionResponse.success({
      data,
      pagination,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function createSupporter(request: CreateSupportersDto) {
  try {
    const parsedRequest = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware)
      .then(CreateSupportersLevelMiddleware);

    const newSupporter = await service.createSupporter(parsedRequest);

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

export async function readSupporterTrail(request?: ReadSupporterBranchesDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const supporters = await service.readSupporterTrail(parsedRequest);

    return ActionResponse.success({
      data: supporters,
    });
  } catch (err) {
    ActionResponse.error(err);
  }
}

export async function readSupporterBranches(request?: ReadSupporterBranchesDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const supporters = await service.readSupporterBranches(parsedRequest);

    return ActionResponse.success({
      data: supporters,
    });
  } catch (err) {
    ActionResponse.error(err);
  }
}

export async function leaveAsSupporter() {
  try {
    const { request: parsedRequest } = await UseMiddlewares()
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const deleteSupporter = await service.deleteSupporterAsSupporter(parsedRequest);

    cookies().delete("activeCampaign");

    return ActionResponse.success({
      data: deleteSupporter,
      message: "Sucesso ao sair da campanha!",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}
