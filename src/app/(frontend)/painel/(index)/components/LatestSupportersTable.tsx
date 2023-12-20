"use client";
import { createColumnHelper } from "@tanstack/react-table";
import React, { useState } from "react";
import dayjs from "dayjs";
import SupporterOverview from "./SupporterOverview";
import { Date } from "@/app/(frontend)/_shared/components/Date";
import { DefaultTable } from "@/app/(frontend)/_shared/components/tables/table";
import SupporterBall from "@/app/(frontend)/_shared/components/SupporterBall";
import { ParagraphLink } from "@/app/(frontend)/_shared/components/text/ParagraphLink";
import { Pagination } from "@/app/api/_shared/dto/read";
import { Prisma } from "@prisma/client";

export type LatestSupportersTableData = Prisma.SupporterGetPayload<{
  include: {
    user: {
      select: {
        info: { include: { Section: true; Zone: true } };
        name: true;
        email: true;
        phone: true;
      };
    };
    referral: {
      include: {
        user: {
          select: {
            info: { include: { Section: true; Zone: true } };
            name: true;
            email: true;
            phone: true;
          };
        };
        referral: {
          include: {
            user: {
              select: {
                info: { include: { Section: true; Zone: true } };
                name: true;
                email: true;
                phone: true;
              };
            };
          };
        };
      };
    };
  };
}>[];

export default function LatestSupportersTable({
  data,
  pagination,
}: {
  data: LatestSupportersTableData;
  pagination: Pagination;
}) {
  const columnHelper = createColumnHelper<(typeof data)[0]>();
  const [globalFilter, setGlobalFilter] = useState("");

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
      id: "id",
      header: "Entrou em",
      cell: (info) => <SupporterOverview supporter={info.row.original as any} />, //@todo
    }),
  ];

  return (
    <div className="mt-8">
      <DefaultTable
        data={data}
        columns={columns}
        count={pagination.count || 0}
        disablePagination={true}
        disableXlsx={true}
        TableHeader={() => (
          <div className="my-2 sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Novos Apoiadores
            </h1>
            <div className="flex items-center gap-1">
              <p className="mt-1 text-sm text-gray-700">
                Os últimos apoiadores adicionados.{" "}
                <ParagraphLink href="/painel/relatorios">Ver todos</ParagraphLink>
              </p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
