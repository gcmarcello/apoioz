"use client";

import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import {
  readEventsAvailability,
  updateEvent,
  updateEventStatus,
} from "@/app/api/panel/events/actions";
import { Transition, Dialog } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Event, Supporter } from "prisma/client";
import dayjs from "dayjs";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  CreateEventDto,
  UpdateEventDto,
  updateEventDto,
} from "@/app/api/panel/events/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Description,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  Switch,
  useAction,
  useForm,
} from "odinkit/client";
import { ListboxField } from "@/app/(frontend)/_shared/components/fields/Select";
import clsx from "clsx";
import { Date } from "@/app/(frontend)/_shared/components/Date";

export function EventListActions({
  event,
}: {
  event: Event & { Supporter: Supporter & { user: { name: string } } };
}) {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [counter, setCounter] = useState(3); // Start from 3 seconds
  const [rejectOptions, setRejectOptions] = useState({
    disableButton: false,
    counting: false,
    enableSubmit: false,
  });
  const [endingAvailableTimes, setEndingAvailableTimes] = useState<
    {
      id: number;
      name: string;
      value: string;
    }[]
  >();

  const cancelButtonRef = useRef(null);

  async function processEvent(status: "active" | "rejected") {
    try {
      await updateEventStatus({ eventId: event.id, status });
      setOpen(false);
      showToast({
        variant: "success",
        message: "Evento atualizado com sucesso",
        title: "Pronto!",
      });
      setCounter(3);
      setRejectOptions({
        ...rejectOptions,
        counting: false,
        enableSubmit: false,
        disableButton: false,
      });
    } catch (error) {
      showToast({
        variant: "error",
        message: "Erro ao rejeitar evento",
        title: "Erro!",
      });
    }
  }

  useEffect(() => {
    if (rejectOptions.counting) {
      const timer = setTimeout(() => {
        if (counter > 0) {
          setCounter(counter - 1);
        } else {
          setRejectOptions({
            ...rejectOptions,
            counting: false,
            enableSubmit: true,
            disableButton: false,
          }); // Re-enable the button here
        }
      }, 1000);
      return () => clearTimeout(timer); // Clear the timeout if component unmounts in between
    }
  }, [counter, rejectOptions.counting]);

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

  const { data: updateData, trigger: updateTrigger } = useAction({
    action: updateEvent,
    onSuccess: (response) => {
      setShowForm(false);
      showToast({
        message: response?.message || "Evento atualizado com sucesso",
        variant: "success",
        title: "Confirmado!",
      });
    },
    onError: (error) => {
      showToast({
        message: `${error}`,
        variant: "error",
        title: "Erro ao atualizar evento",
      });
    },
  });

  const form = useForm({
    schema: updateEventDto,
    defaultValues: updateData
      ? {
          ...updateData,
          dateStart: dayjs(updateData.dateStart).toISOString(),
          dateEnd: dayjs(updateData.dateEnd).toISOString(),
          observations: updateData.observations ?? undefined,
        }
      : {
          ...event,
          dateStart: dayjs(event.dateStart).toISOString(),
          dateEnd: dayjs(event.dateEnd).toISOString(),
          observations: event.observations ?? undefined,
        },
  });

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

  const { dateEvents, availableTimes } = data || {};

  useEffect(() => {
    if (!open) return;
    fetchEventsAvailability({
      where: {
        day: dayjs(event.dateStart).toISOString(),
        eventId: event.id,
      },
    });
  }, [open]);

  useEffect(
    () => onDateStartChange({ value: dayjs(event.dateStart).toISOString() }),
    [data, showForm]
  );

  const Field = useMemo(() => form.createField(), []);

  return (
    <>
      <span className="isolate inline-flex rounded-md shadow-sm">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative inline-flex items-center rounded-md bg-white p-1 px-2 font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
        >
          <span className="sr-only">Previous</span>
          <div className="flex">
            <CheckIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          </div>
          <span className="hidden md:block">
            {event.status === "active" ? "Editar" : "Avaliar"}
          </span>
        </button>
      </span>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <Form hform={form} onSubmit={(data) => updateTrigger(data)}>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckIcon
                        className="h-6 w-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-center text-base  font-semibold leading-6 text-gray-900"
                      >
                        Análise do Evento{" "}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-left text-sm text-gray-500">
                          Antes de tomar uma decisão, por favor revise
                          cuidadosamente todos os detalhes do evento listados
                          abaixo. Ap&oacute;s a revis&atilde;o, selecione a
                          op&ccedil;&atilde;o correta abaixo.
                        </p>
                      </div>
                      {showForm ? (
                        <Fieldset>
                          <FieldGroup className="space-y-4">
                            <Field name="name">
                              <Label>Nome</Label>
                              <Input></Input>
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
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
                            <Field name="description">
                              <Label>Descrição</Label>
                              <Input></Input>
                            </Field>
                            <Field name="location">
                              <Label>Local</Label>
                              <Input></Input>
                            </Field>
                            <Field variant="switch" name="private">
                              <Switch color="indigo" />
                              <Label>Evento Privado?</Label>
                              <Description>
                                O evento só será divulgado para os apoiadores da
                                sua rede.
                              </Description>
                            </Field>
                          </FieldGroup>
                        </Fieldset>
                      ) : (
                        <dl className="divide-y divide-gray-100">
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-center text-sm  font-medium leading-6 text-gray-900">
                              Nome
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {updateData?.name ?? event.name}
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-center text-sm  font-medium leading-6 text-gray-900">
                              Data
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              <>
                                {dayjs(event.dateStart).format(
                                  "DD/MM/YYYY - HH:mm"
                                )}{" "}
                                -{" "}
                                {dayjs(event.dateEnd).format(
                                  "DD/MM/YYYY - HH:mm"
                                )}
                              </>
                            </dd>
                          </div>

                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-center text-sm  font-medium leading-6 text-gray-900">
                              Responsável
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {event.Supporter.user.name}
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-center text-sm  font-medium leading-6 text-gray-900">
                              Tipo
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {event.private
                                ? "Privado - Apenas membros da rede do responsável serão informados"
                                : "Público"}
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-center text-sm  font-medium leading-6 text-gray-900">
                              Descrição
                            </dt>
                            <dd className="mt-1 text-sm  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {updateData?.description ?? event.description}
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-center text-sm  font-medium leading-6 text-gray-900">
                              Data
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {dayjs(
                                updateData?.dateStart ?? event.dateStart
                              ).format("DD/MM/YYYY - HH:mm")}{" "}
                              à&nbsp;
                              {dayjs(
                                updateData?.dateEnd ?? event.dateEnd
                              ).format("DD/MM/YYYY - HH:mm")}
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-center text-sm  font-medium leading-6 text-gray-900">
                              Local
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {updateData?.location ?? event.location}
                            </dd>
                          </div>
                          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                            <dt className="text-center text-sm  font-medium leading-6 text-gray-900">
                              Observações
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                              {updateData?.observations ??
                                (event.observations || "Sem observações")}
                            </dd>
                          </div>
                        </dl>
                      )}
                    </div>
                    <div
                      className={clsx(
                        "mt-5 sm:mt-6 sm:grid sm:gap-3",
                        showForm || event.status === "active"
                          ? "sm:grid-cols-2"
                          : "sm:grid-cols-3"
                      )}
                    >
                      <button
                        type="button"
                        className="bg-white-600 inline-flex w-full justify-center rounded-md border border-indigo-600 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                        onClick={() => {
                          setShowForm((prev) => !prev);
                          form.reset();
                        }}
                      >
                        {showForm ? "Cancelar" : "Editar"}
                      </button>
                      {showForm ? (
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                        >
                          Salvar
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={rejectOptions.disableButton}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-40 sm:mt-0"
                            onClick={() => {
                              if (
                                !rejectOptions.counting &&
                                !rejectOptions.enableSubmit
                              ) {
                                setRejectOptions({
                                  ...rejectOptions,
                                  counting: true,
                                  disableButton: true,
                                });
                              } else if (rejectOptions.enableSubmit) {
                                processEvent("rejected");
                              }
                            }}
                            ref={cancelButtonRef}
                          >
                            <XMarkIcon
                              className="h-5 w-5 text-red-500"
                              aria-hidden="true"
                            />{" "}
                            {rejectOptions.counting
                              ? "Confirme em... " + counter
                              : event.status === "active"
                                ? "Cancelar"
                                : "Rejeitar"}
                          </button>
                          {event.status !== "active" && (
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
                              onClick={async () => {
                                await processEvent("active");
                              }}
                            >
                              Aceitar
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </Form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
