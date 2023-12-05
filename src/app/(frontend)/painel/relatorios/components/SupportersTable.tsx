"use client";
import { Date } from "@/app/(frontend)/_shared/components/Date";
import SupporterBall from "@/app/(frontend)/_shared/components/SupporterBall";
import { SupporterTableType } from "@/_shared/types/tableTypes";
import { AtSymbolIcon, TvIcon } from "@heroicons/react/24/solid";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import WhatsAppIcon from "@/app/(frontend)/_shared/components/icons/WhatsAppIcon";
import { DefaultTable } from "@/app/(frontend)/_shared/components/tables/table";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useReports } from "../hooks/useReports";
import { LoadingSpinner } from "@/app/(frontend)/_shared/components/Spinners";

export default function SupportersTable() {
  const columnHelper = createColumnHelper<SupporterTableType>();

  const { supporters, openAsSupporter, restoreView, globalFilter, setGlobalFilter } =
    useReports();

  const columns = [
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
          {info.getValue()?.user.name && <SupporterBall level={info.getValue()?.level} />}
          <div className="absolute hidden group-hover:block"></div>
        </div>
      ),
    }),
    columnHelper.accessor("user.info.Zone.number", {
      id: "zone",
      header: "Zona",
      cell: (info) => info.getValue(),
      filterFn: "arrIncludes",
    }),
    columnHelper.accessor("user.info.Section.number", {
      id: "section",
      header: "Seção",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: "Entrou em",
      cell: (info) => <Date value={dayjs(info.getValue()).format("DD/MM/YYYY HH:mm")} />,
    }),
    columnHelper.accessor("user", {
      id: "options",
      header: "Opções",
      cell: (info) => (
        <div className="flex gap-x-3">
          <a
            className="flex items-center"
            href={`https://wa.me/${info.getValue().phone}`}
            target="_blank"
          >
            <WhatsAppIcon className="h-5 w-5 fill-gray-400 hover:fill-gray-500" />
          </a>
          <a href={`mailto:${info.getValue().email}`} target="_blank">
            <AtSymbolIcon className="h-[1.45rem] w-[1.45rem] text-gray-400 hover:text-gray-500" />
          </a>
          <EyeIcon
            role="button"
            onClick={() =>
              openAsSupporter(info.row.original.user, info.row.original.campaignId)
            }
            className="h-[1.45rem] w-[1.45rem] text-gray-400 hover:text-gray-500"
          />
        </div>
      ),
    }),
  ];

  if (!supporters?.data)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <DefaultTable
      data={supporters?.data}
      columns={columns}
      count={supporters?.pagination.count}
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
    />
  );
}
