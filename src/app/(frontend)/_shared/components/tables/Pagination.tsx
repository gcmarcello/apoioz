import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Supporter } from "@prisma/client";
import { Table } from "@tanstack/react-table";
import clsx from "clsx";

export default function PaginationControl({
  table,
  pages,
  pageIndex,
  count,
}: {
  table: Table<any>;
  pages: number[];
  pageIndex: number;
  count: number;
}) {
  const pagesArray = Array.from({ length: table.getPageCount() }, (_, i) => i);

  const visiblePages = (() => {
    const totalVisiblePages = 5;
    const halfRange = Math.floor(totalVisiblePages / 2);

    let start = Math.max(0, pageIndex - halfRange);
    let end = Math.min(pagesArray.length - 1, pageIndex + halfRange);

    if (pageIndex < halfRange) {
      end = Math.min(totalVisiblePages - 1, pagesArray.length - 1);
    }
    if (pageIndex > pagesArray.length - 1 - halfRange) {
      start = Math.max(0, pagesArray.length - totalVisiblePages);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  })();

  return (
    <div className="flex w-full items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando{" "}
            <span className="font-medium">
              {table?.options?.state?.pagination?.pageSize || 0 > count
                ? count
                : table.options.state.pagination?.pageSize}
            </span>{" "}
            de <span className="font-medium">{count}</span>
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
            {visiblePages.map((page) => (
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
            {pages.length > 6 && (
              <button
                onClick={() =>
                  table.setPageIndex(
                    pageIndex > pages.slice(-4)[0] ? pageIndex - 4 : pageIndex + 3
                  )
                }
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                ...
              </button>
            )}
            {pages.length > 6 &&
              pages.slice(-3).map((page) => (
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
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
