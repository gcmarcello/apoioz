import React, { Dispatch, useState } from "react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { rankItem } from "@tanstack/match-sorter-utils";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  flexRender,
  Pagination,
} from "@tanstack/react-table";
import { For } from "../For";
import PaginationControl from "./Pagination";
import PlaceholderTable from "./PlaceholderTable";
import Xlsx from "../Xlsx";
import clsx from "clsx";
import dayjs from "dayjs";
import { ParagraphLink } from "../text/ParagraphLink";

function DebouncedInput({
  value: initialValue,
  onChange,
  setIsLoading,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  setIsLoading: Dispatch<boolean>;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => {
      clearTimeout(timeout);
    };
  }, [value, debounce, onChange]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
};

interface TableProps {
  data: any;
  columns: any;
  dataSetter?: JSX.Element;
  count: number;
  disablePagination?: boolean;
  disableXlsx?: boolean;
  globalFilter?: string;
  setGlobalFilter?: Dispatch<string>;
  TableHeader?: React.ElementType;
}

export function DefaultTable({
  data,
  columns,
  dataSetter,
  count,
  disablePagination,
  disableXlsx,
  globalFilter,
  setGlobalFilter,
  TableHeader,
}: TableProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      globalFilter,
    },
    pageCount: Math.ceil(count / 10),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  if (isLoading) return <PlaceholderTable />;

  return (
    <section className="mx-auto">
      {globalFilter !== undefined && TableHeader && <TableHeader />}
      <div
        className={clsx(
          "relative mt-4 flex w-full items-center gap-2 md:mt-0",
          globalFilter !== undefined
            ? "justify-between"
            : disableXlsx
              ? ""
              : "justify-end"
        )}
      >
        {setGlobalFilter === undefined && TableHeader && <TableHeader />}
        {globalFilter !== undefined && (
          <>
            <span className="absolute">
              <MagnifyingGlassIcon className="mx-3 h-5 w-5 text-gray-400 " />
            </span>
            <DebouncedInput
              setIsLoading={setIsLoading}
              value={globalFilter ?? ""}
              onChange={(value) =>
                setGlobalFilter && setGlobalFilter(String(value))
              }
              className="block w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-11 pr-5  placeholder-gray-400/70 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 md:w-80 rtl:pl-5   rtl:pr-11 "
              placeholder="Procurar"
            />
            {dataSetter}
          </>
        )}

        {!disableXlsx && (
          <Xlsx
            data={data}
            columns={columns}
            fileName={`ApoioZ ${dayjs().format("DD-MM-YYYY")} - Apoiadores`}
            sheetName={"Apoiadores"}
          />
        )}
      </div>

      <div className="mt-4 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <For each={table.getHeaderGroups()} identifier={"thead"}>
                    {(headerGroup) => (
                      <tr>
                        <For each={headerGroup.headers} identifier={"header"}>
                          {(header) => (
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                              {header.isPlaceholder ? null : (
                                <div
                                  {...{
                                    className: header.column.getCanSort()
                                      ? "cursor-pointer select-none"
                                      : "",
                                    onClick:
                                      header.column.getToggleSortingHandler(),
                                  }}
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                  {{
                                    asc: " 🔼",
                                    desc: " 🔽",
                                  }[header.column.getIsSorted() as string] ??
                                    null}
                                </div>
                              )}
                            </th>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white ">
                  {data.length ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="whitespace-nowrap px-4 py-4 text-sm"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        Nenhuma entrada.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  {/* <For each={table.getFooterGroups()} identifier="tfoot">
                    {(footerGroup) => (
                      <tr>
                        <For each={footerGroup.headers} identifier="tfheader">
                          {(header) => (
                            <th>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.footer,
                                    header.getContext()
                                  )}
                            </th>
                          )}
                        </For>
                      </tr>
                    )}
                  </For> */}
                </tfoot>
              </table>
              {!disablePagination && (
                <PaginationControl
                  count={count}
                  pageIndex={table.getState().pagination.pageIndex}
                  table={table}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
