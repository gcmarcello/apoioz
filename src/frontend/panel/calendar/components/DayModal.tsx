import { Transition, Dialog, Menu } from "@headlessui/react";
import {
  CalendarDaysIcon,
  CalendarIcon,
  CheckIcon,
  EllipsisHorizontalIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Event } from "@prisma/client";
import dayjs from "dayjs";
import { Dispatch, Fragment, useEffect, useRef, useState } from "react";
import { CalendarDay } from "../pages/page";
import clsx from "clsx";
import events from "events";
import googleCalendarLink from "../utils/generateGoogleCalendarLink";
import { Button } from "../../(shared)/components/button";
import SubmitEventRequest from "./DayModalForm";
import { set, useForm } from "react-hook-form";
import { CreateEventDto } from "@/(shared)/dto/schemas/events/event";
import { createEvent } from "@/backend/resources/events/events.actions";
import Loading from "@/app/loading";
import { usePanel } from "../../(shared)/hooks/usePanel";

export default function DayModal({
  show,
  setShow,
  selectedDay,
}: {
  show: boolean;
  setShow: Dispatch<boolean>;
  selectedDay: CalendarDay;
}) {
  const completeButtonRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast, setShowToast, user } = usePanel();
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      dateStart: "",
      dateEnd: "",
      location: "",
      observations: "",
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setShowForm(false);
    }, 500);
  }, [show]);

  function isDayInThePast() {
    return dayjs(selectedDay?.date).isBefore(dayjs(), "day");
  }

  const submitEvent = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await createEvent({ ...data, userId: user.id });
      setShowToast({
        show: true,
        message: `${response.name} foi enviado para aprovação com sucesso!`,
        title: "Solicitação enviada!",
        variant: "success",
      });
      setShow(false);
    } catch (error) {
      console.log(error);
      form.setError("root.serverError", {
        type: "400",
        message: "Erro inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        initialFocus={completeButtonRef}
        as="div"
        className="relative z-50"
        onClose={setShow}
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
          <div className="fixed inset-0  bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0  w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:max-w-md sm:p-6">
                <form onSubmit={form.handleSubmit(submitEvent)}>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <CalendarDaysIcon
                        ref={completeButtonRef}
                        className="h-6 w-6 text-gray-500"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="text-center">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        {showForm ? "Agendar - " : "Agenda - "}
                        {selectedDay
                          ? dayjs(selectedDay.date).format("DD/MM/YYYY")
                          : "Dia"}
                      </Dialog.Title>
                    </div>
                    <div className="absolute right-0 top-0 pr-4 pt-4 sm:block">
                      <button
                        type="button"
                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => setShow(false)}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  {showForm ? (
                    <SubmitEventRequest form={form} day={selectedDay} />
                  ) : isLoading ? (
                    <Loading />
                  ) : (
                    <>
                      <div>
                        <div className="mt-2">
                          {selectedDay?.events?.length ? (
                            <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
                              {selectedDay?.events &&
                                selectedDay.events.map((meeting) => (
                                  <li
                                    key={meeting.id}
                                    className="relative flex space-x-6 py-6 xl:static"
                                  >
                                    <img
                                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                      alt=""
                                      className="h-14 w-14 flex-none rounded-full"
                                    />
                                    <div className="flex-auto">
                                      <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">
                                        {meeting.name}
                                      </h3>
                                      <dl className="mt-2 flex flex-col gap-x-5 text-gray-500 xl:flex-row">
                                        <div className="flex items-start space-x-3">
                                          <dt className="mt-0.5">
                                            <span className="sr-only">Date</span>
                                            <CalendarIcon
                                              className="h-5 w-5 text-gray-400"
                                              aria-hidden="true"
                                            />
                                          </dt>
                                          <dd>
                                            <time
                                              dateTime={dayjs(
                                                meeting.dateStart
                                              ).toISOString()}
                                            >
                                              {dayjs(meeting.dateStart).format(
                                                "DD/MM/YYYY HH:mm"
                                              )}
                                            </time>
                                          </dd>
                                        </div>

                                        <div className="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5">
                                          <dt className="mt-0.5">
                                            <span className="sr-only">Location</span>
                                            <MapPinIcon
                                              className="h-5 w-5 text-gray-400"
                                              aria-hidden="true"
                                            />
                                          </dt>
                                          <dd>{meeting.location}</dd>
                                        </div>
                                      </dl>
                                    </div>
                                    <Menu
                                      as="div"
                                      className="absolute right-0 top-6 xl:relative xl:right-auto xl:top-auto xl:self-center"
                                    >
                                      <div>
                                        <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
                                          <span className="sr-only">Open options</span>
                                          <EllipsisHorizontalIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </Menu.Button>
                                      </div>

                                      <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                      >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                          <div className="py-1">
                                            <Menu.Item>
                                              {({ active }) => (
                                                <a
                                                  href="#"
                                                  className={clsx(
                                                    active
                                                      ? "bg-gray-100 text-gray-900"
                                                      : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                  )}
                                                >
                                                  Edit
                                                </a>
                                              )}
                                            </Menu.Item>
                                            <Menu.Item>
                                              {({ active }) => (
                                                <a
                                                  href="#"
                                                  className={clsx(
                                                    active
                                                      ? "bg-gray-100 text-gray-900"
                                                      : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                  )}
                                                >
                                                  Cancel
                                                </a>
                                              )}
                                            </Menu.Item>
                                          </div>
                                        </Menu.Items>
                                      </Transition>
                                    </Menu>
                                  </li>
                                ))}
                            </ol>
                          ) : (
                            <div>
                              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <CheckIcon
                                  className="h-6 w-6 text-green-600"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="mt-3 text-center sm:mt-5">
                                <Dialog.Title
                                  as="h3"
                                  className="text-base font-semibold leading-6 text-gray-900"
                                >
                                  Dia livre!
                                </Dialog.Title>
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500">
                                    Clique no botão abaixo para solicitar um evento na sua
                                    área! Assim que a equipe verificar a agenda, seu
                                    evento será confirmado e você receberá uma mensagem
                                    com os detalhes.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-5 flex justify-end space-x-2 sm:mt-6">
                    <Button
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
                    </Button>
                    {isDayInThePast() ? (
                      <Button disabled={true} variant="danger">
                        Dia Passado
                      </Button>
                    ) : (
                      <Button
                        type={showForm ? "submit" : "button"}
                        disabled={showForm ? !form.formState.isValid : false}
                        variant="primary"
                        onClick={() => setShowForm(true)}
                      >
                        Solicitar Evento
                      </Button>
                    )}
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
