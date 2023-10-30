"use client";

import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { useState, Fragment } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import { ButtonSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { deactivateCampaign } from "@/app/api/panel/campaigns/actions";

const userNavigation = [{ name: "Meu Perfil", href: "#" }];

export function SupporterTopBar() {
  const { user, campaign, setVisibility } = useSidebar();

  return (
    <div className="sticky top-0 z-10 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:ml-64 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() =>
          setVisibility((prev) => ({
            ...prev,
            panelSidebar: true,
          }))
        }
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      {/* Separator */}
      <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex min-w-0 flex-1 pt-[1.65rem] md:pt-5">
          <h2 className="flex text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Campanha
            <span className="ms-1 hidden md:inline-block">- {campaign.name}</span>
          </h2>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            onClick={async () =>
              setVisibility((prev) => ({
                ...prev,
                supporterSidebar: true,
              }))
            }
          >
            <span className="sr-only">View notifications</span>
            <PlusCircleIcon className="h-8 w-8" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              <Image
                width={32}
                height={32}
                className="rounded-full bg-gray-50"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="hidden lg:flex lg:items-center">
                <span
                  className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                  aria-hidden="true"
                >
                  {user?.name || <ButtonSpinner />}
                </span>
                <ChevronDownIcon
                  className="ml-2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }: { active: any }) => (
                      <a
                        href={item.href}
                        className={clsx(
                          active ? "bg-gray-50" : "",
                          "block px-3 py-1 text-sm leading-6 text-gray-900"
                        )}
                      >
                        {item.name}
                      </a>
                    )}
                  </Menu.Item>
                ))}

                <Menu.Item>
                  {({ active }: { active: any }) => (
                    <a
                      href={"#"}
                      onClick={async () => {
                        deactivateCampaign();
                      }}
                      className={clsx(
                        active ? "bg-gray-50" : "",
                        "block px-3 py-1 text-sm leading-6 text-gray-900"
                      )}
                    >
                      Alterar Campanha
                    </a>
                  )}
                </Menu.Item>
                <hr className="my-2" />
                <Menu.Item>
                  {({ active }: { active: any }) => (
                    <a
                      href={"/login"}
                      onClick={() =>
                        (document.cookie =
                          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;")
                      }
                      className={clsx(
                        active ? "bg-gray-50" : "",
                        "block px-3 py-1 text-sm leading-6 text-gray-900"
                      )}
                    >
                      Logout
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}
