import { getEventsByCampaign } from "@/backend/resources/events/events.service";
import CalendarPage from "@/frontend/panel/calendar/pages/page";
import { cookies, headers } from "next/headers";

export default async function Calendario() {
  const campaignId = cookies().get("activeCampaign")!.value;
  const userId = headers().get("userId");
  if (!campaignId || !userId) return <div>Erro</div>;

  const events = await getEventsByCampaign({ campaignId, userId });

  return <CalendarPage events={events || { active: [], pending: [] }} />;
}
