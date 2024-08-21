"use client";
import { formatPhone, toProperCase } from "@/_shared/utils/format";
import { useFloating, shift, offset } from "@floating-ui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import {
  SupporterWithReferralUser,
  SupporterWithUserInfo,
} from "prisma/types/Supporter";

export default function SupporterOverview({
  supporter,
}: {
  supporter: SupporterWithUserInfo & SupporterWithReferralUser;
}) {
  const { refs, floatingStyles } = useFloating({
    middleware: [shift()],
  });
  const menuItems = [
    { name: "Nome", info: supporter?.user?.name },
    { name: "WhatsApp", info: formatPhone(supporter?.user?.phone || "") },
    /**{
      name: "Cidade",
      info: toProperCase(supporter?.user?.info?.City?.name || ""),
    }, */
    { name: "Indicado por", info: supporter?.referral?.user.name },
  ];

  if (!menuItems) return;

  return (
    <div className="group">
      <button className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-rose-600  ring-gray-300 hover:bg-gray-50">
        Mais
        <ChevronDownIcon
          className="-mr-1 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </button>
      <div className="absolute right-0 z-50 mt-2 hidden origin-top-right rounded-md  bg-white shadow-lg ring-1 ring-black ring-opacity-5 duration-200 focus:outline-none group-hover:block">
        <div className="py-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              <div id={supporter?.id} className="flex w-full gap-2 px-4 py-2">
                <div className="block text-left  text-sm text-gray-700">
                  {item.name}
                </div>
                <div>{item.info}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
