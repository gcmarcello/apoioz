import { getEventsByCampaign } from "@/backend/resources/events/events.service";
import CalendarPage from "@/frontend/panel/calendar/pages/page";
import { cookies } from "next/headers";

export default async function Calendario() {
  const events = await getEventsByCampaign(cookies().get("activeCampaign")!.value);

  return <CalendarPage events={events} />;
}
