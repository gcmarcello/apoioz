import { Address, Campaign, Zone } from "prisma/client";
import { useEffect, useMemo, useRef } from "react";
import { readSectionsByZone } from "@/app/api/elections/sections/action";
import { readAddresses } from "@/app/api/elections/locations/actions";
import { toProperCase } from "@/_shared/utils/format";
import clsx from "clsx";
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
  useAction,
  useFormContext,
} from "odinkit/client";
import { PollQuestions } from "./PollQuestions";
import { SectionTitle } from "@/app/(frontend)/_shared/components/text/SectionTitle";
import { scrollToElement } from "@/app/(frontend)/_shared/utils/scroll";
import { SignUpAsSupporterDto } from "@/app/api/auth/dto";
import Link from "next/link";
import { readAddressFulltext } from "@/app/api/elections/locations/actions";
import { Tabs, Text } from "odinkit";

export function ElectionInfoSection({
  zones,
  poll,
  campaign,
}: {
  zones: Zone[];
  campaign: Campaign;
  poll: any;
}) {
  const ref = useRef<null | HTMLDivElement>(null);
  const formRef = useRef<null | HTMLDivElement>(null);

  const form = useFormContext<SignUpAsSupporterDto>();

  const Field = useMemo(() => form.createField(), []);

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
    requestParser: (req) => {
      if (req?.where) req.where.campaignId = campaign.id;
      return req;
    },
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
    if (ref.current) {
      scrollToElement(ref.current, 12);
    }
  }, [address]);

  useEffect(() => {
    if (form.getValues("user.info.addressId")) {
      searchAddress();
    }
  }, [form.watch("user.info.addressId")]);

  return (
    <Fieldset>
      <div ref={formRef}></div>

      <FieldGroup className="">
        <div className="w-full">
          <p className="text-base/6 font-medium text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6">
            Local de Votação
          </p>
          <Tabs
            className="flex justify-start py-2"
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
                        inputMode="numeric"
                        onChange={(value) => {
                          form.setValue("user.info.sectionId", undefined);
                          if (value) {
                            fetchSections(value.id);
                          }
                        }}
                      >
                        {(zone) => <ListboxLabel>{zone.number}</ListboxLabel>}
                      </Listbox>
                      <ErrorMessage />
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
                    <Label>Local</Label>
                    <Combobox
                      data={(fulltextAddresses || addresses) as Address[]}
                      displayValueKey="location"
                      placeholder="ex.: Escola X"
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
                    <ErrorMessage />
                  </Field>
                ),
              },
            ]}
          />
        </div>
      </FieldGroup>
      <FieldGroup>
        <Field name="user.password">
          <Label>Cadastre sua Senha</Label>
          <Input type="password" />
        </Field>
      </FieldGroup>
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
                      address?.address + ", " + address?.neighborhood
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
    </Fieldset>
  );
}
