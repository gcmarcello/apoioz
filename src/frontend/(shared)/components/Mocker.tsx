"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import {
  ArrowPathIcon,
  PaperAirplaneIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/solid";

export function Mocker({
  mockData,
  submit,
}: {
  mockData: () => void;
  submit: () => void;
}) {
  const [isFolded, setIsFolded] = useState(false);

  return (
    <div className="fixed bottom-0 right-0 p-4">
      <div className="flex items-center gap-3 ">
        {isFolded ? (
          <ChevronLeftIcon
            width={35}
            height={35}
            className="text-gray-500 hover:cursor-pointer"
            onClick={() => setIsFolded(false)}
          />
        ) : (
          <>
            <ChevronRightIcon
              width={35}
              height={35}
              className="text-gray-500 hover:cursor-pointer"
              onClick={() => setIsFolded(true)}
            />
            <ArrowPathIcon
              width={35}
              height={35}
              onClick={() => {
                if (window) window.location.reload();
              }}
              className="text-emerald-500 hover:cursor-pointer"
            />
            <PaperAirplaneIcon
              width={35}
              height={35}
              onClick={submit}
              className="text-red-500 hover:cursor-pointer"
            />
            <img
              alt="mock data"
              onClick={mockData}
              className="hover:cursor-pointer "
              src="https://fakerjs.dev/logo.svg"
              width={35}
              height={35}
            />
          </>
        )}
      </div>
    </div>
  );
}
