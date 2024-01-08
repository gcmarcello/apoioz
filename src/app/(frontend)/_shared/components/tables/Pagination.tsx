import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Table } from "@tanstack/react-table";
import clsx from "clsx";

export default function PaginationControl({
  table,
  pageIndex,
  count,
}: {
  table: Table<any>;
  pageIndex: number;
  count: number;
}) {
  const pagesArray = Array.from({ length: table.getPageCount() }, (_, i) => i);
  console.log(table.getPageCount());
  const visiblePages = (() => {
    const totalVisiblePages = window.innerWidth > 768 ? 5 : 3; // Adjust visible pages based on screen width
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
    <div className="flex w-full items-center justify-between rounded-md border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {table?.options?.state?.pagination?.pageSize || 0 > count
                ? count
                : table.options.state.pagination?.pageSize}
            </span>{" "}
            of <span className="font-medium">{count}</span>
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {/* First Page Button */}
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={pageIndex === 0}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:z-20"
              aria-label="First Page"
            >
              <span className="sr-only">First Page</span>
              {/* First Page Icon */}
            </button>

            {/* Previous Page Button */}
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center rounded-s-md  px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20"
              aria-label="Previous"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Page Number Buttons */}
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

            {/* Next Page Button */}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="relative inline-flex items-center rounded-e-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20"
              aria-label="Next"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Last Page Button */}
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={pageIndex === table.getPageCount() - 1}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:z-20"
              aria-label="Last Page"
            >
              <span className="sr-only">Last Page</span>
              {/* Last Page Icon */}
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
