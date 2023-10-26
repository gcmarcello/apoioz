"use client";
import { DefaultTable } from "@/frontend/(shared)/components/tables/table";
import { createColumnHelper } from "@tanstack/react-table";
import React from "react";
import { Prisma } from "@prisma/client";
import { PaginationObject } from "@/(shared)/types/server.types";
import { Date } from "@/frontend/(shared)/components/Date";
import dayjs from "dayjs";
import SupporterBall from "@/frontend/panel/team/components/SupporterBall";
import SupporterOverview from "../SupporterOverview";

export default function LatestSupportersTable({
  initialData,
  pagination,
}: {
  initialData: Prisma.SupporterGetPayload<{
    include: {
      referral: {
        include: {
          user: true;
        };
      };
      user: { include: { info: { include: { Section: true; Zone: true } } } };
    };
  }>[];
  pagination: PaginationObject;
}) {
  const columnHelper = createColumnHelper<(typeof initialData)[0]>();

  const columns = [
    columnHelper.accessor("user.name", {
      id: "name",
      header: "Nome",
      enableSorting: true,
      enableGlobalFilter: true,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("referralId", {
      id: "referral",
      header: "Indicado por",
      enableSorting: true,
      cell: (info) => {
        const referral = info.row.original.referral;

        return (
          <div className="mt-1 flex items-center gap-x-1.5">
            {referral ? (
              <>
                {referral?.user.name}
                <SupporterBall level={referral?.level} />
              </>
            ) : (
              <>
                Líder
                <SupporterBall level={4} />
              </>
            )}
          </div>
        );
      },
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
    columnHelper.accessor("id", {
      id: "createdAt",
      header: "Entrou em",
      cell: (info) => <SupporterOverview supporter={info.row.original} />,
    }),
  ];

  return <DefaultTable data={initialData} columns={columns} count={pagination.count} />;
}
