"use client";
import { TextField } from "@/app/(frontend)/_shared/components/fields/Text";
import { useForm } from "react-hook-form";
import {
  CheckIcon,
  ClipboardDocumentIcon,
  HandThumbUpIcon,
  RocketLaunchIcon,
  ShareIcon,
  UserIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { SectionTitle } from "@/app/(frontend)/_shared/components/text/SectionTitle";
import Paragraph from "@/app/(frontend)/_shared/components/text/Paragraph";
import clsx from "clsx";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import {
  UpsertWhatsappDto,
  upsertWhatsappDto,
} from "@/app/api/panel/whatsapp/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertWhatsapp } from "@/app/api/panel/whatsapp/action";
import { useAction } from "odinkit/hooks/useAction";
import { For } from "@/app/(frontend)/_shared/components/For";
import {
  ButtonSpinner,
  LoadingSpinner,
} from "@/app/(frontend)/_shared/components/Spinners";
import { useState } from "react";

export default function WhatsappForm() {
  const { data, trigger, isMutating } = useAction({
    action: upsertWhatsapp,
    onSuccess: (data) => console.log(data),
    onError: (error) => setSuccessOnAdding(true),
  });
  const [successOnAdding, setSuccessOnAdding] = useState(false);

  const form = useForm<UpsertWhatsappDto>({
    mode: "onChange",
    resolver: zodResolver(upsertWhatsappDto),
    defaultValues: {
      channel: {
        url: "",
        public: false,
      },
      group: {
        url: "",
        public: false,
      },
    },
  });

  const timeline = [
    {
      id: 1,
      show: true,
      content: !successOnAdding ? (
        <div className="space-y-3">
          <TextField
            label="Copie o link de convite do grupo"
            hform={form}
            name={"group.url"}
            disabled={successOnAdding}
          />
          <TextField
            label="Copie o link de convite do canal (opcional)"
            hform={form}
            name={"channel.url"}
            disabled={successOnAdding}
          />
        </div>
      ) : (
        "xd"
      ),

      href: "#",
      icon: ClipboardDocumentIcon,
      iconBackground: "bg-gray-400",
    },
    {
      id: 2,
      show:
        !form.getFieldState("group.url").invalid && !!form.watch("group.url"),
      content: (
        <>
          Envie o convite para o nosso robô{" "}
          <button
            disabled={isMutating}
            type="submit"
            className="inline-flex items-center gap-2 font-medium text-black hover:text-gray-700"
          >
            clicando aqui.
            {isMutating && <ButtonSpinner />}
          </button>
        </>
      ),
      icon: RocketLaunchIcon,
      iconBackground: "bg-blue-500",
    },
    {
      id: 3,
      show: successOnAdding,
      content:
        "Promova o robô a administrador do grupo para que ele possa enviar links de convite para novos participantes.",
      href: "#",
      icon: UserPlusIcon,
      iconBackground: "bg-green-500",
    },
  ];

  return (
    <>
      <div className="col-span-full flex flex-col items-center justify-center lg:col-span-1">
        <SectionTitle className="w-full text-start">
          Convidar novos apoiadores
        </SectionTitle>
        <Paragraph className="my-4 w-full text-start">
          Você ainda não configurou seu grupo e canal no WhatsApp. Para começar,
          é muito simples:
        </Paragraph>
        <form
          onSubmit={form.handleSubmit((data) => trigger(data))}
          className="mb-10 flow-root min-w-full"
        >
          <ul role="list" className="-mb-8">
            <For each={timeline} identifier="events">
              {(
                { show, iconBackground, icon: Icon, content, id, href },
                index
              ) => (
                <Transition
                  show={show}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-0 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <li>
                    <div className="relative pb-8">
                      {index !== timeline.length - 1 &&
                      timeline[(index as number) + 1].show ? (
                        <span
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={clsx(
                              iconBackground,
                              "flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white"
                            )}
                          >
                            <Icon
                              className="h-5 w-5 text-white"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div className="w-full">
                            <div className="text-sm text-gray-500">
                              {content}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </Transition>
              )}
            </For>
          </ul>
        </form>
        <Paragraph className="mt-6 text-start">
          Se preferir, você pode compartilhar o link de convite diretamente pelo
          WhatsApp para vários contatos ao mesmo tempo:
        </Paragraph>
        <Link href={`https://wa.me/?text=a`} className="w-full" target="_blank">
          <div className="my-4 flex justify-center space-x-2 rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:bg-green-400">
            <svg
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 fill-white"
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <div>Compartilhar no WhatsApp</div>
          </div>
        </Link>
      </div>
    </>
  );
}
