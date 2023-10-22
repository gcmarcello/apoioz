"use client";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import LoadingSpinner from "../loadingSpinner";
import dayjs from "dayjs";
import useSWR, { SWRConfig, useSWRConfig } from "swr";
import clsx from "clsx";
import { Section, User, Zone } from "@prisma/client";
import SupporterBall from "../../../panel/(shared)/components/supporterBall";
import WhatsAppIcon from "../icons/WhatsAppIcon";
import Link from "next/link";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import { Date } from "../Date";
import { listSupporters } from "@/backend/resources/supporters/supporters.service";
import SupporterOverview from "@/frontend/panel/(shared)/components/supporterOverview";
import PaginationControl from "./pagination";
import { SupporterTableType } from "@/shared/types/tableTypes";

export default function SupporterTable({
  originalData,
}: {
  originalData: { supporters: any; count: number };
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const { cache } = useSWRConfig();

  const columnHelper = createColumnHelper<SupporterTableType>();

  const supporterTableColumns = [
    columnHelper.accessor("user.name", {
      id: "name",
      header: "Nome",
      enableSorting: true,
      enableGlobalFilter: true,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("referral", {
      id: "referral",
      header: "Indicado por",
      enableSorting: true,
      cell: (info) => (
        <div className="group flex items-center gap-x-1.5 text-gray-500">
          {info.getValue()?.user.name || "Líder"}
          {info.getValue()?.user.name && (
            <SupporterBall level={info.getValue()?.level} />
          )}
          <div className="absolute hidden group-hover:block"></div>
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
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: "Entrou em",
      cell: (info) => (
        <Date value={dayjs(info.getValue()).format("DD/MM/YYYY HH:mm")} />
      ),
    }),
    columnHelper.accessor("user", {
      id: "options",
      header: "Opções",
      cell: (info) => (
        <div className="flex gap-x-3">
          <a
            className="flex items-center"
            href={`https://wa.me/${info.getValue().info.phone}`}
            target="_blank"
          >
            <WhatsAppIcon className="h-5 w-5 fill-gray-400 hover:fill-gray-500" />
          </a>
          <a href={`mailto:${info.getValue().email}`} target="_blank">
            <AtSymbolIcon className="h-[1.45rem] w-[1.45rem] text-gray-400 hover:text-gray-500" />
          </a>
        </div>
      ),
    }),
  ];

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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

  const [sorting, setSorting] = useState<SortingState>([]);

  /*const { data, isLoading } = useSWR(
    pageIndex !== 0 &&
      !cache.get(
        `#pagination:#pageSize:${pageSize},pageIndex:${pageIndex},,`
      ) &&  {
      pagination,
    },
    listSupporters,
    {}
  );*/

  const table = useReactTable({
    data: /* parseCachedData() */ originalData.supporters,
    columns: supporterTableColumns,
    pageCount: Math.ceil(originalData.count / pageSize),
    state: {
      pagination,
      sorting,
      globalFilter,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  const pages = Array.from(Array(table.getPageCount()).keys());

  /* if (isLoading)
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
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                  >
                    Zona
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
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
                    <div className="mt-4 flex justify-center">
                      <LoadingSpinner />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ); */

  return (
    <SWRConfig value={{ provider: () => new Map([]) }}>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="my-3"></div>
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
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>
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
            <PaginationControl
              table={table}
              count={originalData.count}
              pages={pages}
              pageIndex={pageIndex}
            />
          </div>
        </div>
      </div>
    </SWRConfig>
  );
}
