import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import { readSectionsByAddress } from "@/app/api/elections/sections/action";
import { MapAddressType } from "../providers/MapDataProvider";
import { toProperCase } from "@/_shared/utils/format";
import { For } from "@/app/(frontend)/_shared/components/For";
import { useAction } from "odinkit/hooks/useAction";

export default function AddressDetailsModal({
  address,
  setSelectedAddress,
}: {
  setSelectedAddress: Dispatch<SetStateAction<MapAddressType | undefined>>;
  address: MapAddressType | undefined;
}) {
  const { data, trigger } = useAction({
    action: readSectionsByAddress,
    onError: (error) => {
      showToast({
        message: error,
        title: "Erro ao carregar seções",
        variant: "error",
      });
    },
  });

  useEffect(() => {
    if (!address?.id) return;
    trigger(address.id);
  }, [address]);

  return (
    <Transition.Root show={Boolean(address)} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setSelectedAddress(undefined)}
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
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:max-w-sm sm:p-6">
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
                      {toProperCase(address?.location || "")}
                    </Dialog.Title>
                    <div className="mt-1">
                      <p className="text-sm text-gray-500">
                        {toProperCase(address?.address || "")}
                      </p>
                    </div>
                  </div>
                  <ul
                    role="list"
                    className="mt-4 max-h-[300px] divide-y divide-gray-100 overflow-y-scroll"
                  >
                    <For
                      each={data?.sort(
                        (b, a) => a.Supporter.length - b.Supporter.length
                      )}
                    >
                      {({ number, Supporter }) => {
                        return (
                          <li
                            key={number}
                            className="flex justify-between gap-x-6 py-5"
                          >
                            <div className="flex min-w-0 gap-x-4">
                              <div className="min-w-0 flex-auto">
                                <p className="text-sm font-semibold leading-6 text-gray-900">
                                  Seção {number}
                                </p>
                                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                                  {Supporter.length} Apoiador
                                  {Supporter.length > 1 ? "es" : ""}
                                </p>
                              </div>
                            </div>
                            {/* <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                            <p className="text-sm leading-6 text-gray-900">
                              {person.role}
                            </p>
                            {person.lastSeen ? (
                              <p className="mt-1 text-xs leading-5 text-gray-500">
                                Last seen{" "}
                                <time dateTime={person.lastSeenDateTime}>
                                  {person.lastSeen}
                                </time>
                              </p>
                            ) : (
                              <div className="mt-1 flex items-center gap-x-1.5">
                                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                </div>
                                <p className="text-xs leading-5 text-gray-500">
                                  Online
                                </p>
                              </div>
                            )}
                          </div> */}
                          </li>
                        );
                      }}
                    </For>
                  </ul>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setSelectedAddress(undefined)}
                  >
                    Voltar ao Mapa
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
