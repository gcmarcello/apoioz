"use client";

import SupporterBall from "@/frontend/shared/components/supporterBall";
import { usePanel } from "@/frontend/shared/hooks/usePanel";
import dayjs from "dayjs";
import Link from "next/link";
import { useState, useEffect } from "react";
import SupporterOverview from "./supporterOverview";
import { Date } from "@/frontend/shared/components/date";

export default function LatestSupporters({
  userId,
  supporters,
}: {
  userId: string;
  supporters: any;
}) {
  const { fetchLatestSupporters, campaign, user } = usePanel();
  const [latestSupporters, setLatestSupporters] = useState(
    supporters.supporters
  );

  return (
    <div className="mt-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Novos Apoiadores
          </h1>
          <div className="flex gap-1 items-center">
            <p className="mt-1 text-sm text-gray-700">
              Uma lista dos apoiadores adicionados desde
            </p>
            <Date
              className="mt-1 text-sm text-gray-700"
              value={dayjs()
                .subtract(1, "week")
                .subtract(4, "hours")
                .format("DD/MM/YYYY")}
            />
          </div>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link href="/relatorios">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Ver Todos
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Indicado por
                    </th>
                    <th
                      scope="col"
                      className="px-3 hidden lg:table-cell py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Zona
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 hidden lg:table-cell text-left text-sm font-semibold text-gray-900"
                    >
                      Seção
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {latestSupporters &&
                    typeof latestSupporters !== "number" &&
                    latestSupporters.map((supporter: any, index: number) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {supporter.user.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="mt-1 flex items-center gap-x-1.5">
                            {supporter.referral ? (
                              <>
                                {supporter.referral?.user.name}
                                <SupporterBall
                                  level={supporter.referral?.level}
                                />
                              </>
                            ) : (
                              <>
                                Líder
                                <SupporterBall level={4} />
                              </>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap hidden lg:table-cell px-3 py-4 text-sm text-gray-500">
                          {supporter.user.info?.Zone?.number}
                        </td>
                        <td className="whitespace-nowrap hidden lg:table-cell px-3 py-4 text-sm text-gray-500">
                          {supporter.user.info?.Section?.number}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <SupporterOverview supporter={supporter} />
                        </td>
                      </tr>
                    ))}
                  {typeof supporters === "number" && (
                    <tr>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm  text-gray-900 sm:pl-6">
                        Mais {supporters} apoiadores se juntaram à campanha na
                        última semana!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
