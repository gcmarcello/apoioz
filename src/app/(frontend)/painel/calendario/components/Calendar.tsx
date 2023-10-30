"use client";
import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import dayjs from "dayjs";
import { useState, useEffect, Dispatch } from "react";
import { Campaign, Event } from "@prisma/client";
import DayModal from "./DayModal";
import Loading from "../../loading";
import { CalendarDay } from "../page";
import { generateCalendarDays } from "../utils/generateCalendarDays";

export default function Calendar({
  events,
  campaign,
  userId,
}: {
  events: { active: Event[]; pending: Event[] };
  campaign: Campaign;
  userId: string;
}) {
  const [today, setToday] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [show, setShow] = useState(false);
  const [calendarDays, setCalendarDays] = useState<
    | {
        date: string;
        isCurrentMonth: boolean;
        isToday: boolean;
        isSelected: boolean;
        events?: Event[];
      }[]
    | null
  >(null);

  useEffect(() => {
    setCalendarDays(generateCalendarDays(today, events));
  }, [today, events]);

  function handleNextMonth() {
    setToday((prev) => prev.add(1, "month"));
  }

  function handleNextYear() {
    setToday((prev) => prev.add(1, "year"));
  }

  function handlePreviousYear() {
    setToday((prev) => prev.subtract(1, "year"));
  }

  function handlePreviousMonth() {
    setToday((prev) => prev.subtract(1, "month"));
  }

  function handleDayButtonClick(day: CalendarDay) {
    if (day.isPreviousMonth) return handlePreviousMonth();
    if (day.isNextMonth) return handleNextMonth();
    setSelectedDay(day);
    return setShow(true);
  }

  if (!calendarDays) {
    return (
      <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
        <Loading />
      </div>
    );
  }

  return (
    <div className="text-center ">
      <div className="flex items-center text-gray-900">
        <button
          onClick={() => handlePreviousYear()}
          type="button"
          className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Ano Passado</span>
          <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          onClick={() => handlePreviousMonth()}
          type="button"
          className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Mês Passado</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex-auto text-sm font-semibold">
          {today.locale("pt-br").format("MMMM - YYYY")}
        </div>
        <button
          onClick={() => handleNextMonth()}
          type="button"
          className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Próximo Mês</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          onClick={() => handleNextYear()}
          type="button"
          className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Próximo Ano</span>
          <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
        <div>Dom</div>
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div>Sab</div>
      </div>
      <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
        {calendarDays.map((day, dayIdx) => (
          <button
            key={day.date}
            onClick={() => handleDayButtonClick(day)}
            type="button"
            className={clsx(
              "py-1.5 focus:z-10",
              !day.isToday ? "hover:bg-gray-100" : "hover:bg-indigo-500",
              day.isCurrentMonth
                ? day.isToday
                  ? "bg-indigo-600 "
                  : "bg-white"
                : "bg-gray-50",
              (day.isSelected || day.isToday) && "font-semibold",
              day.isSelected && "text-white",
              !day.isSelected && day.isCurrentMonth && !day.isToday && "text-gray-900",
              !day.isSelected && !day.isCurrentMonth && !day.isToday && "text-gray-400",
              day.isToday && "text-white",
              day.isToday && !day.isSelected && "text-indigo-600",
              dayIdx === 0 && "rounded-tl-lg",
              dayIdx === 6 && "rounded-tr-lg",
              dayIdx === calendarDays.length - 7 && "rounded-bl-lg",
              dayIdx === calendarDays.length - 1 && "rounded-br-lg"
            )}
          >
            {day.events?.length ? (
              <div className="absolute translate-x-1/2">
                <div
                  className={clsx(
                    "h-2 w-2 rounded-full",
                    day.isToday ? "bg-white" : "bg-indigo-600"
                  )}
                ></div>
              </div>
            ) : null}
            <time
              dateTime={day.date}
              className={clsx(
                "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                day.isSelected && day.isToday && "bg-indigo-600",
                day.isSelected && !day.isToday && "bg-gray-900"
              )}
            >
              {day.date.split("-").pop()!.replace(/^0/, "")}
            </time>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() =>
          handleDayButtonClick({
            date: dayjs().format("YYYY-MM-DD"),
            isCurrentMonth: true,
            isToday: true,
            isSelected: true,
          })
        }
        className="mt-8 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Adicionar Evento
      </button>
      <DayModal
        show={show}
        setShow={setShow}
        campaign={campaign}
        userId={userId}
        selectedDay={
          selectedDay || {
            date: dayjs().format("YYYY-MM-DD"),
            isCurrentMonth: true,
            isToday: true,
            isSelected: true,
            events: events.active.filter((event) =>
              dayjs(event.dateStart).isSame(dayjs(), "day")
            ),
          }
        }
      />
    </div>
  );
}
