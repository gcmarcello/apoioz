"use server";

import { cookies, headers } from "next/headers";
import * as service from "./service";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ActionResponse } from "odinkit";
import { CampaignLeaderMiddleware } from "@/middleware/functions/campaignLeader.middleware";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupporter } from "../supporters/service";
import { checkUserCanJoinCampaign } from "./service";
import { CreateCampaignDto, JoinCampaignDto } from "./dto";

export async function deactivateCampaign() {
  cookies().delete("activeCampaign");
  return redirect("/painel");
}

export async function joinCampaign(request: JoinCampaignDto) {
  try {
    const {
      request: { userSession },
    } = await UseMiddlewares({ request }).then(UserSessionMiddleware);

    const campaignOwnerSupporter = await prisma.supporter.findFirst({
      where: {
        campaignId: request.campaignId,
        level: 4,
      },
    });

    if (!campaignOwnerSupporter) throw "Campanha não encontrada.";

    const user = (await prisma.user.findUnique({
      where: { id: userSession.id },
      include: {
        info: true,
      },
    }))!;

    const supporter = await createSupporter({
      user: user as any, //@todo
      campaignId: request.campaignId,
      userId: user.id,
      referralId: campaignOwnerSupporter.id,
    });

    revalidatePath("/painel");

    return ActionResponse.success({
      data: supporter,
      message: "Sucesso ao criar novo apoiador!",
    });
  } catch (err: any) {
    return ActionResponse.error(err);
  }
}

export async function activateCampaign(campaignId: string) {
  cookies().set("activeCampaign", campaignId);
  return ActionResponse.success({
    redirect: "/painel",
  });
}

export async function listCampaigns(userId: string) {
  return service.listCampaigns(userId);
}

export async function readCampaign(request: { campaignId: string }) {
  const campaign = await service.readCampaign(request);
  if (!campaign) deactivateCampaign();
  return campaign;
}

export async function updateCampaign(request: {
  campaignId: string;
  data: any;
}) {
  try {
    const { request: parsedRequest } = await UseMiddlewares({ request })
      .then(UserSessionMiddleware)
      .then(SupporterSessionMiddleware)
      .then(CampaignLeaderMiddleware);

    const updatedCampaign = await service.updateCampaign(parsedRequest);
    revalidatePath("/painel/configuracoes");

    return ActionResponse.success({
      data: updatedCampaign,
      message: "Campanha atualizada com sucesso!",
    });
  } catch (err) {
    console.log(err);
    return ActionResponse.error(err);
  }
}

export async function fetchCampaignTeamMembers() {
  const userId = headers().get("userId");
  const campaignId = cookies().get("activeCampaign")?.value;

  if (!userId || !campaignId) return;

  return service.readCampaignTeamMembers(campaignId);
}

export async function generateMainPageStats(data: any) {
  try {
    const { request: parsedRequest } = await UseMiddlewares(data).then(
      UserSessionMiddleware
    );

    const mainStates = await service.generateMainPageStats(data);

    return ActionResponse.success({
      data: mainStates,
      message: "Estatísticas geradas com sucesso!",
    });
  } catch (e) {
    return ActionResponse.error(e);
  }
}

export async function createCampaign(data: CreateCampaignDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares({
      request: data,
    }).then(UserSessionMiddleware);

    const campaign = await service.createCampaign(parsedRequest);

    return ActionResponse.success({
      data: campaign,
      message: "Campanha criada com sucesso!",
    });
  } catch (e) {
    console.log(e);
    return ActionResponse.error(e);
  }
}
