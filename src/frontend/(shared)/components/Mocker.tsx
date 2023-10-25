"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import {
  ArrowPathIcon,
  PaperAirplaneIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/solid";

export function Mocker({ mockData, submit }: { mockData?: any; submit?: any }) {
  const [isFolded, setIsFolded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
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
          {isSubmitting ? (
            <PaperAirplaneIcon
              width={35}
              height={35}
              className="pointer-events-none animate-spin text-gray-500"
            />
          ) : (
            <PaperAirplaneIcon
              width={35}
              height={35}
              onClick={() => {
                setIsSubmitting(true);
                setTimeout(async () => {
                  await submit();
                  setIsSubmitting((prev) => !prev);
                }, 500);
              }}
              className="text-red-500 hover:cursor-pointer"
            />
          )}
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
  );
}
