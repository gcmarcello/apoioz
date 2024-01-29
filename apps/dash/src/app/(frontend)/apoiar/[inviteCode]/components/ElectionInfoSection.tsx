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
  FieldGroup,
  Fieldset,
  Label,
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
  zones: { data: Zone[]; message: string };
  poll: any;
}) {
  const [showPassword, setShowPassword] = useState(false);

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
        </Field>
        <div className="mt-2 flex rounded-md shadow-sm">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="password"
              {...form.register("user.password", {
                required: true,
                minLength: 6,
              })}
              id="password"
              className="block w-full rounded-none rounded-l-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <button
            onClick={() => setShowPassword(!showPassword)}
            type="button"
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md border-none bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            {showPassword ? (
              <EyeSlashIcon
                className="-ml-0.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            ) : (
              <EyeIcon
                className="-ml-0.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </FieldGroup>
      <FieldGroup className="mt-3 grid grid-cols-2 gap-3">
        <div className="col-span-1">
          <ListboxField
            hform={form}
            label="Zona"
            name={"user.info.zoneId"}
            data={zones.data}
            displayValueKey="number"
            onChange={async (e) => await fetchSections(e.id)}
          />
        </div>
        <div className="col-span-1">
          <ComboboxField
            hform={form}
            data={sectionList}
            disabled={!sectionList?.length}
            onChange={async (value) => fetchAddress(value.id)}
            name={"user.info.sectionId"}
            label="Seção"
            displayValueKey={"number"}
          />
        </div>
        <div className="col-span-2">
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
        </div>
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
