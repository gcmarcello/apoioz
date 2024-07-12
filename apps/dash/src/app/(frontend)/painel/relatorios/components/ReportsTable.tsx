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
import { useMemo, useState } from "react";
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
      form.setValue("email", supporter.user.email);
      form.setValue("phone", supporter.user.phone ?? "");
      form.setValue("id", supporter.id);
    }
  }

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
              <FieldGroup>
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
              </FieldGroup>
            </Fieldset>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => toggleModal()}>
              Cancelar
            </Button>
            <Button type="submit" color="indigo" onClick={() => toggleModal()}>
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
