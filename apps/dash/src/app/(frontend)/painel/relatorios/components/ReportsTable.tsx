import {
  ChevronDownIcon,
  EyeIcon,
  PencilSquareIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import { Table, formatPhone, TableFlag } from "odinkit";
import {
  Dropdown,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  DropdownDescription,
  DropdownDivider,
  useForm,
} from "odinkit/client";
import { MenuButton as HeadlessDropdownButton } from "@headlessui/react";
import { SupporterWithReferral, useReport } from "../context/report.ctx";
import { useRouter } from "next/navigation";
import { updateSupporterDto } from "@/app/api/panel/supporters/dto";

export default function ReportsTable() {
  const { zones, sections, addresses, supporters, setSelectedSupporter } =
    useReport();
  const router = useRouter();

  return (
    <Table
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
                    <PhoneIcon className="size-5 " /> Whatsapp
                  </DropdownItem>
                  {info.row.original.user.email && (
                    <DropdownItem
                      href={`https://wa.me/${info.row.original.user.email}`}
                    >
                      <EnvelopeIcon className="size-5 " /> Email
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
          cell: (info) =>
            info.getValue() ? formatPhone(info.getValue()) : undefined,
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
        columnHelper.accessor("addressId", {
          id: "neighborhood",
          header: "Bairro",
          enableSorting: true,
          enableColumnFilter: TableFlag.ENABLE_COLUMN_FILTER,
          meta: { filterVariant: "select" },
          cell: (info) => (
            <div className="group flex items-center gap-x-1.5 text-gray-500">
              {addresses?.find((a) => a.id === info.getValue())?.neighborhood}

              <div className="absolute hidden group-hover:block"></div>
            </div>
          ),
        }),
        columnHelper.accessor("addressId", {
          id: "address",
          header: "Local",
          enableColumnFilter: TableFlag.ENABLE_COLUMN_FILTER,
          meta: {
            filterVariant: "select",
            selectOptions: addresses?.map((a) => ({
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
          enableColumnFilter: TableFlag.ENABLE_COLUMN_FILTER,
          meta: {
            filterVariant: "select",
            selectOptions: sections?.map((s) => ({
              value: s.id,
              label: String(s.number) ?? "N/D",
            })),
          },
          cell: (info) =>
            sections?.find((s) => s.id === info.getValue())?.number ?? "N/D",
        }),
      ]}
      data={supporters}
    />
  );
}
