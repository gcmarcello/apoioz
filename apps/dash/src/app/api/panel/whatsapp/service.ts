import { UserSession } from "@/middleware/functions/userSession.middleware";
import { UpsertWhatsappDto } from "./dto";
import { SupporterSession } from "@/middleware/functions/supporterSession.middleware";
import axios from "axios";

export async function upsertWhatsapp(
  request: UpsertWhatsappDto & {
    supporterSession: SupporterSession;
    userSession: UserSession;
  }
) {
  const { group, channel } = request;

  const upsertGroupAndChannel = await axios.post("robowhatsapp", {
    group,
    channel,
  });

  return upsertGroupAndChannel;
}

export async function readWhatsapp({
  supporterSession,
  userSession,
}: {
  supporterSession: SupporterSession;
  userSession: UserSession;
}) {
  const whatsapp = await axios.get("robowhatsapp");

  return whatsapp;
}
