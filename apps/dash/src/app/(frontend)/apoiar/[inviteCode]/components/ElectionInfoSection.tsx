import { EyeSlashIcon, EyeIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { Zone } from "prisma/client";
import { Controller, useForm } from "react-hook-form";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { readSectionsByZone } from "@/app/api/elections/sections/action";
import { readAddressBySection } from "@/app/api/elections/locations/actions";
import { toProperCase } from "@/_shared/utils/format";
import { PresentationChartBarIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  Combobox,
  Description,
  FieldGroup,
  Fieldset,
  Input,
  Label,
  Listbox,
  useAction,
  useFormContext,
} from "odinkit/client";
import {
  ComboboxField,
  ListboxField,
} from "@/app/(frontend)/_shared/components/fields/Select";
import { PollQuestions } from "./PollQuestions";
import { SectionTitle } from "@/app/(frontend)/_shared/components/text/SectionTitle";
import { scrollToElement } from "@/app/(frontend)/_shared/utils/scroll";
import { SignUpAsSupporterDto } from "@/app/api/auth/dto";
import Link from "next/link";

export function ElectionInfoSection({
  zones,
  poll,
}: {
  zones: Zone[];
  poll: any;
}) {
  const ref = useRef<null | HTMLDivElement>(null);
  const formRef = useRef<null | HTMLDivElement>(null);

  const form = useFormContext<SignUpAsSupporterDto>();

  const Field = useMemo(() => form.createField(), []);

  const {
    data: sectionList,
    isMutating: isLoading,
    trigger: fetchSections,
  } = useAction({
    action: readSectionsByZone,
    responseParser: (data) => {
      resetAddress();
      form.resetField("user.info.sectionId");
      return data;
    },
  });

  const {
    data: address,
    trigger: fetchAddress,
    isMutating: isFetchingAddress,
    reset: resetAddress,
  } = useAction({
    action: readAddressBySection,
  });

  useEffect(() => {
    if (ref.current) {
      scrollToElement(ref.current, 12);
    }
  }, [address]);

  return (
    <Fieldset>
      <div ref={formRef}></div>
      <FieldGroup>
        <Field name="user.password">
          <Label>Cadastre sua Senha</Label>
          <Input type="password" />
        </Field>
      </FieldGroup>
      <FieldGroup className="mt-3 grid grid-cols-2 gap-3">
        <Field name={"user.info.zoneId"} className="col-span-1">
          <Label>Zona</Label>
          <Listbox
            data={zones}
            displayValueKey="number"
            onChange={async (e) => await fetchSections(e.id)}
          >
            {(i) => i.number}
          </Listbox>
        </Field>
        <Field name={"user.info.sectionId"} className="col-span-1">
          <Label>Seção</Label>
          <Combobox
            data={sectionList}
            disabled={!sectionList?.length}
            onChange={async (value) => fetchAddress(value.id)}
            displayValueKey={"number"}
          >
            {(i) => i.displayValue}
          </Combobox>
          <Description className="col-span-2">
            <span className="text-sm text-gray-500">
              Não sabe sua zona e seção?{" "}
              <Link
                target="_blank"
                className="underline"
                href="https://www.tse.jus.br/servicos-eleitorais/titulo-e-local-de-votacao/titulo-e-local-de-votacao"
              >
                Consulte o TSE.
              </Link>
            </span>
          </Description>
        </Field>

        <div className="col-span-2 pb-6">
          <div>
            {address && (
              <div
                ref={ref}
                className={clsx("mb-6 mt-6 border-y border-gray-100 text-left")}
              >
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Local de Votação
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {address.location
                        ? toProperCase(address.location)
                        : "Colégio Eleitoral"}
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
            )}
          </div>

          {poll && (
            <div>
              <SectionTitle>{poll.title}</SectionTitle>
              <PollQuestions form={form} poll={poll} />
            </div>
          )}
        </div>
      </FieldGroup>
    </Fieldset>
  );
}
