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
import { Address, Prisma, Section, Zone } from "prisma/client";
import { toProperCase } from "odinkit";
import { SupporterWithReferral } from "../../relatorios/context/report.ctx";

export default function LatestSupportersTable({
  data,
  pagination,
  zones,
  sections,
  addresses,
}: {
  zones: Zone[];
  addresses: Address[];
  sections: Section[];
  data: SupporterWithReferral[];
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
    columnHelper.accessor("zoneId", {
      id: "zone",
      header: "Zona",
      cell: (info) => zones.find((zone) => zone.id === info.getValue())?.number,
    }),
    columnHelper.accessor("sectionId", {
      id: "section",
      header: "Seção",
      cell: (info) =>
        sections.find((section) => section.id === info.getValue())?.number ??
        "N/D",
    }),
    columnHelper.accessor("addressId", {
      id: "neighborhood",
      header: "Bairro",
      cell: (info) =>
        addresses.find((address) => address.id === info.getValue())
          ?.neighborhood,
    }),
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: "Entrou em",
      cell: (info) => (
        <Date
          value={dayjs(info.getValue())
            .utcOffset(-3)
            .format("DD/MM/YYYY HH:mm")}
        />
      ),
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
                Os últimos apoiadores adicionados na sua rede.{" "}
                <ParagraphLink href="/painel/relatorios">
                  Ver todos
                </ParagraphLink>
              </p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
