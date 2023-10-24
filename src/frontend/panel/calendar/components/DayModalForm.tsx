"use client";
import { FieldValues, UseFormReturn, useForm } from "react-hook-form";
import { Button } from "../../(shared)/components/button";
import InputMask from "react-input-mask";
import { useEffect, useMemo, useState } from "react";
import { getAvailableTimesByDay } from "@/backend/resources/events/events.actions";
import { usePanel } from "../../(shared)/hooks/usePanel";
import { CalendarDay } from "../pages/page";
import SelectListbox, {
  ListboxOptionType,
} from "@/frontend/(shared)/components/SelectListbox";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { da } from "@faker-js/faker";
import { XMarkIcon } from "@heroicons/react/20/solid";
dayjs.extend(isBetween);

export default function SubmitEventRequest({
  form,
  day,
}: {
  form: UseFormReturn<any, any, undefined>;
  day: CalendarDay;
}) {
  const [availableTimes, setAvailableTimes] = useState<ListboxOptionType[] | null>(null);
  const [endingAvailableTimes, setEndingAvailableTimes] = useState<
    ListboxOptionType[] | null
  >(null);
  const [dateEvents, setDateEvents] = useState<{ start: string; end: string }[] | null>(
    null
  );
  const { campaign } = usePanel();

  useEffect(() => {
    async function fetchAvailableTimes() {
      const serverTimes = await getAvailableTimesByDay({
        campaignId: campaign.id,
        day: day.date,
      });
      setDateEvents(serverTimes.events);
      return serverTimes.available.map((string, index) => ({
        id: index + 1,
        name: dayjs(string).format("HH:mm"),
        value: string,
      }));
    }
    fetchAvailableTimes()
      .then((times) => setAvailableTimes(times))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (form.watch("dateStart")) {
      form.resetField("dateEnd");
      const selectedTime = dayjs(form.watch("dateStart")?.value);
      let times = availableTimes?.filter((time) => {
        const timeDate = dayjs(time.value);
        return timeDate.isAfter(selectedTime);
      });
      if (dateEvents) {
        times = times?.filter((time) => {
          const selectedEndTime = dayjs(time.value);
          for (const event of dateEvents) {
            const eventStartTime = dayjs(event.start);
            const eventEndTime = dayjs(event.end);
            if (
              selectedTime.isBefore(eventEndTime) &&
              selectedEndTime.isAfter(eventStartTime)
            ) {
              return false; // Overlapping time slot found, exclude it from the list
            }
          }
          return true; // No overlap found, include this time slot
        });
      }
      setEndingAvailableTimes(times || []);
    }
  }, [form.watch("dateStart"), availableTimes]);

  return (
    <div className="my-2">
      <div className="mt-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Nome do Evento
        </label>
        <div className="mt-1">
          <input
            type="text"
            autoComplete="title"
            {...form.register("name", { required: true })}
            id="name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Descrição do Evento
        </label>
        <div className="mt-1">
          <textarea
            autoComplete="description"
            {...form.register("description", { required: true })}
            id="description"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div>
          <SelectListbox
            form={form}
            formLabel="dateStart"
            label="Hora de início"
            options={availableTimes || []}
          />
        </div>
        <div>
          <SelectListbox
            form={form}
            formLabel="dateEnd"
            label="Hora de término"
            options={endingAvailableTimes || []}
            disabled={!endingAvailableTimes?.length}
          />
        </div>
      </div>
      {Array.isArray(endingAvailableTimes) && !endingAvailableTimes.length && (
        <span className="text-xs font-normal italic text-red-400">
          Existe um evento já marcado que conflita com este horário.
        </span>
      )}
      <div className="mt-4">
        <label
          htmlFor="location"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Local do Evento
        </label>
        <div className="mt-1">
          <input
            type="text"
            autoComplete="location"
            {...form.register("location", { required: true })}
            id="location"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="mt-4">
        <label
          htmlFor="observations"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Observações{" "}
          <span className="text-xs font-normal italic text-gray-400">
            Só aparecem para a organização.
          </span>
        </label>
        <div className="mt-1">
          <textarea
            autoComplete="observations"
            {...form.register("observations", { required: true })}
            id="observations"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
  );
}
