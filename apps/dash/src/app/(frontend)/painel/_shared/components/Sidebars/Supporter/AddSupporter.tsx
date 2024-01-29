import { readSupportersFulltext } from "@/app/api/panel/supporters/actions";
import { fakerPT_BR } from "@faker-js/faker";
import { useEffect, useMemo, useRef, useState } from "react";
import { readZonesByCampaign } from "@/app/api/elections/zones/actions";
import { readSectionsByZone } from "@/app/api/elections/sections/action";
import {
  readAddressFulltext,
  readAddresses,
} from "@/app/api/elections/locations/actions";
import { scrollToElement } from "@/app/(frontend)/_shared/utils/scroll";
import clsx from "clsx";
import { LoadingSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { useMocker } from "@/app/(frontend)/_shared/components/Mocker";
import Link from "next/link";

import dayjs from "dayjs";
import { AddSupporterDto } from "@/app/api/panel/supporters/dto";

import { useSidebar } from "../lib/useSidebar";
import { If, Alertbox, List, Badge, Tabs } from "odinkit";

import {
  Button,
  Combobox,
  Description,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Input,
  Label,
  Listbox,
  ListboxLabel,
  Switch,
  useAction,
  useFormContext,
} from "odinkit/client";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { Address } from "prisma/client";

export function AddSupporterForm({
  isAdminOptions,
  setIsAdminOptions,
}: {
  isAdminOptions: boolean;
  setIsAdminOptions: (value: boolean) => void;
}) {
  const ref = useRef<null | HTMLDivElement>(null);
  const errRef = useRef<null | HTMLDivElement>(null);

  const form = useFormContext<AddSupporterDto>();

  const Field = useMemo(() => form.createField(), []);

  const { campaign } = useSidebar();

  const [referralName, setReferralName] = useState<string>("");

  const { data: zones, trigger: fetchZones } = useAction({
    action: readZonesByCampaign,
  });

  const { data: sections, trigger: fetchSections } = useAction({
    action: readSectionsByZone,
  });

  const { data: fulltextAddresses, trigger: fulltextSearchAddresses } =
    useAction({
      action: readAddressFulltext,
    });

  const {
    data: addresses,
    reset: resetAddresses,
    trigger: searchAddresses,
  } = useAction({
    action: readAddresses,
  });

  const {
    data: address,
    reset: resetAddress,
    trigger: searchAddress,
  } = useAction({
    action: readAddresses,
    responseParser: (res) => res[0],
  });

  useEffect(() => {
    fetchZones(campaign.id);
  }, []);

  useEffect(() => {
    if (ref.current) {
      scrollToElement(ref.current, 0);
    }
  }, [form.watch("user.info.sectionId"), form.watch("user.info.addressId")]);

  useEffect(() => {
    if (form.getValues("externalSupporter")) {
      form.setValue("user.info.zoneId", undefined);
      form.setValue("user.info.sectionId", undefined);
    }
  }, [form.watch("externalSupporter")]);

  useEffect(() => {
    if (form.getValues("user.info.addressId")) {
      searchAddress();
    }
  }, [form.watch("user.info.addressId")]);

  useMocker({
    form,
    data: async () => {
      const { data: zones } = await fetchZones(campaign.id);

      const zone = zones![Math.floor(Math.random() * zones!.length)];

      const { data: sections } = await fetchSections(zone?.id || "");

      const section = sections?.[Math.round(Math.random() * sections.length)]!;

      return {
        "user.name": fakerPT_BR.person.fullName(),
        "user.email": fakerPT_BR.internet.email(),
        "user.phone": fakerPT_BR.phone.number(),
        "user.info.zoneId": zone?.id,
        "user.info.sectionId": section.id,
        "user.info.birthDate": dayjs(
          fakerPT_BR.date.past({ refDate: 1 }).toISOString()
        ).format("DD/MM/YYYY"),
        externalSupporter: false,
      };
    },
  });

  const { data: supporterList, trigger: fetchSupporterList } = useAction({
    action: readSupportersFulltext,
    responseParser: (res) =>
      res.filter((item) => item.user.id !== campaign.userId),
  });

  useEffect(() => {
    fetchSupporterList();
    setReferralName("");
  }, [form.formState.isSubmitSuccessful]);

  if (!zones)
    return (
      <div className="flex h-[350px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <Fieldset className="mt-4 space-y-3 divide-y">
      <FieldGroup className="space-y-2">
        <If
          deps={{
            serverError: form.formState.errors.root?.serverError?.message,
          }}
          if={(deps) => deps.serverError}
          then={({ serverError }) => (
            <div ref={errRef} className="scroll-mt-64">
              <Alertbox type="error">
                <List data={[serverError as string]} />
              </Alertbox>
            </div>
          )}
          else={null}
        />
        <Field name="user.name">
          <Label>Nome do apoiador</Label>
          <Input />
          <ErrorMessage />
        </Field>

        <Field name="user.email">
          <Label>Email</Label>
          <Input />
          <ErrorMessage />
        </Field>

        <Field name="user.phone">
          <Label>Celular</Label>
          <Input inputMode="numeric" mask={"(99) 99999-9999"} />
          <ErrorMessage />
        </Field>

        <Field name="user.info.birthDate">
          <Label>Data de Nascimento</Label>
          <Input inputMode="numeric" mask={"99/99/9999"} />
          <ErrorMessage />
        </Field>
      </FieldGroup>

      <FieldGroup className={clsx(form.watch("externalSupporter") && "hidden")}>
        <Tabs
          className="flex w-full justify-center pb-4 pt-2"
          tabs={[
            {
              title: "Por zona e seção",
              onClick: () => form.resetField("user.info.addressId"),
              content: (
                <>
                  <Field name="user.info.zoneId" className="col-span-1">
                    <Label>Zona</Label>
                    <Listbox
                      data={zones}
                      displayValueKey="number"
                      onChange={(value) => {
                        form.setValue("user.info.sectionId", undefined);
                        if (value) {
                          fetchSections(value.id);
                        }
                      }}
                    >
                      {(zone) => <ListboxLabel>{zone.number}</ListboxLabel>}
                    </Listbox>
                  </Field>
                  <Field name="user.info.sectionId" className="col-span-1">
                    <Label>Seção</Label>
                    <Combobox
                      data={sections}
                      displayValueKey={"number"}
                      disabled={!form.watch("user.info.zoneId")}
                      inputMode="numeric"
                      onChange={(value) => {
                        if (value) {
                          searchAddress({
                            where: {
                              sectionId: value.id,
                            },
                          });
                        } else {
                          resetAddress();
                        }
                      }}
                    >
                      {(item) => item.number}
                    </Combobox>
                    <ErrorMessage />
                  </Field>
                  <Description className="col-span-2 text-sm text-gray-500">
                    Não sabe sua zona e seção?{" "}
                    <Link
                      target="_blank"
                      className="underline"
                      href="https://www.tse.jus.br/servicos-eleitorais/titulo-e-local-de-votacao/titulo-e-local-de-votacao"
                    >
                      Consulte o TSE.
                    </Link>
                  </Description>
                </>
              ),
            },
            {
              title: "Por endereço",
              onClick: () => {
                form.resetField("user.info.sectionId");
                form.resetField("user.info.zoneId");
              },
              content: (
                <Field name="user.info.addressId">
                  <Label>Endereço</Label>
                  <Combobox
                    data={(fulltextAddresses || addresses) as Address[]}
                    displayValueKey="location"
                    setData={(query) => {
                      if (query) {
                        fulltextSearchAddresses({
                          where: {
                            location: query,
                          },
                        });
                      } else {
                        searchAddresses();
                      }
                    }}
                  >
                    {(item) => <div>{item.location}</div>}
                  </Combobox>
                </Field>
              ),
            },
          ]}
        />
      </FieldGroup>

      {(form.watch("externalSupporter") ||
        form.watch("user.info.zoneId") ||
        form.watch("user.info.addressId")) &&
        form.watch("user.name") && (
          <div ref={ref} className="py-4">
            <div className="lg:col-start-3 lg:row-end-1">
              <h2 className="sr-only">Summary</h2>
              <div className="rounded-lg bg-slate-50 shadow-sm ring-1 ring-gray-900/5">
                <dl className="flex flex-wrap">
                  <div className="flex-auto pl-6 pt-6 font-semibold leading-6 text-gray-900">
                    Confirmação
                  </div>
                  <div className="flex-none self-end px-6 pt-4">
                    <dt className="sr-only">Status</dt>
                    {form.watch("externalSupporter") ? (
                      <Badge color="blue">Apoiador externo</Badge>
                    ) : (
                      <Badge color="emerald">Apoiador</Badge>
                    )}
                  </div>
                  <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                    <dt className="flex-none">
                      <span className="sr-only">Client</span>
                      <UserCircleIcon
                        className="h-6 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </dt>
                    <dd className="text-sm font-medium leading-6 text-gray-900">
                      {form.watch("user.name")}
                    </dd>
                  </div>
                  {!form.watch("externalSupporter") && (
                    <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                      <dt className="flex-none">
                        <span className="sr-only">Status</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-6 w-5 text-gray-400"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9.674 2.075a.75.75 0 0 1 .652 0l7.25 3.5A.75.75 0 0 1 17 6.957V16.5h.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H3V6.957a.75.75 0 0 1-.576-1.382l7.25-3.5ZM11 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7.5 9.75a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0v-5.5Zm3.25 0a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0v-5.5Zm3.25 0a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0v-5.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </dt>
                      <dd className="text-sm leading-6 text-gray-500">
                        {(() => {
                          const zoneId = form.watch("user.info.zoneId");
                          const sectionId = form.watch("user.info.sectionId");
                          const location = address?.location;
                          if (address) return <>{address.location}</>;
                          return (
                            <>
                              <>
                                {zoneId &&
                                  "Zona " +
                                    zones?.find(
                                      (zone) =>
                                        zone.id ===
                                        form.watch("user.info.zoneId")
                                    )?.number}
                              </>
                              <>
                                {zoneId &&
                                  sectionId &&
                                  ", Seção " +
                                    sections?.find(
                                      (section) =>
                                        section.id ===
                                        form.watch("user.info.sectionId")
                                    )?.number}
                              </>
                              <>{zoneId && sectionId && " - " + location}</>
                            </>
                          );
                        })()}
                      </dd>
                    </div>
                  )}
                  <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                    <dt className="flex-none">
                      <span className="sr-only">Status</span>

                      <EnvelopeIcon className="h-6 w-5 text-gray-400" />
                    </dt>
                    <dd className="text-sm leading-6 text-gray-500">
                      Indicado por{" "}
                      {form.watch("referralId") ? referralName : "Você"}
                    </dd>
                  </div>
                </dl>
                <div className="mt-6  border-gray-900/5 px-6 py-3"></div>
              </div>
            </div>
          </div>
        )}
      <Dialog open={isAdminOptions} onClose={setIsAdminOptions} zIndex={90}>
        <DialogTitle>Opções de Administrador</DialogTitle>
        <DialogDescription>
          Escolha entre as opções abaixo para adicionar um apoiador.
        </DialogDescription>
        <DialogBody>
          <FieldGroup className={"space-y-8"}>
            <Field name="referralId">
              <Label>Indicado Por</Label>
              <Combobox
                data={supporterList}
                setData={(query) =>
                  query === ""
                    ? fetchSupporterList()
                    : fetchSupporterList({
                        where: {
                          user: {
                            name: query,
                          },
                        },
                      })
                }
                onChange={(v) => {
                  setReferralName(v?.user.name);
                }}
                displayValueKey="user.name"
              >
                {(item) => item.user.name}
              </Combobox>
              <ErrorMessage />
            </Field>

            <Field name="externalSupporter" variant="switch">
              <Label>Apoiador Externo</Label>
              <Description>
                Cadastre um apoiador que não vive na região.
              </Description>
              <Switch color="indigo" />
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button color="indigo" onClick={() => setIsAdminOptions(false)}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Fieldset>
  );
}
