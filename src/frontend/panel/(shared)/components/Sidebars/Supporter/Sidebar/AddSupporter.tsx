import { normalizePhone, toProperCase } from "@/(shared)/utils/format";
import {
  CreateSupportersDto,
  createSupportersDto,
} from "@/backend/dto/schemas/supporters/supporters";
import { getAddressBySection } from "@/backend/resources/elections/locations/locations.actions";
import { getSectionsByZone } from "@/backend/resources/elections/sections/sections.actions";
import { getZonesByCampaign } from "@/backend/resources/elections/zones/zones.actions";
import { createSupporter } from "@/backend/resources/supporters/supporters.actions";
import ComboboxInput from "@/frontend/(shared)/components/Combobox";
import { Mocker } from "@/frontend/(shared)/components/Mocker";
import ErrorAlert from "@/frontend/(shared)/components/alerts/errorAlert";
import { useActionState } from "@/frontend/(shared)/hooks/useActionState";
import { fakerPT_BR } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { Campaign, Prisma, Zone } from "@prisma/client";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";

export function AddSupporterForm({ campaign }: { campaign: Campaign }) {
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    setValue,
    control,
    setError,
    watch,
    formState: { errors },
  } = useForm<CreateSupportersDto>({
    resolver: zodResolver(createSupportersDto as any),
  });

  const ref = useRef<null | HTMLDivElement>(null);
  const errRef = useRef<null | HTMLDivElement>(null);

  const {
    run: addSupporter,
    error: addSupporterError,
    loading: isAddingSupporter,
    data: addSupporterData,
  } = useActionState(async (supporterInfo: CreateSupportersDto) => {
    supporterInfo.info.phone = normalizePhone(supporterInfo.info.phone);
    supporterInfo.info.sectionId = dayjs(supporterInfo.info.sectionId).toISOString();
    return await createSupporter(supporterInfo);
  });

  const {
    run: getSections,
    error: getSectionsError,
    loading: isGettingSections,
    data: sections,
  } = useActionState(getSectionsByZone);

  const {
    run: getZones,
    error: getZonesError,
    loading: isGettingZones,
    data: zones,
  } = useActionState(getZonesByCampaign);

  const {
    run: getAddress,
    error: getAddressError,
    loading: isGettingAddress,
    data: address,
  } = useActionState(getAddressBySection);

  useEffect(() => {
    getZones(campaign.id);
  }, []);

  useEffect(() => {
    if (getSectionsError) {
      setError("root.serverError", {
        type: "400",
        message: getSectionsError.response.data?.message || "Erro inesperado",
      });
    }
  }, [isGettingSections]);

  useEffect(() => {
    if (addSupporterData) {
      /**
       * setShowToast({
        show: true,
        message: `${addSupporterData.data} já faz parte da transformação!`,
        title: "Apoiador adicionado com sucesso!",
        variant: "success",
      });
       */
    }
    if (addSupporterError) {
      setError("root.serverError", {
        type: "400",
        message: addSupporterError.response.data?.message || "Erro inesperado",
      });
    }
  }, [isAddingSupporter]);

  async function generateFakeData() {
    if (!zones) return;
    const zone = zones[Math.floor(Math.random() * zones.length)];
    await getSections(zone.id);

    if (!sections) return;

    setValue("name", fakerPT_BR.person.fullName());
    setValue("email", fakerPT_BR.internet.email());
    setValue("info.phone", fakerPT_BR.phone.number());
    setValue("info.zoneId", zone.id);
    setValue("info.sectionId", sections[Math.round(Math.random() * sections.length)].id);
    setValue(
      "info.sectionId",
      dayjs(fakerPT_BR.date.past().toISOString()).format("DD/MM/YYYY")
    );
  }

  if (!zones) return <></>;

  return (
    <form
      className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
      onSubmit={handleSubmit(addSupporter)}
    >
      <div className="space-y-6 pb-5 pt-6">
        <Mocker mockData={generateFakeData} submit={handleSubmit(addSupporter)} />
        <div className="flex items-center">
          <h4 className="block text-lg font-medium leading-6 text-gray-900">
            Adicionar Manualmente
          </h4>
        </div>
        {errors.root?.serverError.message ? (
          <div ref={errRef} className="scroll-mt-64">
            <ErrorAlert errors={[errors.root.serverError.message]} />
          </div>
        ) : null}
        <div>
          <label
            htmlFor="project-name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Nome do Apoiador
          </label>
          <div className="mt-2">
            <input
              type="text"
              autoComplete="name"
              {...register("name", { required: true })}
              id="name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email
          </label>
          <div className="mt-2">
            <input
              type="text"
              autoComplete="email"
              {...register("email", { required: true })}
              id="email"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="project-name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Celular
          </label>
          <div className="mt-2">
            <InputMask
              type="text"
              inputMode="numeric"
              autoComplete="tel"
              {...register("info.phone", { required: true })}
              name="info.phone"
              id="info.phone"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              mask="(99) 99999-9999"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="project-name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Data de Nascimento
          </label>
          <div className="mt-2">
            <InputMask
              type="text"
              inputMode="numeric"
              autoComplete="date"
              {...register("info.sectionId", {
                required: true,
                minLength: 10,
              })}
              name="info.sectionId"
              id="info.sectionId"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              mask="99/99/9999"
            />
          </div>
        </div>
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
              {...register("info.zoneId", {
                onChange: getSections,
              })}
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
                control={control}
                defaultValue={""}
                render={({ field: { onChange, value } }) => (
                  <ComboboxInput
                    data={sections}
                    disabled={!sections?.length}
                    onChange={getAddress}
                    value={value}
                  />
                )}
              ></Controller>
            </div>
          </div>
        </div>
      </div>
      {address && !isGettingAddress && (
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
    </form>
  );
}
