import { Transition, Dialog } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Event } from "@prisma/client";
import dayjs from "dayjs";
import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from "react";

export function EventOverviewModal({
  event,
  open,
  setOpen,
}: {
  event: Event;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const cancelButtonRef = useRef(null);

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
          <span className="hidden md:block">Avaliar</span>
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
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-center text-base  font-semibold leading-6 text-gray-900"
                    >
                      Análise do Evento
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-left text-sm text-gray-500">
                        Antes de tomar uma decisão, por favor revise cuidadosamente todos
                        os detalhes do evento listados abaixo. Ap&oacute;s a
                        revis&atilde;o, selecione a op&ccedil;&atilde;o correta abaixo.
                      </p>
                    </div>
                    <dl className="divide-y divide-gray-100">
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-center text-sm  font-medium leading-6 text-gray-900">
                          Nome
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {event.name}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-center text-sm  font-medium leading-6 text-gray-900">
                          Descrição
                        </dt>
                        <dd className="mt-1 text-sm  leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {event.description}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-center text-sm  font-medium leading-6 text-gray-900">
                          Data
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {dayjs(event.dateStart).format("DD/MM/YYYY - HH:mm")} à&nbsp;
                          {dayjs(event.dateEnd).format("DD/MM/YYYY - HH:mm")}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-center text-sm  font-medium leading-6 text-gray-900">
                          Local
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {event.location}
                        </dd>
                      </div>
                      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-center text-sm  font-medium leading-6 text-gray-900">
                          Observações
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {event.observations || "Sem observações"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
