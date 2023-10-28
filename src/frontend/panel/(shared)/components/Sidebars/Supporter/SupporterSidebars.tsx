"use client";
import { Dispatch, Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LinkIcon } from "@heroicons/react/20/solid";
import toast, { Toaster } from "react-hot-toast";
import { ShareSupporter } from "./ShareSupporter";
import { AddSupporterForm } from "./AddSupporter";
import { useSidebar } from "../../../hooks/useSidebar";
import { useForm } from "react-hook-form";
import {
  CreateSupportersDto,
  createSupportersDto,
} from "@/backend/dto/schemas/supporters/supporters";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import { createSupporter } from "@/backend/resources/supporters/supporters.actions";
import { useToast } from "@/frontend/(shared)/components/hooks/useToast";
import { showToast } from "@/frontend/(shared)/components/alerts/toast";

export default function SupporterSideBar() {
  const { user, campaign, visibility, setVisibility } = useSidebar();
  const [options, setOptions] = useState<{
    current: {
      key: string;
      submitter: Dispatch<any> | undefined;
    };
    previous: string | undefined;
  }>
  ({
    current: {
      key: "start",
      submitter: undefined,
    },
    previous: undefined
  });

  const setCurrentOption = (key: string, submitter: Dispatch<any> | undefined) => {
    setOptions(prev => ({
      previous: prev.current.key,
      'current': {
        key,
        submitter
      }
    }))
  }

  /* useEffect(() => {
    if (supporter) {
      setVisibility((prev) => ({
        ...prev,
        supporterSidebar: false,
      }));
    }
  }, [supporter, setVisibility]); */

  return (
    <>
      <Transition.Root
        show={visibility.supporterSidebar}
        afterLeave={() => {
          setOptions((prev) => ({
            ...prev,
            start: {
              ...prev.start,
              current: true,
            },
          }))
        }}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() =>
            setVisibility((prev) => ({
              ...prev,
              supporterSidebar: false,
            }))
          }
        >
          <div className="fixed inset-0" />

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
                    <form
                      onSubmit={}
                      className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                    >
                      <div className="h-0 flex-1 overflow-y-auto">
                        <div className="bg-indigo-700 px-4 py-6 sm:px-6">
                          <div className="flex items-center justify-between">
                            <Dialog.Title className="text-base font-semibold leading-6 text-white">
                              Adicionar Apoiador
                            </Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                              <button
                                type="button"
                                className="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                onClick={() =>
                                  setVisibility((prev) => ({
                                    ...prev,
                                    supporterSidebar: false,
                                  }))
                                }
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-1">
                            <p className="text-sm text-indigo-300">
                              Complete os campos e faça parte da transformação.
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="divide-y divide-gray-200 px-4 sm:px-6">
                            {options.start.current && (
                              <div className="flex flex-col gap-8 pb-4 pt-20">
                                <button
                                  onClick={() => setOptions(prev => ({
                                    ...prev,
                                    add: {
                                      ...prev.add,
                                      current: true
                                    },
                                  }))}
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
                            {option === "add" && (
                              <AddSupporterForm campaign={campaign} form={form} />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 justify-end px-4 py-4">
                        <button
                          type="button"
                          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                          onClick={() => {
                            if (option === "choose") {
                              setVisibility((prev) => ({
                                ...prev,
                                supporterSidebar: false,
                              }));
                            }
                            if (option === "add") {
                              setOption("choose");
                            }
                          }}
                        >
                          Voltar
                        </button>
                        {
                          option === 'add' && 
                        }
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div></div>
    </>
  );
}
