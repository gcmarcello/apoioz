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
import { UserCircleIcon } from "@heroicons/react/24/solid";

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
    action: readAddresses,
  });

  const {
    data: address,
    reset: resetAddress,
    trigger: searchAddress,
  } = useAction({
    requestParser: (req) => {
      if (req?.where) req.where.campaignId = campaign.id;
      return req;
    },
    action: readAddresses,
    responseParser: (res) => res[0],
    onSuccess: (address) => console.log(address),
  });

  useEffect(() => {
    if (ref.current) {
      scrollToElement(ref.current, 12);
    }
  }, [address]);

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
                onClick: () => {
                  form.resetField("user.info.addressId");
                  resetAddress();
                },
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
                              campaignId: campaign.id,
                              location: query,
                            },
                          });
                        } else {
                          searchAddresses({
                            where: {
                              campaignId: campaign.id,
                            },
                          });
                        }
                      }}
                      onChange={(value) => {
                        searchAddress({
                          where: {
                            id: value?.id,
                          },
                        });
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
        {poll && (
          <div>
            <SectionTitle>{poll.title}</SectionTitle>
            <PollQuestions form={form} poll={poll} />
          </div>
        )}

        <div>
          {(form.watch("user.info.zoneId") ||
            form.watch("user.info.addressId")) &&
            form.watch("user.name") && (
              <div ref={ref} className="pb-10 pt-4">
                <div className="lg:col-start-3 lg:row-end-1">
                  <h2 className="sr-only">Summary</h2>
                  <div className="rounded-lg bg-slate-50 shadow-sm ring-1 ring-gray-900/5">
                    <dl className="flex flex-wrap pb-3">
                      <div className="flex-auto pl-6 pt-6 font-semibold leading-6 text-gray-900">
                        Confirmação
                      </div>

                      <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-4">
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
                      {
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
                              const sectionId = form.watch(
                                "user.info.sectionId"
                              );
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
                      }
                    </dl>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </Fieldset>
  );
}
