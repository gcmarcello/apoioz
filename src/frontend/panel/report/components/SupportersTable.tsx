"use client";
import { Date } from "@/frontend/shared/components/date";
import WhatsAppIcon from "@/frontend/shared/components/icons/WhatsAppIcon";
import SupporterBall from "@/frontend/shared/components/supporterBall";
import { DefaultTable } from "@/frontend/shared/components/tables/table";
import { SupporterTableType } from "@/shared/types/tableTypes";
import { ArrowPathIcon, AtSymbolIcon } from "@heroicons/react/24/solid";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import React, { useState } from "react";

export default function SupportersTable({ rawData }: { rawData: any }) {
  const columnHelper = createColumnHelper<SupporterTableType>();

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

  const [data, setData] = useState(rawData.supporters);

  return <DefaultTable data={data} columns={columns} count={rawData.count} />;
}
