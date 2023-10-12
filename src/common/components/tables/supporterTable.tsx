"use client";
import {
  ColumnDef,
  PaginationState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "../loadingSpinner";
import dayjs from "dayjs";
import useSWR, { SWRConfig, useSWRConfig } from "swr";
import { listSupporters } from "../../../resources/api/services/campaign";
import { url } from "inspector";
import { PanelContext } from "../../contexts/panel.ctx";
import { usePanel } from "../../hooks/usePanel";
import { parseSupporters } from "../../functions/parseSupporters";
import clsx from "clsx";
import { Section, User, Zone } from "@prisma/client";
import SupporterBall from "../supporterBall";
import WhatsAppIcon from "../icons/WhatsAppIcon";
import Link from "next/link";
import { AtSymbolIcon } from "@heroicons/react/24/outline";

export default function SupporterTable({
  originalData,
}: {
  originalData: { supporters: any; count: number };
}) {
  const { cache } = useSWRConfig();

  type SupporterTableType = {
    assignedAt: Date;
    campaignId: string;
    id: string;
    level: number;
    referral: any;
    referralId: string;
    referred: any;
    user: {
      email: string;
      id: string;
      info: {
        Section: Section;
        Zone: Zone;
        birthDate: null;
        cityId: string;
        partyId?: string;
        phone: string;
        sectionId: string;
        stateId: null;
        userId: string;
        zoneId: string;
      };
      name: string;
      role: string;
      referral: {
        user: { email: string; id: string; name: string; role: string };
      };
    };
    userId: string;
    options: any;
  };

  const columnHelper = createColumnHelper<SupporterTableType>();

  const supporterTableColumns = [
    columnHelper.accessor("user.name", {
      id: "name",
      header: "Nome",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("referral", {
      id: "referral",
      header: "Indicado por",
      cell: (info) => (
        <div className="mt-1 flex items-center gap-x-1.5 text-sm text-gray-500">
          {info.getValue().user.name}{" "}
          <SupporterBall level={info.getValue()?.level} />
        </div>
      ),
    }),
    columnHelper.accessor("user.info.Zone.number", {
      id: "zone",
      header: "Zona",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("user.info.Section.number", {
      id: "section",
      header: "Seção",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("assignedAt", {
      id: "assignedAt",
      header: "Entrou em",
      cell: (info) => dayjs(info.getValue()).format("DD/MM/YYYY"),
    }),
    columnHelper.accessor("user", {
      id: "options",
      header: "Opções",
      cell: (info) => (
        <div className="flex gap-x-3">
          <a
            href={`https://wa.me/${info.getValue().info.phone}`}
            target="_blank"
          >
            <WhatsAppIcon className="fill-gray-400 h-5 w-5 hover:fill-gray-500" />
          </a>
          <a href={`mailto:${info.getValue().email}`} target="_blank">
            <AtSymbolIcon className="text-gray-400 h-[1.45rem] w-[1.45rem] hover:text-gray-500" />
          </a>
        </div>
      ),
    }),
  ];

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  /*   function getCachedData() {
    const key = `#pagination:#pageSize:${pageSize},pageIndex:${pageIndex},,`;
    return cache.get(key)?.data;
  } */

  function parseCachedData() {
    const key = `#pagination:#pageSize:${pageSize},pageIndex:${pageIndex},,`;
    const cachedData = cache.get(key)?.data;
    return cachedData ? cachedData.supporters : defaultData;
  }

  const defaultData = useMemo(() => originalData.supporters, []);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const { data, isLoading } = useSWR(
    pageIndex !== 0 &&
      !cache.get(
        `#pagination:#pageSize:${pageSize},pageIndex:${pageIndex},,`
      ) && {
        pagination,
      },
    listSupporters,
    {}
  );

  const table = useReactTable({
    data: parseCachedData(),
    columns: supporterTableColumns,
    pageCount: Math.ceil(originalData.count / pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const pages = Array.from(Array(table.getPageCount()).keys());

  if (isLoading)
    return (
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
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
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td colSpan={5}>
                    <div className="flex justify-center mt-4">
                      <LoadingSpinner />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

  return (
    <SWRConfig value={{ provider: () => new Map([]) }}>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {table.getRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td
                            key={cell.id}
                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-900"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex w- items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <a
                  href="#"
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </a>
                <a
                  href="#"
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </a>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <span className="flex items-center gap-1">
                  <div>Página</div>
                  <strong>
                    {table.getState().pagination.pageIndex + 1} de{" "}
                    {table.getPageCount()}
                  </strong>
                </span>
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{" "}
                    <span className="font-medium">
                      {data?.supporters?.length ||
                        originalData.supporters.length ||
                        0}
                    </span>{" "}
                    de <span className="font-medium">{originalData.count}</span>{" "}
                    apoiadores
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
                    {pages.map((page) => (
                      <a
                        key={`page-${page}`}
                        href="#"
                        onClick={() => table.setPageIndex(page)}
                        aria-current="page"
                        className={clsx(
                          pageIndex === page
                            ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        )}
                      >
                        {page + 1}
                      </a>
                    ))}
                    <button
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SWRConfig>
  );
}
