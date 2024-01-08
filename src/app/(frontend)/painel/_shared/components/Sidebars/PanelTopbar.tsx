"use client";

import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { useState, Fragment, useEffect } from "react";
import { useSidebar } from "./lib/useSidebar";
import { ButtonSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { deactivateCampaign } from "@/app/api/panel/campaigns/actions";
import { usePathname } from "next/navigation";
import { getPageName } from "../../utils/pageName";
import ProfileDropdown from "@/app/(frontend)/_shared/components/navigation/ProfileDropdown";

export function SupporterTopBar() {
  const { user, campaign, setVisibility } = useSidebar();
  const pathname = usePathname();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.altKey && event.shiftKey && event.key === "S") {
      (async () => {
        setVisibility((prev) => ({
          ...prev,
          supporterSidebar: !prev.supporterSidebar,
        }));
      })();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => handleKeyDown(e));
    return () => {
      window.removeEventListener("keydown", (e) => handleKeyDown(e));
    };
  }, []);

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
            <span className="block md:hidden">
              {getPageName(pathname, true)}
            </span>
            <span className="hidden md:block">{getPageName(pathname)}</span>
            <span className="ms-1 hidden md:inline-block">
              - {campaign.name}
            </span>
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
            <div className="flex items-center justify-center gap-2">
              <PlusCircleIcon className="h-8 w-8" aria-hidden="true" />{" "}
              <span className="sr-only">Adicionar Apoiador</span>
            </div>
          </button>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
          <ProfileDropdown user={user} />
        </div>
      </div>
    </div>
  );
}
