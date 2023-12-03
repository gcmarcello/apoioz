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
import PaginationControl from "./pagination";
import PlaceholderTable from "./PlaceholderTable";

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

  return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

interface TableProps {
  data: any;
  columns: any;
  dataSetter?: JSX.Element;
  count: number;
  disablePagination?: boolean;
  globalFilter?: string;
  setGlobalFilter?: Dispatch<string>;
}

export function DefaultTable({
  data,
  columns,
  dataSetter,
  count,
  disablePagination,
  globalFilter,
  setGlobalFilter,
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
      {globalFilter !== undefined && (
        <div className="relative mt-4 flex w-full items-center justify-between md:mt-0">
          <span className="absolute">
            <MagnifyingGlassIcon className="mx-3 h-5 w-5 text-gray-400 dark:text-gray-600" />
          </span>
          <DebouncedInput
            setIsLoading={setIsLoading}
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="block w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-11 pr-5  placeholder-gray-400/70 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 rtl:pl-5 rtl:pr-11   dark:focus:border-blue-300 md:w-80"
            placeholder="Procurar"
          />
          {dataSetter}
        </div>
      )}
      <div className="mt-6 flex flex-col">
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
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
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
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                  pages={Array.from({ length: table.getPageCount() }, (_, i) => i)}
                  table={table}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="mt-6 text-sm text-gray-500 ">
        <div className="flex items-center justify-center gap-3 md:justify-between">
          <div className="flex  items-center gap-2">
            <div className="flex gap-1">
              <button
                className="rounded border p-1"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronDoubleLeftIcon className="w-3.5" />
              </button>
              <button
                className="rounded border p-1"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeftIcon className="w-3.5" />
              </button>
              <button
                className="rounded border p-1"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRightIcon className="w-3.5" />
              </button>
              <button
                className="rounded border p-1"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <ChevronDoubleRightIcon className="w-3.5" />
              </button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Página{" "}
              <strong className="font-medium text-gray-700 dark:text-gray-100">
                {table.getState().pagination.pageIndex + 1} de{" "}
                {table.getPageCount()}
              </strong>
            </div>
          </div>
          <div className="hidden md:flex ">
            <div className="flex items-center gap-1">
              Ir até:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="w-16 rounded border p-1"
              />
            </div>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="bg-gray-50"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Mostrar {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div> */}
    </section>
  );
}
