import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import EventList from "../../../../app/(frontend)/painel/calendario/components/EventList";
import { Event } from "@prisma/client";
import Calendar from "../../../../app/(frontend)/painel/calendario/components/Calendar";
import { cookies, headers } from "next/headers";
import { readEventsByCampaign } from "@/app/api/panel/events/actions";
import { readCampaign } from "@/app/api/panel/campaigns/actions";
import { CalendarContext } from "./contexts/calendar.ctx";
import CalendarProvider from "./providers/CalendarProvider";
dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);

export type CalendarDay = {
  date: string;
  isCurrentMonth: boolean;
  isNextMonth?: boolean;
  isPreviousMonth?: boolean;
  isToday: boolean;
  isSelected: boolean;
  events?: Event[];
};

export default async function CalendarPage() {
  const campaignId = cookies().get("activeCampaign")!.value;
  const userId = headers().get("userId");
  if (!campaignId || !userId) return <div>Erro</div>;
  const campaign = await readCampaign({ campaignId });

  const events = await readEventsByCampaign({
    where: {
      campaignId,
    },
  });

  /* async function createMockEvent() {
    createEvent(await mockEvent(campaign.id));
    console.log(
      await getAvailableTimesByDay({
        campaignId: campaign.id,
        day: dayjs().toISOString(),
      })
    );
  } */

  return (
    <CalendarProvider>
      <div>
        {/* {
        <button
          onClick={() => createMockEvent()}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Criar evento
        </button>
      } */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-start-9 lg:col-end-13 lg:row-start-1  xl:col-start-9">
            <Calendar events={events} campaign={campaign} userId={userId} />
          </div>
          <div className="lg:col-span-8">
            <EventList events={events} />
          </div>
        </div>
      </div>
    </CalendarProvider>
  );
}
