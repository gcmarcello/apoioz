"use client";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

import { useEffect, useState } from "react";
import { Campaign, User } from "@prisma/client";
import { generateMainPageStats } from "@/app/api/panel/campaigns/actions";
import { ReadPollsStats } from "@/app/api/panel/polls/dto";

export default function StatsSection({ stats }: { stats: ReadPollsStats }) {
  if (!stats)
    return (
      <div>
        <dl
          className={`mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0`}
        >
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900"></dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex animate-pulse items-baseline text-2xl font-semibold text-indigo-600">
                Carregando...
                <span className="ml-2 text-clip text-sm font-medium text-gray-500"></span>
              </div>
            </dd>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900"></dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex animate-pulse items-baseline text-2xl font-semibold text-indigo-600">
                Carregando...
                <span className="ml-2 text-clip text-sm font-medium text-gray-500"></span>
              </div>
            </dd>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900"></dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex animate-pulse items-baseline text-2xl font-semibold text-indigo-600">
                Carregando...
                <span className="ml-2 text-clip text-sm font-medium text-gray-500"></span>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    );

  return (
    <div>
      <dl
        className={`mt-5 grid grid-cols-${stats.length} divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-${stats.length} md:divide-x md:divide-y-0`}
      >
        {stats.map((item) => (
          <div key={item.name} className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900">{item.name}</dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="items-baseline text-2xl font-semibold text-indigo-600">
                {item.stat}
                <span className="ml-2 text-clip text-sm font-medium text-gray-500">
                  {item.previousStat} {item.changeText}
                </span>
              </div>

              {
                <div
                  className={clsx(
                    item.changeType === "increase"
                      ? "bg-green-100 text-green-800"
                      : item.changeType
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-600",
                    "inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0"
                  )}
                >
                  {item.changeType === "increase" ? (
                    <ArrowUpIcon
                      className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                      aria-hidden="true"
                    />
                  ) : item.changeType ? (
                    <ArrowDownIcon
                      className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                      aria-hidden="true"
                    />
                  ) : (
                    ""
                  )}
                  <span className="sr-only">
                    {" "}
                    {item.changeType === "increase" ? "Increased" : "Decreased"} by{" "}
                  </span>
                  {item.change}%
                </div>
              }
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
