"use client";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  MapPinIcon,
  EllipsisHorizontalIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import { Fragment, useEffect, useState } from "react";
import { generateCalendarDays } from "../utils/generateCalendarDays";
import Loading from "@/app/loading";
import Calendar from "../components/calendar";
import EventList from "../components/eventList";
import DayModal from "../components/dayModal";
import {
  createEvent,
  getEventsByCampaign,
} from "@/backend/resources/events/events.service";
import { cookies } from "next/headers";
import { Event } from "@prisma/client";
import { mockEvent } from "@/tests/mockEvent";
import { usePanel } from "@/frontend/shared/hooks/usePanel";
import { faker } from "@faker-js/faker";
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

export default function CalendarPage({ events }: { events: Event[] }) {
  const [calendarData, setCalendarData] = useState(null);
  const { campaign } = usePanel();

  async function createMockEvent() {
    createEvent(await mockEvent(campaign.id));
  }

  return (
    <div>
      <h2 className="text-base font-semibold leading-6 text-gray-900">
        Próximos Eventos
      </h2>

      <button
        onClick={() => createMockEvent()}
        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Criar evento
      </button>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-start-9 lg:col-end-13 lg:row-start-1  xl:col-start-9">
          <Calendar events={events} />
        </div>
        <div className="lg:col-span-8">
          <EventList events={events} />
        </div>
      </div>
    </div>
  );
}
