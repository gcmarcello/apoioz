"use client";
import { Fragment, useId, useState } from "react";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon, LinkIcon } from "@heroicons/react/20/solid";
import { ShareSupporter } from "./ShareSupporter";
import { AddSupporterForm } from "./AddSupporter";
import { useSidebar } from "../lib/useSidebar";
import { ButtonSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import { addSupporter } from "@/app/api/panel/supporters/actions";
import { addSupporterDto } from "@/app/api/panel/supporters/dto";
import { Button, Form, SubmitButton, useAction, useForm } from "odinkit/client";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";

export default function SupporterSideBar() {
  const {
    supporter: userSupporter,
    visibility,
    setVisibility,
    campaign,
  } = useSidebar();

  const [isAdminOptions, setIsAdminOptions] = useState(false);

  const addSupporterForm = useForm({
    schema: addSupporterDto,
    mode: "onChange",
  });

  const {
    data: supporter,
    trigger: addSupporterTrigger,
    isMutating: isAddingSupporter,
  } = useAction({
    action: addSupporter,
    onError: (err) =>
      showToast({ message: err.message, variant: "error", title: "Erro" }),
    onSuccess: ({ data }) => {
      if (!data) return;
      showToast({
        message: `${data.user?.name} adicionado a campanha`,
        variant: "success",
        title: "Apoiador Adicionado",
      });
      addSupporterForm.reset();
    },
  });

  const screens = {
    start: (
      <div className="flex flex-col gap-8 pb-4 pt-20">
        <button
          onClick={() => setScreen("add")}
          type="button"
          className="mx-auto rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <UserPlusIcon className="h-30 w-30 text-rose-500 group-hover:text-rose-900" />
          Adicionar Apoiador
        </button>
        <button
          onClick={() => setScreen("share")}
          type="button"
          className="mx-auto rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <LinkIcon className="h-30 w-30 text-gray-400 group-hover:text-gray-500" />
          Compartilhar Link
        </button>
      </div>
    ),
    share: <ShareSupporter />,
    add: (
      <AddSupporterForm
        isAdminOptions={isAdminOptions}
        setIsAdminOptions={setIsAdminOptions}
      />
    ),
  };

  const [screen, setScreen] = useState<keyof typeof screens>("start");

  return (
    <>
      <Transition
        show={visibility.supporterSidebar}
        afterLeave={() => {
          addSupporterForm.reset();
          setScreen("start");
        }}
        as={"div"}
      >
        <Dialog as="div" className="relative " onClose={() => {}}>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-2 overflow-hidden">
              <span
                onClick={() => {
                  setVisibility((prev) => ({
                    ...prev,
                    supporterSidebar: false,
                  }));
                }}
                className=" h-screen w-screen bg-black bg-opacity-40"
              ></span>
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                <Transition.Child
                  as={Fragment}
                  key={"supporters-sidebar"}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-md">
                    <Form
                      className="h-full"
                      hform={addSupporterForm}
                      onSubmit={addSupporterTrigger}
                    >
                      <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                        <div className="h-0 flex-1 overflow-y-auto">
                          <div className="bg-rose-600 px-4 py-6 sm:px-6">
                            <div className="flex items-center justify-between">
                              <DialogTitle className="text-base font-semibold leading-6 text-white">
                                Adicionar Apoiador
                              </DialogTitle>
                              <div className="ml-3 flex h-7 items-center">
                                <button
                                  type="button"
                                  className="relative rounded-md bg-rose-600 text-rose-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                  onClick={() =>
                                    setVisibility((prev) => ({
                                      ...prev,
                                      supporterSidebar: false,
                                    }))
                                  }
                                >
                                  <span className="absolute -inset-2.5" />
                                  <span className="sr-only">Close panel</span>
                                  <XMarkIcon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </div>

                            <div className="mt-1">
                              <p className="text-sm text-rose-300">
                                {screen === "start"
                                  ? "Escolha como aumentar sua rede."
                                  : screen === "share"
                                    ? "Envie um link de convite para o apoiador."
                                    : "Complete os campos e faça parte da transformação."}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="divide-y divide-gray-200 px-4 sm:px-6">
                              {screens[screen]}
                            </div>
                          </div>
                        </div>
                        <div className="flex w-full justify-between gap-2 px-4 py-4">
                          <div className="flex  items-center ">
                            {screen === "add" && userSupporter.level >= 4 && (
                              <Button
                                type="button"
                                plain={true}
                                onClick={() => {
                                  setIsAdminOptions((prev) => !prev);
                                }}
                              >
                                <Cog6ToothIcon className="size-4 " />{" "}
                                <span className="hidden sm:block">
                                  Administrador
                                </span>
                              </Button>
                            )}
                          </div>
                          <div className="flex  items-center  justify-between gap-2 ">
                            <Button
                              type="button"
                              plain={true}
                              onClick={() => {
                                if (screen === "start") {
                                  setVisibility((prev) => ({
                                    ...prev,
                                    supporterSidebar: false,
                                  }));
                                }
                                if (screen === "share") {
                                  setScreen("start");
                                }
                                if (screen === "add") {
                                  setScreen("start");
                                  addSupporterForm.reset();
                                }
                              }}
                            >
                              Voltar
                            </Button>
                            {screen === "add" && (
                              <SubmitButton
                                type="submit"
                                disabled={isAddingSupporter}
                                color="rose"
                              >
                                <div className="flex items-center gap-2">
                                  Adicionar{" "}
                                </div>
                              </SubmitButton>
                            )}
                          </div>
                        </div>
                      </div>
                    </Form>
                  </DialogPanel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
