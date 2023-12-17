"use server";

import * as supportersService from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { revalidatePath } from "next/cache";
import { CreateSupportersLevelMiddleware, ReadSupportersMiddleware } from "./middlewares";
import {
  CreateSupportersDto,
  JoinAsSupporterDto,
  ReadSupportersAsTreeDto,
  ReadSupportersDto,
} from "./dto";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "../../_shared/utils/ActionResponse";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

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

export async function readSupporterTrail(request?: ReadSupportersAsTreeDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const supporters = await supportersService.readSupporterTrail(parsedRequest);

    return ActionResponse.success({
      data: supporters,
    });
  } catch (err) {
    ActionResponse.error(err);
  }
}

export async function readSupporterAndReferred(request?: ReadSupportersAsTreeDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(request)
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const supporters = await supportersService.readSupporterAndReferred(parsedRequest);

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

export async function joinAsSupporter(request: JoinAsSupporterDto) {
  try {
    const { request: parsedRequest } =
      await UseMiddlewares(request).then(UserSessionMiddleware);

    const newSupporter = await supportersService.joinAsSupporter(parsedRequest);
    cookies().set("activeCampaign", request.campaignId);
    return ActionResponse.success({
      data: newSupporter,
      message: "Sucesso ao criar novo apoiador!",
    });
  } catch (error) {
    console.log(error);
    return ActionResponse.error(error);
  }
}

export async function leaveAsSupporter() {
  try {
    const { request: parsedRequest } = await UseMiddlewares()
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware);

    const deleteSupporter =
      await supportersService.deleteSupporterAsSupporter(parsedRequest);

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
