"use client";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import {
  readEventsAvailability,
  createEvent,
} from "@/app/api/panel/events/actions";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { Dispatch, SetStateAction, useState, useEffect, useMemo } from "react";
import { Button } from "../../../_shared/components/Button";
import { CalendarDay } from "../page";
import { ButtonSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { ListboxField } from "@/app/(frontend)/_shared/components/fields/Select";
import {
  Checkbox,
  Description,
  Form,
  Input,
  Label,
  Switch,
  Textarea,
  useAction,
  useForm,
} from "odinkit/client";
import { CreateEventDto, createEventDto } from "@/app/api/panel/events/dto";
import { zodResolver } from "@hookform/resolvers/zod";

dayjs.extend(isBetween);

export default function SubmitEventRequest({
  day,
  setShow,
}: {
  day: CalendarDay;
  setShow: Dispatch<SetStateAction<boolean>>;
}) {
  const form = useForm({ schema: createEventDto });

  const { data, trigger: fetchEventsAvailability } = useAction({
    action: readEventsAvailability,
    responseParser: (data) => {
      return {
        dateEvents: data.eventsTimestamps,
        availableTimes: data.availableTimes.map((string, index) => ({
          id: index + 1,
          name: dayjs(string).format("HH:mm"),
          value: string,
        })),
      };
    },
  });

  const { dateEvents, availableTimes } = data || {};

  const { trigger: submitEvent, isMutating: loading } = useAction({
    action: createEvent,
    onSuccess: (response) => {
      showToast({
        message: response?.message || "Evento solicitado com sucesso",
        variant: "success",
        title: "Confirmado!",
      });
      setShow(false);
    },
    onError: (error) => {
      showToast({
        message: `${error}`,
        variant: "error",
        title: "Erro ao solicitar evento",
      });

      form.setError("root.serverError", {
        type: "400",
        message: "Erro inesperado",
      });
    },
  });

  const [endingAvailableTimes, setEndingAvailableTimes] = useState<
    {
      id: number;
      name: string;
      value: string;
    }[]
  >();

  useEffect(() => {
    fetchEventsAvailability({
      where: {
        day: day.date,
      },
    });
  }, []);

  const onDateStartChange = (data: { value: string }) => {
    form.resetField("dateEnd");
    const rawSelectedTime = data.value;
    const selectedTime = dayjs(rawSelectedTime);

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
            return false;
          }
        }
        return true;
      });
    }
    setEndingAvailableTimes(times);
  };

  const Field = useMemo(() => form.createField(), []);

  if (!data) return null;

  return (
    <Form hform={form} onSubmit={(data) => submitEvent(data)}>
      <div className="my-2">
        <div className="mt-4">
          <Field name="name">
            <Label>Nome do Evento</Label>
            <Input />
          </Field>
        </div>

        <div className="mt-4">
          <Field name="description">
            <Label>Descrição do Evento</Label>
            <Textarea />
          </Field>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div>
            <ListboxField
              hform={form}
              name="dateStart"
              label="Hora de início"
              data={availableTimes}
              onChange={onDateStartChange}
              displayValueKey={"name"}
              valueKey={"value"}
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
              name="dateEnd"
              label="Hora de término"
              data={endingAvailableTimes}
              displayValueKey="name"
              valueKey="value"
              disabled={!endingAvailableTimes?.length}
            />
          </div>
        </div>
        {Array.isArray(endingAvailableTimes) &&
          !endingAvailableTimes.length && (
            <span className="text-xs font-normal italic text-red-400">
              Existe um evento já marcado que conflita com este horário.
            </span>
          )}
        <div className="mt-4">
          <Field name="location">
            <Label>Local</Label>
            <Input />
          </Field>
        </div>
        <div className="mt-4">
          <Field variant="switch" name="private">
            <Switch color="indigo" />
            <Label>Evento Privado?</Label>
            <Description>
              O evento só será divulgado para os apoiadores da sua rede.
            </Description>
          </Field>
        </div>
        <div className="mt-4">
          <Field name="observations">
            <Label>Observações</Label>
            <Textarea />
            <Description>
              Informações adicionais sobre o evento. Só aparecem para a
              organização da campanha.
            </Description>
          </Field>
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
    </Form>
  );
}
