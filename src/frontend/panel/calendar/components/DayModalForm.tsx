import { FieldValues, UseFormReturn, useForm } from "react-hook-form";
import { Button } from "../../(shared)/components/button";
import InputMask from "react-input-mask";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  createEvent,
  getAvailableTimesByDay,
} from "@/backend/resources/events/events.actions";
import { usePanel } from "../../(shared)/hooks/usePanel";
import { CalendarDay } from "../pages/page";
import SelectListbox, {
  ListboxOptionType,
} from "@/frontend/(shared)/components/SelectListbox";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { da, fakerPT_BR } from "@faker-js/faker";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Campaign } from "@prisma/client";
import { Mocker } from "@/frontend/(shared)/components/Mocker";
import { showToast } from "@/frontend/(shared)/components/alerts/toast";
dayjs.extend(isBetween);

export default function SubmitEventRequest({
  day,
  campaign,
  userId,
  setShow,
}: {
  day: CalendarDay;
  campaign: Campaign;
  userId: string;
  setShow: Dispatch<SetStateAction<boolean>>;
}) {
  const [availableTimes, setAvailableTimes] = useState<ListboxOptionType[] | null>(null);
  const [endingAvailableTimes, setEndingAvailableTimes] = useState<
    ListboxOptionType[] | null
  >(null);
  const [dateEvents, setDateEvents] = useState<{ start: string; end: string }[] | null>(
    null
  );
  const [error, setError] = useState<any>(null);
  const form = useForm();

  useEffect(() => {
    async function fetchAvailableTimes() {
      try {
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
      } catch (error) {
        setError(error);
      }
    }
    fetchAvailableTimes()
      .then((times: any) => setAvailableTimes(times))
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

  const generateFakeData = () => {
    form.setValue("name", fakerPT_BR.company.buzzPhrase());
    form.setValue("description", fakerPT_BR.lorem.paragraph());
    form.setValue("location", fakerPT_BR.location.county());
    form.setValue("observations", fakerPT_BR.lorem.paragraph());
  };

  const submitEvent = async (data: any) => {
    try {
      const response = await createEvent({ ...data, userId: userId });
      showToast({
        message: `Evento solicitado com sucesso!`,
        variant: "success",
        title: "Confirmado",
      });
      setShow(false);
    } catch (error) {
      console.log(error);
      showToast({
        message: `${error}`,
        variant: "error",
        title: "Erro ao solicitar evento",
      });

      form.setError("root.serverError", {
        type: "400",
        message: "Erro inesperado",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(submitEvent)}>
      <div className="my-2">
        <Mocker mockData={generateFakeData} submit={form.handleSubmit(submitEvent)} />

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
              disabled={!availableTimes?.length}
            />
            {Array.isArray(availableTimes) && !availableTimes.length && (
              <span className="text-xs font-normal italic text-red-400">
                Sem horários disponíveis.
              </span>
            )}
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
        <div className="mt-5 flex justify-end space-x-2 sm:mt-6">
          {/* <Button
            variant="secondary"
            onClick={() => {
              if (showForm) {
                setShowForm(false);
              } else {
                setShow(false);
              }
            }}
          >
            Voltar
          </Button> */}
          <Button disabled={!form.formState.isValid} type="submit" variant="primary">
            Solicitar Evento
          </Button>
        </div>
      </div>
    </form>
  );
}
