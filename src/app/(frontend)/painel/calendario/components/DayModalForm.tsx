import { Mocker } from "@/app/(frontend)/_shared/components/Mocker";

import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import { getAvailableTimesByDay, createEvent } from "@/app/api/panel/events/actions";
import { fakerPT_BR } from "@faker-js/faker";
import { Campaign } from "@prisma/client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../_shared/components/Button";
import { CalendarDay } from "../page";
import { ButtonSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { ListboxField } from "@/app/(frontend)/_shared/components/fields/Select";

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
  const [loading, setLoading] = useState<boolean>(false);
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
      setLoading(true);
      const response = await createEvent({ ...data, userId: userId });
      showToast({
        message: `Evento solicitado com sucesso!`,
        variant: "success",
        title: "Confirmado",
      });
      setLoading(false);
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
            <ListboxField
              hform={form}
              name="dateStart"
              label="Hora de início"
              data={availableTimes}
              displayValueKey={""}
              disabled={!availableTimes?.length}
            />
            {Array.isArray(availableTimes) && !availableTimes.length && (
              <span className="text-xs font-normal italic text-red-400">
                Sem horários disponíveis.
              </span>
            )}
          </div>

          <div>
            <ListboxField
              hform={form}
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
          <Button
            disabled={!form.formState.isValid || loading}
            type="submit"
            variant="primary"
          >
            <div className="flex items-center gap-x-2">
              {loading && <ButtonSpinner />} Solicitar Evento
            </div>
          </Button>
        </div>
      </div>
    </form>
  );
}
