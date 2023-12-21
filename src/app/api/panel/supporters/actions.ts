"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { revalidatePath } from "next/cache";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../../_shared/utils/ActionResponse";
import { cookies } from "next/headers";
import * as service from "./service";
import { ReadSupportersDto, ReadSupporterBranchesDto, AddSupporterDto } from "./dto";

export async function readSupportersFromSupporterGroup(request?: ReadSupportersDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

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
      .then(SupporterSessionMiddleware);

    const { data, pagination } =
      await service.readSupportersFromSupporterGroupWithRelation(parsedRequest);

    return ActionResponse.success({
      data,
      pagination,
    });
  } catch (err) {
    console.log(err);
    return ActionResponse.error(err);
  }
}

export async function addSupporter(request: AddSupporterDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    if (parsedRequest.supporterSession.level < 4 && request.referralId)
      throw "Você não pode cadastrar um apoiador para um apoiador.";

    const newSupporter = await service.createSupporter({
      campaignId: parsedRequest.supporterSession.campaignId,
      user: request.user,
      referralId: request.referralId,
    });

    if (!newSupporter) throw "Erro ao criar novo apoiador.";

    revalidatePath("/painel");

    return ActionResponse.success({
      data: newSupporter,
      message: "Sucesso ao criar novo apoiador!",
    });
  } catch (err: any) {
    console.log(err);
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
    return ActionResponse.error(err);
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
