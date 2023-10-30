import dayjs from "dayjs";
import Link from "next/link";

import { headers } from "next/headers";
import LatestSupportersTable from "./LatestSupportersTable";
import { Date } from "@/app/(frontend)/_shared/components/Date";
import { listSupporters } from "@/app/api/panel/supporters/actions";

export async function LatestSupporters() {
  const userId = headers().get("userId")!;
  const latestSupporters = await listSupporters({
    pagination: { pageIndex: 0, pageSize: 5 },
    data: {
      ownerId: userId,
    },
  });

  if (!latestSupporters) return;

  return (
    <div className="mt-8 ">
      <div className="sm:items-cente mb-4 sm:flex">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Novos Apoiadores
          </h1>
          <div className="flex items-center gap-1">
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
          <Link href="/painel/relatorios">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Ver Todos
            </button>
          </Link>
        </div>
      </div>
      <LatestSupportersTable
        initialData={latestSupporters.data}
        pagination={latestSupporters.pagination}
      />
    </div>
  );
}
