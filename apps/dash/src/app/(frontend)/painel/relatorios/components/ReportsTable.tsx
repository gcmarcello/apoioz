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
import {
  Button,
  Combobox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  Dropdown,
  DropdownButton,
  DropdownDescription,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownSeparator,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  Listbox,
  ListboxLabel,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import {
  ChevronDownIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Address,
  Section,
  Supporter,
  User,
  UserInfo,
  Zone,
} from "prisma/client";
import { updateSupporterDto } from "@/app/api/panel/supporters/dto";
import { updateSupporter } from "@/app/api/panel/supporters/actions";
import { ButtonSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { readSectionsByZone } from "@/app/api/elections/sections/action";
import { readZonesByCampaign } from "@/app/api/elections/zones/actions";
import { readAddressesFromSections } from "@/app/api/elections/locations/actions";

interface ReportsTableRankingProps {
  supporters: SupporterWithReferral[];
  count: number;
}

type SupporterInfo = Omit<
  User,
  "id" | "updatedAt" | "createdAt" | "role" | "password" | "infoId"
> & {
  info: UserInfo & {
    Zone: Omit<Zone, "geoJSON"> | null;
    Section: Section | null;
    Address?: Address | null;
  };
};

type SupporterWithReferral = Supporter & {
  user: SupporterInfo;
  referral?:
    | (Supporter & {
        user: SupporterInfo;
        referral?:
          | (Supporter & {
              user: SupporterInfo;
            })
          | null;
      })
    | null;
};

export function ReportsTable({ supporters }: ReportsTableRankingProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedSupporter, setSelectedSupporter] = useState<
    SupporterWithReferral | undefined
  >(undefined);

  const form = useForm({
    schema: updateSupporterDto,
    mode: "onChange",
  });

  const { data: zones, trigger: fetchZones } = useAction({
    action: readZonesByCampaign,
  });

  const { data: sections, trigger: fetchSections } = useAction({
    action: readSectionsByZone,
  });

  const { data: addresses, trigger: fetchAddresses } = useAction({
    action: readAddressesFromSections,
  });

  const { data, trigger, isMutating } = useAction({
    action: updateSupporter,
    onSuccess: () => {
      toggleModal();
      showToast({
        message: "Apoiador atualizado com sucesso",
        variant: "success",
        title: "Sucesso!",
      });
    },
    onError: () =>
      showToast({
        message: "Não foi possível atualizar o apoiador",
        variant: "error",
        title: "Erro!",
      }),
  });

  const Field = useMemo(() => form.createField(), []);

  function toggleModal(supporter?: SupporterWithReferral) {
    setSelectedSupporter(supporter);
    setShowModal(!!supporter);
    if (supporter) {
      form.setValue("name", supporter.user.name);
      form.setValue("email", supporter.user.email ?? undefined);
      form.setValue(
        "phone",
        supporter.user.phone ? formatPhone(supporter.user.phone) : ""
      );
      form.setValue("id", supporter.id);
      form.setValue("zoneId", supporter.user.info.Zone?.id ?? "");
      form.setValue("sectionId", supporter.user.info.Section?.id ?? "");
    }
  }

  useEffect(() => {
    const campaignId = supporters[0]?.campaignId;
    if (!campaignId) return;
    fetchZones(campaignId);
  }, []);

  useEffect(() => {
    const zoneId = form.watch("zoneId");
    if (!zoneId) return;
    fetchSections(zoneId);
  }, [form.watch("zoneId")]);

  useEffect(() => {
    const supporterSections = supporters
      .map((s) => s.user.info.Section?.id)
      .filter((s) => s) as string[];

    fetchAddresses(supporterSections);
  }, [supporters]);

  return (
    <>
      <Dialog open={showModal} onClose={() => toggleModal()}>
        <DialogTitle>Editar Apoiador</DialogTitle>
        <DialogDescription>
          Qualquer alteração realizada se refletirá em qualquer outra campanha
          que esse apoiador esteja participando.
        </DialogDescription>
        <Form hform={form} onSubmit={(data) => trigger(data)}>
          <DialogBody>
            <Fieldset>
              <FieldGroup className="space-y-3">
                <Field name="name">
                  <Label>Nome Completo</Label>
                  <Input />
                  <ErrorMessage />
                </Field>
                <Field name="email">
                  <Label>Email</Label>
                  <Input placeholder="email@apoiador.com" />
                  <ErrorMessage />
                </Field>
                <Field name="phone">
                  <Label>Telefone</Label>
                  <Input
                    mask={(_: any, rawValue: any) => {
                      if (Number(rawValue)) {
                        if (rawValue.length >= "99999999999".length) {
                          return "(99) 99999-9999";
                        } else if (rawValue.length === "9999999999".length) {
                          return "(99) 9999-9999";
                        }
                      }
                      return "";
                    }}
                  />
                  <ErrorMessage />
                </Field>
                <hr />
                <Field name="zoneId">
                  <Label>Zona</Label>
                  <Listbox
                    data={zones}
                    displayValueKey="number"
                    onChange={(value) => {
                      form.setValue("sectionId", undefined);
                      if (value) {
                        fetchSections(value.id);
                      }
                    }}
                  >
                    {(zone) => <ListboxLabel>{zone.number}</ListboxLabel>}
                  </Listbox>
                </Field>
                <Field name="sectionId">
                  <Label>Seção</Label>
                  <Combobox
                    data={sections}
                    displayValueKey={"number"}
                    disabled={!form.watch("zoneId")}
                    inputMode="numeric"
                  >
                    {(item) => item.number}
                  </Combobox>
                  <ErrorMessage />
                </Field>
              </FieldGroup>
            </Fieldset>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => toggleModal()}>
              Cancelar
            </Button>
            <Button type="submit" color="indigo">
              <div className="flex gap-2">
                Salvar{" "}
                {isMutating && (
                  <div className="flex items-center justify-center">
                    <ButtonSpinner size="medium" />
                  </div>
                )}
              </div>
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
      <Table
        xlsx={{
          fileName: "Relatório de apoiadores",
          data: supporters.map((s) => ({
            Nome: s.user.name,
            "Indicado por": s.referral?.user.name,
            Zona: s.user.info.Zone?.number,
            Bairro: s.user.info.Address?.neighborhood,
            Local: addresses?.find(
              (a) => a.id === s.user.info.Section?.addressId
            )?.location,
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

          columnHelper.accessor("user.info.Zone.number", {
            id: "zone",
            header: "Zona",
            meta: { filterVariant: "select" },
            enableSorting: true,
            cell: (info) => info.getValue(),
            filterFn: "arrIncludes",
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
          columnHelper.accessor("user.info.Section.addressId", {
            id: "address",
            header: "Local",
            meta: {
              filterVariant: "select",
              selectOptions: addresses?.map((a) => ({
                id: a.id,
                name: a.location ?? "Não Informado",
              })),
            },
            cell: (info) =>
              addresses?.find((a) => a.id === info.getValue())?.location ??
              "Não Informado",
          }),
          columnHelper.accessor("user.info.Section.number", {
            id: "section",
            header: "Seção",
            meta: { filterVariant: "select" },
            cell: (info) => info.getValue(),
          }),

          columnHelper.accessor("user", {
            id: "options",
            header: "",
            enableColumnFilter: false,
            enableSorting: false,
            cell: (info) => (
              <Dropdown>
                <DropdownButton outline>
                  Opções
                  <ChevronDownIcon />
                </DropdownButton>
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
                      onClick={() => toggleModal(info.row.original)}
                    >
                      <PencilSquareIcon role="button" className="size-5" />{" "}
                      Editar{" "}
                      <DropdownDescription>
                        Editar informações do apoiador
                      </DropdownDescription>
                    </DropdownItem>
                  </DropdownSection>
                  <DropdownSeparator />
                  <DropdownSection>
                    <DropdownItem
                      href={`https://wa.me/${info.getValue().phone}`}
                    >
                      <PhoneIcon className="size-5 " /> Whatsapp
                    </DropdownItem>
                    {info.getValue().email && (
                      <DropdownItem
                        href={`https://wa.me/${info.getValue().email}`}
                      >
                        <EnvelopeIcon className="size-5 " /> Email
                      </DropdownItem>
                    )}
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            ),
          }),
        ]}
        data={supporters}
      />
    </>
  );
}
