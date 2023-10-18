"use client";
import { useFloating, shift, offset } from "@floating-ui/react";
import { formatPhone, toProperCase } from "@/shared/utils/format";

export default function SupporterOverview({ supporter }: { supporter: any }) {
  const { refs, floatingStyles } = useFloating({
    middleware: [shift()],
  });

  const menuItems = [
    { name: "Nome", info: supporter?.user?.name },
    { name: "WhatsApp", info: formatPhone(supporter?.user?.info?.phone || "") },
    {
      name: "Cidade",
      info: toProperCase(supporter?.user?.info?.City?.name || ""),
    },
    { name: "Indicado por", info: supporter?.referral?.user.name },
  ];

  if (!menuItems) return;

  return (
    <div
      ref={refs.setFloating}
      className="duration-200 right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div className="py-1">
        {menuItems.map((item, index) => (
          <div key={index}>
            <div id={supporter?.id} className="flex w-full px-4 py-2 gap-2">
              <div className="text-gray-700 block  text-left text-sm">
                {item.name}
              </div>
              <div>{item.info}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
