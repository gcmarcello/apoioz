"use client";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { Fragment } from "react";
import { useFloating, shift } from "@floating-ui/react";
import { SupporterType } from "../../../common/types/userTypes";
import { formatPhone, toProperCase } from "../../../common/utils/format";

export default function SupporterOverview({
  supporter,
}: {
  supporter: SupporterType;
}) {
  const { refs, floatingStyles } = useFloating({
    middleware: [shift()],
  });

  const menuItems = [
    { name: "Nome", info: supporter?.user?.name },
    { name: "WhatsApp", info: formatPhone(supporter?.user?.info?.phone || "") },
    {
      name: "Cidade",
      info: toProperCase(supporter?.user?.info?.Zone?.City?.name || ""),
    },
    { name: "Indicado por", info: supporter?.referral?.name },
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          ref={refs.setReference}
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-indigo-600  ring-gray-300 hover:bg-gray-50"
        >
          Mais
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
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
        <Menu.Items
          ref={refs.setFloating}
          style={floatingStyles}
          className="fixed right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="py-1">
            {menuItems.map((item, index) => (
              <Menu.Item key={index}>
                <div id={supporter.id} className="flex w-full px-4 py-2 gap-2">
                  <div className="text-gray-700 block  text-left text-sm">
                    {item.name}
                  </div>
                  <div>{item.info}</div>
                </div>
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
