"use server";

import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { revalidatePath } from "next/cache";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "odinkit";
import { cookies } from "next/headers";
import * as service from "./service";
import {
  ReadSupportersDto,
  ReadSupporterBranchesDto,
  AddSupporterDto,
  readSupportersDto,
} from "./dto";
import { ValidatorMiddleware } from "@/middleware/functions/validator.middleware";

export async function readSupportersFulltext(request?: ReadSupportersDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares({ request })
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const { data, pagination } =
      await service.readSupportersFulltext(parsedRequest);

    return ActionResponse.success({
      data,
      pagination,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readSupportersFromSupporterGroup(
  request?: ReadSupportersDto
) {
  try {
    const { request: parsedRequest } = await UseMiddlewares({ request })
      .then((arg) =>
        ValidatorMiddleware({
          ...arg,
          schema: readSupportersDto,
        })
      )
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
    const { request: parsedRequest } = await UseMiddlewares({ request })
      .then((arg) =>
        ValidatorMiddleware({
          ...arg,
          schema: readSupportersDto,
        })
      )
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const { data, pagination } =
      await service.readSupportersFromSupporterGroupWithRelation(parsedRequest);

    return ActionResponse.success({
      data,
      pagination,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function addSupporter(request: AddSupporterDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares({ request })
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    if (parsedRequest.supporterSession.level < 4 && request.referralId)
      throw "Você não pode cadastrar um apoiador para um apoiador.";

    const referralId = request.referralId || parsedRequest.supporterSession.id;

    const newSupporter = await service.createSupporter({
      ...parsedRequest,
      referralId,
      campaignId: parsedRequest.supporterSession.campaignId,
    });

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
    const { request: parsedRequest } = await UseMiddlewares({ request })
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const supporters = await service.readSupporterTrail(parsedRequest);

    return ActionResponse.success({
      data: supporters,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readSupporterBranches(
  request?: ReadSupporterBranchesDto
) {
  try {
    const { request: parsedRequest } = await UseMiddlewares({ request })
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

    const deleteSupporter =
      await service.deleteSupporterAsSupporter(parsedRequest);

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
