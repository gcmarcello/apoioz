import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UpsertWhatsappDto } from "./dto";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { CampaignLeaderMiddleware } from "@/middleware/functions/campaignLeader.middleware";
import * as service from "./service";

export async function upsertWhatsapp(request: UpsertWhatsappDto) {
  const { request: parsedRequest } = await UseMiddlewares(request)
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware)
    .then(CampaignLeaderMiddleware);

  const upsertedWhatsapp = await service.upsertWhatsapp(parsedRequest);
}

export async function readWhatsapp() {
  const { request: parsedRequest } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware)
    .then(CampaignLeaderMiddleware);

  const whatsappInfo = await service.readWhatsapp(parsedRequest);
}
