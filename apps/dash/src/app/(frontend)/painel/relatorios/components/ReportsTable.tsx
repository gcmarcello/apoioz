"use client";
import { readSupportersFromSupporterGroupWithRelation } from "@/app/api/panel/supporters/service";
import { AtSymbolIcon, EyeIcon } from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import {
  Container,
  ExtractSuccessResponse,
  Link,
  Table,
  WhatsAppIcon,
  formatPhone,
  toProperCase,
} from "odinkit";
import { ViewAsButton } from "./ViewAsButton";
import { Date } from "@/app/(frontend)/_shared/components/Date";

interface ReportsTableRankingProps {
  supporters: ExtractSuccessResponse<
    typeof readSupportersFromSupporterGroupWithRelation
  >;
  count: number;
}

export function ReportsTable({ supporters }: ReportsTableRankingProps) {
  return (
    <Table
      xlsx={{
        fileName: "Relatório de apoiadores",
        data: supporters.map((s) => ({
          Nome: s.user.name,
          "Indicado por": s.referral?.user.name,
          Bairro: s.user.info.Address?.neighborhood,
          Zona: s.user.info.Zone?.number,
          Seção: s.user.info.Section?.number,
          "Entrou em": dayjs(s.createdAt).format("DD/MM/YYYY HH:mm"),
          Telefone: s.user.phone ? formatPhone(s.user.phone) : "",
          Email: s.user.email,
        })),
      }}
      columns={(columnHelper) => [
        columnHelper.accessor("user.name", {
          id: "name",
          header: "Nome",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("user.email", {
          id: "email",
          header: "Email",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("user.phone", {
          id: "phone",
          header: "Telefone",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("referral.user.name", {
          id: "referral",
          header: "Indicado por",
          enableSorting: true,
          cell: (info) => (
            <div className="group flex items-center gap-x-1.5 text-gray-500">
              {info.getValue()}

              <div className="absolute hidden group-hover:block"></div>
            </div>
          ),
        }),
        columnHelper.accessor("user.info.Address.neighborhood", {
          id: "neighborhood",
          header: "Bairro",
          enableSorting: true,
          meta: { filterVariant: "select" },
          cell: (info) => (
            <div className="group flex items-center gap-x-1.5 text-gray-500">
              {info.getValue() && info.getValue() !== "undefined"
                ? toProperCase(String(info.getValue()))
                : "Não informado"}

              <div className="absolute hidden group-hover:block"></div>
            </div>
          ),
        }),
        columnHelper.accessor("user.info.Zone.number", {
          id: "zone",
          header: "Zona",
          meta: { filterVariant: "select" },
          enableSorting: true,
          cell: (info) => info.getValue(),
          filterFn: "arrIncludes",
        }),
        columnHelper.accessor("user.info.Section.number", {
          id: "section",
          header: "Seção",
          meta: { filterVariant: "select" },
          cell: (info) => info.getValue(),
        }),

        columnHelper.accessor("user", {
          id: "options",
          header: "Opções",
          enableColumnFilter: false,
          enableSorting: false,
          cell: (info) => (
            <Container className="flex gap-x-3">
              <Link
                className="flex items-center"
                href={`https://wa.me/${info.getValue().phone}`}
                target="_blank"
              >
                <WhatsAppIcon className="h-5 w-5 fill-gray-400 hover:fill-gray-500" />
              </Link>
              <Link href={`mailto:${info.getValue().email}`} target="_blank">
                <AtSymbolIcon className="h-[1.45rem] w-[1.45rem] text-gray-400 hover:text-gray-500" />
              </Link>
              <ViewAsButton as={info.row.original.id}>
                <EyeIcon
                  role="button"
                  className="h-[1.45rem] w-[1.45rem] text-gray-400 hover:text-gray-500"
                />
              </ViewAsButton>
            </Container>
          ),
        }),
      ]}
      data={supporters}
    />
  );
}
