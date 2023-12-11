"use client";
import { deactivateCampaign } from "@/app/api/panel/campaigns/actions";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import Image from "next/image";
import { Fragment } from "react";
import { ButtonSpinner } from "../Spinners";
import { User } from "@prisma/client";
import { UserWithoutPassword } from "prisma/types/User";
import Link from "next/link";
import { getEnv } from "@/_shared/utils/settings";

export default function ProfileDropdown({ user }: { user: UserWithoutPassword }) {
  const userNavigation = [
    {
      name: "Meu Perfil",
      href: "/painel/configuracoes",
    },
  ];

  return (
    <Menu as="div" className="relative z-50">
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
          <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 z-50 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          {userNavigation.map((item) => (
            <Menu.Item key={item.name}>
              {({ active }: { active: any }) => (
                <Link
                  href={item.href}
                  className={clsx(
                    active ? "bg-gray-50" : "",
                    "block px-3 py-1 text-sm leading-6 text-gray-900"
                  )}
                >
                  {item.name}
                </Link>
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
  );
}
