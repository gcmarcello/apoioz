"use client";
import { Dispatch, Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LinkIcon } from "@heroicons/react/20/solid";

import { Campaign, Prisma, Section, User, Zone } from "@prisma/client";
import { ShareSupporter } from "./ShareSupporter";
import { AddSupporterForm } from "./AddSupporter";
import { useSidebar } from "../../../hooks/useSidebar";

export default function SupporterSideBar() {
  const [option, setOption] = useState<string | null>("choose");
  const { user, campaign, visibility, setVisibility } = useSidebar();

  return (
    <>
      <Transition.Root
        show={visibility.supporterSidebar}
        afterLeave={() => {
          setOption("choose");
        }}
      >
        <Dialog
          as="div"
          className="relative z-40"
          onClose={() =>
            setVisibility((prev) => ({
              ...prev,
              supporterSidebar: false,
            }))
          }
        >
          <div className="fixed inset-0" />
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="fixed h-full w-full bg-white">
                        <div className="w-full bg-indigo-700 px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-white">
                              Adicionar Apoiador
                            </Dialog.Title>
                            <button
                              type="button"
                              className="relative ml-3 flex h-7 items-center rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() =>
                                setVisibility((prev) => ({
                                  ...prev,
                                  supporterSidebar: false,
                                }))
                              }
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Fechar menu</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                          <p className="mt-1 text-sm text-indigo-300">
                            Complete os campos e faça parte da transformação.
                          </p>
                        </div>
                        <div className=" flex flex-1 flex-col justify-between ">
                          <div className="divide-y divide-gray-200 px-4 sm:px-6">
                            {option === "choose" && (
                              <div className="flex flex-col gap-8 pb-4 pt-20">
                                <button
                                  onClick={() => setOption("add")}
                                  type="button"
                                  className="mx-auto rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                  <UserPlusIcon className="h-30 w-30 text-indigo-500 group-hover:text-indigo-900" />
                                  Adicionar Apoiador
                                </button>
                                <button
                                  onClick={() => setOption("share")}
                                  type="button"
                                  className="mx-auto rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                  <LinkIcon className="h-30 w-30 text-gray-400 group-hover:text-gray-500" />
                                  Compartilhar Link
                                </button>
                              </div>
                            )}
                            {option === "share" && (
                              <ShareSupporter user={user} campaign={campaign} />
                            )}
                            {option === "add" && <AddSupporterForm campaign={campaign} />}
                          </div>
                        </div>
                        <div className="flex flex-shrink-0 items-center justify-end  px-4 py-4">
                          <button
                            type="button"
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => {
                              if (option != "choose") {
                                setOption("choose");
                              } else
                                setVisibility((prev) => ({
                                  ...prev,
                                  supporterSidebar: false,
                                }));
                            }}
                          >
                            Voltar
                          </button>

                          {option === "add" && (
                            <button
                              type="submit"
                              className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                              Salvar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
