"use client";
import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MapIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import SupporterSideBar from "./Supporter/SupporterSidebars";
import { usePathname, useRouter } from "next/navigation";
import { Campaign, User } from "@prisma/client";
import { useSidebar } from "./lib/useSidebar";
import Link from "next/link";
import WhatsAppIcon from "@/app/(frontend)/_shared/components/icons/WhatsAppIcon";
import { activateCampaign } from "@/app/api/panel/campaigns/actions";

export default function PanelSideBar() {
  const {
    user,
    campaign,
    visibility,
    setVisibility,
    primaryColor,
    secondaryColor,
    campaigns,
  } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const parsedCampaigns = campaigns?.map((campaign, index) => ({
    id: campaign.id,
    name: campaign.name,
    initial: campaign.name[0],
    current: false,
  }));

  const navigation = [
    {
      name: "Painel",
      href: `/painel/`,
      icon: HomeIcon,
      current: !pathname.includes("painel/"),
    },
    {
      name: "Time",
      href: `/painel/time`,
      icon: UsersIcon,
      current: pathname.includes("/time"),
    },

    {
      name: "Mapa",
      href: `/painel/mapa`,
      icon: MapIcon,
      current: pathname.includes("/mapa"),
    },
    {
      name: "Calendário",
      href: `/painel/calendario`,
      icon: CalendarIcon,
      current: pathname.includes("/calendario"),
    },
    {
      name: "Relatórios",
      href: `/painel/relatorios`,
      icon: ChartPieIcon,
      current: pathname.includes("/relatorios"),
    },
    {
      name: "Whatsapp",
      href: `/painel/whatsapp`,
      icon: WhatsAppIcon,
      current: pathname.includes("/whatsapp"),
    },
  ];

  if (!campaign) return;
  return (
    <>
      <div className="absolute w-64 overflow-clip">
        <Transition.Root show={visibility.panelSidebar} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={() =>
              setVisibility((prev) => ({
                ...prev,
                panelSidebar: false,
              }))
            }
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5 sm:left-13/16">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() =>
                          setVisibility((prev) => ({
                            ...prev,
                            panelSidebar: false,
                          }))
                        }
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div
                    className={clsx(
                      "bg-indigo-600",
                      "fixed flex h-full w-64 grow flex-col gap-y-5 overflow-y-auto  px-6 pb-4"
                    )}
                  >
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        width={32}
                        height={32}
                        src="https://tailwindui.com/img/logos/mark.svg?color=white"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={clsx(
                                    item.current
                                      ? `bg-indigo-700 text-white`
                                      : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                  )}
                                >
                                  <item.icon
                                    className={clsx(
                                      item.current
                                        ? "text-white"
                                        : "text-indigo-200 group-hover:text-white",
                                      item.icon === WhatsAppIcon &&
                                        "me-1 h-[1.3rem] w-[1.3rem] fill-indigo-200",

                                      "h-6 w-6 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-indigo-200">
                            Suas Campanhas
                          </div>
                          {parsedCampaigns && (
                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                              {parsedCampaigns.map((team) => (
                                <li key={team.name}>
                                  <div
                                    role="button"
                                    onClick={() => {
                                      activateCampaign(team.id);
                                      router.push("/painel");
                                    }}
                                    className={clsx(
                                      team.current
                                        ? "bg-indigo-700 text-white"
                                        : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    )}
                                  >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                                      {team.initial}
                                    </span>
                                    <span className="truncate">{team.name}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                        <li className="mt-auto">
                          <Link
                            href="/painel/configuracoes"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                          >
                            <Cog6ToothIcon
                              className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                              aria-hidden="true"
                            />
                            Configurações
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="hidden lg:flex lg:h-screen lg:w-64 lg:flex-col">
          <div
            className={clsx(
              "bg-indigo-600",
              `fixed flex h-full w-64 grow flex-col gap-y-5 overflow-y-auto px-6 pb-4`
            )}
          >
            <div className="flex h-16 shrink-0 items-center">
              <img
                width={32}
                height={32}
                src="https://tailwindui.com/img/logos/mark.svg?color=white"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={clsx(
                            item.current
                              ? "bg-indigo-700 text-white"
                              : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                            "leading-6, group flex gap-x-3 rounded-md p-2 text-sm font-semibold"
                          )}
                        >
                          <item.icon
                            className={clsx(
                              item.current
                                ? "text-white"
                                : "text-indigo-200 group-hover:text-white",
                              item.icon === WhatsAppIcon &&
                                "me-1 h-[1.3rem] w-[1.3rem] fill-indigo-200",

                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-indigo-200">
                    Suas Campanhas
                  </div>
                  {parsedCampaigns && (
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {parsedCampaigns.map((team) => (
                        <li key={team.name}>
                          <div
                            role="button"
                            onClick={() => {
                              activateCampaign(team.id);
                              router.push("/painel");
                            }}
                            className={clsx(
                              team.current
                                ? "bg-indigo-700 text-white"
                                : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                            )}
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                              {team.initial}
                            </span>
                            <span className="truncate">{team.name}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                <li className="mt-auto">
                  <Link
                    href="/painel/configuracoes"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                  >
                    <Cog6ToothIcon
                      className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                      aria-hidden="true"
                    />
                    Configurações
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
