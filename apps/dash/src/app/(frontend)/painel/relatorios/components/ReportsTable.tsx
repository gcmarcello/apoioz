import {
  EyeIcon,
  PencilSquareIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import { Table, formatPhone, TableFlag, dateRangeFilterFn } from "odinkit";
import {
  Dropdown,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  DropdownDescription,
  DropdownDivider,
} from "odinkit/client";
import { MenuButton as HeadlessDropdownButton } from "@headlessui/react";
import { useReport } from "../context/report.ctx";
import { useRouter, useSearchParams } from "next/navigation";
import { parseSearchParams } from "@/app/(frontend)/_shared/utils/searchParams";

export default function ReportsTable() {
  const { zones, sections, addresses, supporters, setSelectedSupporter } =
    useReport();
  const router = useRouter();
  const params = useSearchParams();
  const defaultFilters = parseSearchParams(params);

  const neighborhoods = Array.from(
    new Set(addresses.map((a) => a.neighborhood))
  );

  const supportersWithNeighborhood = supporters.map((s) => ({
    ...s,
    neighborhood: addresses.find((a) => a.id === s.addressId)?.neighborhood,
  }));

  return (
    <Table
      defaultColumnFilters={defaultFilters.map((f) => ({
        id: f[0],
        value: f[1],
      }))}
      xlsx={{
        fileName: "Relatório de apoiadores",
        data: supporters.map((s) => ({
          Nome: s.user.name,
          "Indicado por": s.referral?.user.name,
          Zona: zones?.find((z) => z.id === s.zoneId)?.number,
          Bairro: addresses?.find((a) => a.id === s.addressId)?.neighborhood,
          Local: addresses?.find((a) => a.id === s.addressId)?.location,
          Seção: sections?.find((sec) => sec.id === s.sectionId)?.number,
          "Entrou em": dayjs(s.createdAt).format("DD/MM/YYYY HH:mm"),
          Telefone: s.user.phone ? formatPhone(s.user.phone) : "",
          Email: s.user.email,
        })),
      }}
      columns={(columnHelper) => [
        columnHelper.accessor("user.name", {
          id: "name",
          header: "Nome",
          enableColumnFilter: TableFlag.ENABLE_COLUMN_FILTER,
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => (
            <Dropdown>
              <HeadlessDropdownButton>
                <span className="underline">{info.getValue()}</span>
              </HeadlessDropdownButton>
              <DropdownMenu>
                <DropdownSection>
                  <DropdownItem
                    onClick={() =>
                      router.push(
                        `/painel/relatorios?as=${info.row.original.id}`
                      )
                    }
                  >
                    <EyeIcon role="button" className="size-5" /> Ver Como
                    <DropdownDescription>
                      Visualize a plataforma como esse apoiador
                    </DropdownDescription>
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => setSelectedSupporter(info.row.original)}
                  >
                    <PencilSquareIcon role="button" className="size-5" /> Editar{" "}
                    <DropdownDescription>
                      Editar informações do apoiador
                    </DropdownDescription>
                  </DropdownItem>
                </DropdownSection>
                <DropdownDivider />
                <DropdownSection>
                  <DropdownItem
                    href={`https://wa.me/${info.row.original.user.phone}`}
                  >
                    <PhoneIcon className="size-5 " /> Whatsapp -{" "}
                    {formatPhone(info.row.original.user.phone ?? "")}
                  </DropdownItem>
                  {info.row.original.user.email && (
                    <DropdownItem
                      href={`https://wa.me/${info.row.original.user.email}`}
                    >
                      <EnvelopeIcon className="size-5 " /> Email (
                      {info.row.original.user.email})
                    </DropdownItem>
                  )}
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          ),
        }),

        columnHelper.accessor("user.phone", {
          id: "phone",
          header: "Telefone",
          enableColumnFilter: TableFlag.ENABLE_COLUMN_FILTER,
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => (
            <div suppressHydrationWarning>
              {info.getValue() ? formatPhone(info.getValue()) : undefined}
            </div>
          ),
        }),
        columnHelper.accessor("referral.user.name", {
          id: "referral",
          header: "Indicado por",
          enableColumnFilter: TableFlag.ENABLE_COLUMN_FILTER,
          enableSorting: true,
          cell: (info) => (
            <div className="group flex items-center gap-x-1.5 text-gray-500">
              {info.getValue()}

              <div className="absolute hidden group-hover:block"></div>
            </div>
          ),
        }),
        columnHelper.accessor("createdAt", {
          id: "createdAt",
          header: "Entrou em",
          filterFn: dateRangeFilterFn,
          meta: {
            filterVariant: "range",
          },
          enableColumnFilter: TableFlag.ENABLE_COLUMN_FILTER,
          enableSorting: true,
          cell: (info) => (
            <div suppressHydrationWarning>
              {dayjs(info.getValue()).utcOffset(-3).format("DD/MM/YYYY HH:mm")}
            </div>
          ),
        }),

        columnHelper.accessor("zoneId", {
          id: "zone",
          header: "Zona",
          enableColumnFilter: TableFlag.ENABLE_COLUMN_FILTER,
          meta: {
            filterVariant: "select",
            selectOptions: zones?.map((a) => ({
              value: a.id,
              label: String(a.number) ?? "N/D",
            })),
          },
          enableSorting: true,
          cell: (info) =>
            zones?.find((a) => a.id === info.getValue())?.number ?? "N/D",
        }),
        columnHelper.accessor("neighborhood", {
          id: "neighborhood",
          header: "Bairro",
          enableSorting: true,
          enableColumnFilter: TableFlag.ENABLE_COLUMN_FILTER,
          meta: {
            filterVariant: "select",
            selectOptions: neighborhoods
              .filter((n) => n)
              .sort((a, b) => {
                if (!a) return 1;
                if (!b) return -1;
                return a.localeCompare(b);
              })
              .map((n) => ({ value: n, label: n ?? "N/D" })),
          },
          cell: (info) => (
            <div className="group flex items-center gap-x-1.5 text-gray-500">
              {info.getValue()}
            </div>
          ),
        }),
        columnHelper.accessor("addressId", {
          id: "address",
          header: "Local",
          enableColumnFilter: TableFlag.ENABLE_COLUMN_FILTER,
          meta: {
            filterVariant: "select",
            selectOptions: addresses
              ?.sort((a, b) =>
                (a.location ?? "").localeCompare(b.location ?? "")
              )
              .map((a) => ({
                value: a.id,
                label: a.location ?? "N/D",
              })),
          },
          cell: (info) =>
            addresses?.find((a) => a.id === info.getValue())?.location,
        }),
        columnHelper.accessor("sectionId", {
          id: "section",
          header: "Seção",
          /* enableColumnFilter: TableFlag.ENABLE_COLUMN_FILTER, */
          meta: {
            filterVariant: "select",
            selectOptions: sections
              ?.sort((a, b) => a.number - b.number)
              .map((s) => ({
                value: s.id,
                label: String(s.number) ?? "N/D",
              })),
          },
          cell: (info) =>
            sections?.find((s) => s.id === info.getValue())?.number ?? "N/D",
        }),
      ]}
      data={supportersWithNeighborhood}
    />
  );
}
