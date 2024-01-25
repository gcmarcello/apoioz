import { readSupportersFulltext } from "@/app/api/panel/supporters/actions";
import { fakerPT_BR } from "@faker-js/faker";
import { useEffect, useMemo, useRef } from "react";
import { toProperCase } from "@/_shared/utils/format";
import { readZonesByCampaign } from "@/app/api/elections/zones/actions";
import { readSectionsByZone } from "@/app/api/elections/sections/action";
import { readAddressBySection } from "@/app/api/elections/locations/actions";
import { scrollToElement } from "@/app/(frontend)/_shared/utils/scroll";
import clsx from "clsx";
import DisclosureAccordion from "@/app/(frontend)/_shared/components/Disclosure";
import { LoadingSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { useMocker } from "@/app/(frontend)/_shared/components/Mocker";
import Link from "next/link";

import dayjs from "dayjs";
import { AddSupporterDto } from "@/app/api/panel/supporters/dto";

import { useSidebar } from "../lib/useSidebar";
import { If, Alertbox, List } from "odinkit";

import {
  Combobox,
  Description,
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

export function AddSupporterForm() {
  const ref = useRef<null | HTMLDivElement>(null);
  const errRef = useRef<null | HTMLDivElement>(null);

  const form = useFormContext<AddSupporterDto>();

  const Field = useMemo(() => form.createField(), []);

  const { supporter: userSupporter, campaign } = useSidebar();

  const { data: zones, trigger: fetchZones } = useAction({
    action: readZonesByCampaign,
  });

  const { data: sections, trigger: fetchSections } = useAction({
    action: readSectionsByZone,
  });

  const { data: address, trigger: fetchAddress } = useAction({
    action: readAddressBySection,
  });

  useEffect(() => {
    fetchZones(campaign.id);
  }, []);

  useEffect(() => {
    if (ref.current) {
      scrollToElement(ref.current, 0);
    }
  }, [address]);

  useEffect(() => {
    if (form.getValues("externalSupporter")) {
      form.setValue("user.info.zoneId", undefined);
      form.setValue("user.info.sectionId", undefined);
    }
  }, [form.watch("externalSupporter")]);

  useMocker({
    form,
    data: async () => {
      const { data: zones } = await fetchZones(campaign.id);

      const zone = zones![Math.floor(Math.random() * zones!.length)];

      const { data: sections } = await fetchSections(zone?.id || "");

      return {
        "user.name": fakerPT_BR.person.fullName(),
        "user.email": fakerPT_BR.internet.email(),
        "user.phone": fakerPT_BR.phone.number(),
        "user.info.zoneId": zone?.id,
        "user.info.sectionId":
          sections?.[Math.round(Math.random() * sections.length)]?.id,
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
      <FieldGroup
        className={clsx(
          "grid grid-cols-2 gap-3 pt-3",
          form.watch("externalSupporter") && "hidden"
        )}
      >
        <Field name="user.info.zoneId" className="col-span-1">
          <Label>Zona</Label>
          <Listbox
            data={zones}
            displayValueKey="number"
            onChange={(value) => {
              form.setValue("user.info.sectionId", undefined);
              fetchSections(value.id);
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
            onChange={(value) => {
              fetchAddress(value.id);
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
      </FieldGroup>
      <FieldGroup>
        <If
          deps={{
            level: userSupporter.level,
          }}
          if={({ level }) => level >= 4}
          then={
            <DisclosureAccordion
              title="Opções de Administrador"
              scrollToContent={true}
            >
              <div className="space-y-8">
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
              </div>
            </DisclosureAccordion>
          }
        />

        <If
          deps={{
            externalSupporter: form.watch("externalSupporter"),
          }}
          if={({ externalSupporter }) => externalSupporter}
          then={
            <div
              ref={ref}
              className={clsx(
                "mt-6 border-t border-gray-100",
                address ? "block" : "hidden"
              )}
            >
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Local de Votação
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {toProperCase(address?.location || "")}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Endereço
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {toProperCase(
                      address?.address + ", " + address?.City?.name
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          }
        />
      </FieldGroup>
    </Fieldset>
  );
}
