"use client";
import ComboboxInput from "@/app/(frontend)/_shared/components/Combobox";
import { Mocker } from "@/app/(frontend)/_shared/components/Mocker";
import ErrorAlert from "@/app/(frontend)/_shared/components/alerts/errorAlert";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import { getAddressBySection } from "@/app/api/elections/locations/actions";
import { getSectionsByZone } from "@/app/api/elections/sections/action";
import { getZonesByCampaign } from "@/app/api/elections/zones/actions";
import { CreateSupportersDto, createSupportersDto } from "@/app/api/panel/supporters/dto";
import { createSupporter } from "@/app/api/panel/supporters/actions";
import { fakerPT_BR } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { Campaign, Section, Zone } from "@prisma/client";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  MaskedTextField,
  TextField,
} from "@/app/(frontend)/_shared/components/fields/TextField";
import { SelectField } from "@/app/(frontend)/_shared/components/fields/SelectField";
import { useAction } from "@/app/(frontend)/_shared/hooks/useAction";
import { toProperCase } from "@/_shared/utils/format";
import { MetaForm } from "@/app/(frontend)/_shared/hooks/useMetaform";

export function AddSupporterForm({
  campaign,
  setMetaform,
}: {
  campaign: Campaign;
  setMetaform: Dispatch<SetStateAction<MetaForm>>;
}) {
  const ref = useRef<null | HTMLDivElement>(null);
  const errRef = useRef<null | HTMLDivElement>(null);

  const form = useForm<CreateSupportersDto>({
    resolver: zodResolver(createSupportersDto as any),
    mode: "onChange",
  });

  const { data: zones, trigger: fetchZones } = useAction({
    action: getZonesByCampaign,
  });

  const { data: sections, trigger: fetchSections } = useAction({
    action: getSectionsByZone,
  });

  const {
    data: address,
    trigger: fetchAddress,
    isMutating: isFetchingAddress,
    reset: resetAddress,
  } = useAction({
    action: getAddressBySection,
  });

  const { data: supporter, trigger: addSupporter } = useAction({
    action: createSupporter,
    onError: (err) => showToast({ message: err, variant: "error", title: "Erro" }),
    onSuccess: (res) => {
      if (typeof supporter !== "object") return;
      showToast({
        message: `${res.data.user.name} adicionado a campanha`,
        variant: "success",
        title: "Apoiador Adicionado",
      });
      form.reset();
    },
  });

  useEffect(() => {
    fetchZones(campaign.id);
  }, []);

  useEffect(() => {
    if (!form) return;
    setMetaform({
      submit: addSupporter,
      form: form,
    });
  }, [form]);

  async function generateFakeData() {
    if (!zones) return;
    const zone = zones[Math.floor(Math.random() * zones.length)];

    const sections = await fetchSections(zone.id);
    if (!sections) return;

    form.setValue("name", fakerPT_BR.person.fullName());
    form.setValue("email", fakerPT_BR.internet.email());
    form.setValue("phone", fakerPT_BR.phone.number());
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
            fieldName: "phone",
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
            <SelectField
              label="Zona"
              defaultValue={""}
              {...form.register("info.zoneId")}
              onChange={(event) => fetchSections(event.target.value)}
            >
              <option disabled value={""}>
                Selecione
              </option>
              {zones.map((zone: Zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.number.toString()}
                </option>
              ))}
            </SelectField>
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
