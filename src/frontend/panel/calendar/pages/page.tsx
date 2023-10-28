"use client";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import { Fragment, useEffect, useState } from "react";
import EventList from "../components/EventList";
import { createEvent } from "@/backend/resources/events/events.actions";
import { Campaign, Event } from "@prisma/client";
import { mockEvent } from "@/tests/mockEvent";
import { usePanel } from "../../(shared)/hooks/usePanel";
import Calendar from "../components/Calendar";
import { getAvailableTimesByDay } from "@/backend/resources/events/events.actions";
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

export default function CalendarPage({
  events,
  campaign,
}: {
  events: { active: Event[]; pending: Event[] };
  campaign: Campaign;
}) {
  const [calendarData, setCalendarData] = useState(null);

  async function createMockEvent() {
    /* createEvent(await mockEvent(campaign.id)); */
    console.log(
      await getAvailableTimesByDay({
        campaignId: campaign.id,
        day: dayjs().toISOString(),
      })
    );
  }

  return (
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
          <Calendar events={events} campaign={campaign} />
        </div>
        <div className="lg:col-span-8">
          <EventList events={events} />
        </div>
      </div>
    </div>
  );
}
