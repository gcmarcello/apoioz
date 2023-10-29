"use client";
import { toProperCase } from "@/(shared)/utils/format";
import {
  CreateSupportersDto,
  createSupportersDto,
} from "@/backend/dto/schemas/supporters/supporters";
import { getAddressBySection } from "@/backend/resources/elections/locations/locations.actions";
import { getSectionsByZone } from "@/backend/resources/elections/sections/sections.actions";
import { getZonesByCampaign } from "@/backend/resources/elections/zones/zones.actions";
import { createSupporter } from "@/backend/resources/supporters/supporters.actions";
import ComboboxInput from "@/frontend/(shared)/components/Combobox";
import { MaskedTextField, TextField } from "@/frontend/(shared)/components/Fields";
import { Mocker } from "@/frontend/(shared)/components/Mocker";
import ErrorAlert from "@/frontend/(shared)/components/alerts/errorAlert";
import { showToast } from "@/frontend/(shared)/components/alerts/toast";
import { da, fakerPT_BR } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { Campaign, Prisma, Section, Zone } from "@prisma/client";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller, UseFormReturn } from "react-hook-form";
import useSWRMutation from "swr/mutation";

export function AddSupporterForm({
  campaign,
  setFormContext,
}: {
  campaign: Campaign;
  setFormContext: any;
}) {
  const ref = useRef<null | HTMLDivElement>(null);
  const errRef = useRef<null | HTMLDivElement>(null);

  const form = useForm<CreateSupportersDto>({
    resolver: zodResolver(createSupportersDto as any),
    mode: "onChange",
  });

  const { data: zones, trigger: fetchZones } = useSWRMutation(
    "getZonesByCampaign",
    (url: string, { arg }: { arg: string }) => getZonesByCampaign(arg)
  );

  const { data: sections, trigger: fetchSections } = useSWRMutation(
    "getSectionsByZone",
    (url: string, { arg }: { arg: string }) => getSectionsByZone(arg)
  );

  const {
    data: address,
    trigger: fetchAddress,
    isMutating: isFetchingAddress,
    reset: resetAddress,
  } = useSWRMutation("getAddressBySection", (url: string, { arg }: { arg: string }) =>
    getAddressBySection(arg)
  );

  const {
    data: supporter,
    trigger: addSupporter,
    error,
  } = useSWRMutation(
    "addSupporter",
    (url: string, { arg }: { arg: CreateSupportersDto }) =>
      createSupporter(arg)
        .then((supporter) => {
          showToast({
            message: `${supporter?.user.name} adicionado a campanha`,
            variant: "success",
            title: "Apoiador Adicionado",
          });
          form.reset();
        })
        .catch(({ message }) => showToast({ message, variant: "error", title: "Erro" }))
  );

  useEffect(() => {
    fetchZones(campaign.id);
  }, []);

  useEffect(() => {
    if (!form) return;
    setFormContext({
      submit: form.handleSubmit((data) => addSupporter(data)),
      reset: form.reset,
      isSubmitting: form.formState.isSubmitting,
      isValid: form.formState.isValid,
    });
  }, [form]);

  async function generateFakeData() {
    if (!zones) return;
    const zone = zones[Math.floor(Math.random() * zones.length)];

    const sections = await fetchSections(zone.id);
    if (!sections) return;

    form.setValue("name", fakerPT_BR.person.fullName());
    form.setValue("email", fakerPT_BR.internet.email());
    form.setValue("info.phone", fakerPT_BR.phone.number());
    form.setValue("info.zoneId", zone.id);
    form.setValue(
      "info.sectionId",
      sections[Math.round(Math.random() * sections.length)].id
    );
    form.setValue(
      "info.birthDate",
      dayjs(fakerPT_BR.date.past().toISOString()).format("DD/MM/YYYY")
    );
    form.trigger("name");
  }

  if (!zones) return <></>;

  return (
    <form>
      <div className="space-y-6 pb-5 pt-6">
        <Mocker
          mockData={generateFakeData}
          submit={form.handleSubmit((data) => addSupporter(data))}
        />
        <div className="flex items-center">
          <h4 className="block text-lg font-medium leading-6 text-gray-900">
            Adicionar Manualmente
          </h4>
        </div>
        {form.formState.errors.root?.serverError.message ? (
          <div ref={errRef} className="scroll-mt-64">
            <ErrorAlert
              errors={[form.formState.errors.root.serverError.message as string]}
            />
          </div>
        ) : null}
        <TextField
          label="Nome do Apoiador"
          {...form.register("name", { required: true })}
          options={{
            errorMessage: form.formState.errors.name?.message as string,
          }}
        />
        <TextField
          label="Email"
          {...form.register("email", { required: true })}
          options={{
            errorMessage: form.formState.errors.name?.message as string,
          }}
        />
        <MaskedTextField
          label="Celular"
          options={{
            errorMessage: form.formState.errors.name?.message as string,
          }}
          mask={{
            control: form.control,
            fieldName: "info.phone",
            value: "(99) 99999-9999",
          }}
        />
        <MaskedTextField
          label="Data de Nascimento"
          options={{
            errorMessage: form.formState.errors.name?.message as string,
          }}
          mask={{
            control: form.control,
            fieldName: "info.birthDate",
            value: "99/99/9999",
          }}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-1">
            <label
              htmlFor="location"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Zona
            </label>
            <select
              id="zone"
              {...form.register("info.zoneId")}
              onChange={(event) => fetchSections(event.target.value)}
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={""}
            >
              <option disabled value={""}>
                Selecione
              </option>
              {zones.map((zone: Zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.number.toString()}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <label
              htmlFor="project-name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Seção
            </label>
            <div className="mt-2">
              <Controller
                name="info.sectionId"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <ComboboxInput
                    rawData={sections}
                    disabled={!sections}
                    onChange={(value: Section) => {
                      onChange(value.id);
                      fetchAddress(value.id);
                    }}
                    value={value}
                    displayValueKey={"number"}
                    reverseOptions={true}
                  />
                )}
              />
            </div>
          </div>
        </div>
        {address && (
          <div ref={ref} className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Local de Votação
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {toProperCase(address.location || "")}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Endereço</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {toProperCase(address.address + ", " + address.City?.name)}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </form>
  );
}
