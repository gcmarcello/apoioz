"use client";

import { Logo } from "@/app/(frontend)/_shared/components/Logo";
import ErrorAlert from "@/app/(frontend)/_shared/components/alerts/errorAlert";
import {
  ListboxField,
  ComboboxField,
} from "@/app/(frontend)/_shared/components/fields/Select";
import {
  TextField,
  MaskedTextField,
} from "@/app/(frontend)/_shared/components/fields/Text";
import { useAction } from "odinkit/hooks/useAction";
import { Button } from "@/app/(frontend)/_shared/components/Button";
import { SignupDto, signupDto } from "@/app/api/auth/dto";
import { readCitiesByState } from "@/app/api/elections/locations/actions";
import { readSectionsByZone } from "@/app/api/elections/sections/action";
import { readZonesByCity } from "@/app/api/elections/zones/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Party, Section, State } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const campaignTypes = [
  { id: "1", name: "Conselheiro Tutelar", value: "conselheiro" },
  { id: "2", name: "Vereador", value: "vereador" },
  { id: "3", name: "Prefeito", value: "prefeito" },
  {
    id: "4",
    name: "Dep. Estadual (em breve)",
    value: "depestadual",
    disabled: true,
  },
  {
    id: "5",
    name: "Dep. Federal (em breve)",
    value: "depfederal",
    disabled: true,
  },
  {
    id: "6",
    name: "Senador (em breve)",
    value: "senador",
    disabled: true,
  },
];

export default function RegisterPage({
  parties,
  states,
}: {
  parties: Party[];
  states: State[];
}) {
  const errRef = useRef<null | HTMLDivElement>(null);

  const form = useForm<SignupDto>({
    resolver: zodResolver(signupDto),
  });

  const router = useRouter();

  const actualYear = Number(dayjs().year());

  const handleSubmit = async (data: SignupDto) => {
    const body = {
      user: data.user,
      campaign: {
        ...data.campaign,
        name: `${data.campaign.name} ${dayjs().year().toString()}`,
        year: dayjs().year().toString(),
      },
    };
    try {
      const { data: response } = await axios.post("/api/auth/signup", body);
      if (response.user) {
        router.push("/login?success=1");
      }
    } catch (error: any) {
      form.setError("root.serverError", {
        type: "400",
        message: error.response.data?.message || "Erro inesperado",
      });
      setTimeout(() => {
        errRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 350);
    }
  };

  const { trigger: fetchCities, data: cities } = useAction({
    action: readCitiesByState,
    onSuccess: () => {
      resetZones();
      resetSections();
    },
    responseParser: (data) =>
      data.map((city) => ({ id: city.id, name: city.name, value: city.id })),
  });

  const {
    trigger: fetchZones,
    data: zones,
    reset: resetZones,
  } = useAction({
    action: readZonesByCity,
    onSuccess: () => {
      resetSections();
    },
    responseParser: (data) =>
      data.zones.map((zone) => ({
        id: zone.id,
        name: zone.number,
        value: zone.id,
      })),
  });

  const {
    trigger: fetchSections,
    data: sections,
    reset: resetSections,
  } = useAction({
    action: readSectionsByZone,
    responseParser: (data) =>
      data.map((section) => ({
        id: section.id,
        name: section.number,
        value: section.id,
      })),
  });

  return (
    <div className="bg-white">
      <div
        className="fixed right-0 top-0 hidden h-full w-1/2 bg-indigo-900 lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-4 lg:pt-8">
        <h1 className="sr-only">Checkout</h1>

        <section
          aria-labelledby="summary-heading"
          className="fixed z-50 w-full bg-indigo-600 py-3 text-indigo-300 shadow-lg md:px-10 lg:static lg:col-start-2 lg:row-start-1 lg:mx-auto lg:block lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0 lg:shadow-none"
        >
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
            <div className="flex items-center ">
              <Logo /> <span className="ms-2 text-xl font-bold text-white">Cadastro</span>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="payment-and-shipping-heading"
          className="mt-[4rem] px-0 py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:mt-0 lg:w-full lg:max-w-lg lg:px-2 lg:pb-24 lg:pt-0"
        >
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
              {form.formState.errors.root?.serverError.message ? (
                <div ref={errRef} className="mb-4 scroll-mt-64">
                  <ErrorAlert errors={[form.formState.errors.root.serverError.message]} />
                </div>
              ) : null}
              <div className="divide-y">
                <div>
                  <div>
                    <h3
                      id="contact-info-heading"
                      className="text-lg font-medium text-gray-900"
                    >
                      Informação do Líder de Campanha
                    </h3>
                    <h4 className="text-sm text-gray-500">
                      Preencha seus dados para realizar o cadastro de usuário.
                    </h4>
                  </div>

                  <div>
                    <TextField
                      className="mt-6"
                      hform={form}
                      name="user.name"
                      label="Nome Completo"
                    />

                    <TextField
                      className="mt-6"
                      hform={form}
                      name="user.email"
                      label="Endereço de Email"
                    />
                  </div>
                  <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                    <div className="col-span-4 sm:col-span-2">
                      <MaskedTextField
                        hform={form}
                        name="user.phone"
                        autoComplete="phone"
                        inputMode="numeric"
                        type="text"
                        label="Número de Telefone"
                        mask={"(99) 99999-9999"}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <MaskedTextField
                        hform={form}
                        name="user.birthDate"
                        autoComplete="birthDate"
                        inputMode="numeric"
                        type="text"
                        label="Data de Nascimento"
                        mask={"99/99/9999"}
                      />
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                    <div className="col-span-4 sm:col-span-2">
                      <TextField
                        className="mt-6"
                        hform={form}
                        name="user.password"
                        label="Senha"
                        type="password"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <TextField
                        className="mt-6"
                        hform={form}
                        name="user.confirmPassword"
                        label="Confirmar Senha"
                        type="password"
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                    <div className={clsx("col-span-4 sm:col-span-2")}>
                      <div className="mt-1">
                        <ComboboxField
                          data={states}
                          disabled={!states?.length}
                          hform={form}
                          label={"Estado"}
                          name={"user.stateId"}
                          displayValueKey={"name"}
                          onChange={(value) => {
                            fetchZones(value.id);
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <div className="mt-1">
                        <ComboboxField
                          hform={form}
                          label={"Cidade"}
                          data={cities}
                          name={"user.cityId"}
                          displayValueKey={"name"}
                          disabled={!cities?.length}
                          onChange={(value) => {
                            fetchZones(value.id);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                    {form.watch("user.cityId") && (
                      <div
                        className={clsx(
                          "col-span-4",
                          sections?.length && "sm:col-span-2"
                        )}
                      >
                        <div className="mt-1">
                          <ListboxField
                            data={zones}
                            displayValueKey={"name"}
                            label={"Zona Eleitoral"}
                            name={"user.zoneId"}
                            hform={form}
                            disabled={!zones?.length}
                          />
                        </div>
                      </div>
                    )}

                    {form.watch("user.zoneId") && sections?.length ? (
                      <div className="col-span-4 sm:col-span-2">
                        <div className="mt-1">
                          <ListboxField
                            data={sections}
                            displayValueKey={"name"}
                            label={"Seção"}
                            name={"user.sectionId"}
                            hform={form}
                            disabled={!sections?.length}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-10">
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900">
                      Informações da sua campanha
                    </h3>
                    <h4 className="text-sm text-gray-500">
                      Aqui vão os dados da campanha e a zona/seção do candidato.
                    </h4>
                    <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                      <div className="col-span-4 sm:col-span-2">
                        <TextField
                          hform={form}
                          label="Nome da Campanha"
                          name="campaign.name"
                          defaultValue={`${form.watch("user.name") || "Campanha"} ${
                            form.watch("campaign.year") || actualYear
                          }`}
                        />
                      </div>

                      <div className="col-span-4 sm:col-span-2">
                        <ListboxField
                          data={[
                            {
                              id: actualYear,
                              name: actualYear,
                              value: actualYear,
                            },
                            {
                              id: actualYear + 1,
                              name: actualYear + 1,
                              value: actualYear + 1,
                            },
                            {
                              id: actualYear + 2,
                              name: actualYear + 2,
                              value: actualYear + 2,
                            },
                          ]}
                          displayValueKey={"name"}
                          hform={form}
                          name="campaign.year"
                          label="Ano"
                          reverseOptions={true}
                        />
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6 sm:grid-cols-4">
                      <div
                        className={clsx(
                          "col-span-4",
                          form.watch("campaign.type") !== "conselheiro" && "sm:col-span-2"
                        )}
                      >
                        <div className="mt-1">
                          <ListboxField
                            data={campaignTypes}
                            displayValueKey={"name"}
                            hform={form}
                            name={"campaign.type"}
                            label={"Tipo de Campanha"}
                            reverseOptions={true}
                          />
                        </div>
                      </div>

                      {form.watch("campaign.type") !== "conselheiro" && (
                        <div className="col-span-4 sm:col-span-2">
                          <div className="mt-1">
                            <ListboxField
                              data={parties}
                              displayValueKey={"name"}
                              label={"Partido Político"}
                              hform={form}
                              name={"campaign.partyId"}
                              reverseOptions={true}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="my-4 flex justify-end">
                <Button type="submit" variant="primary">
                  Finalizar Cadastro
                </Button>
              </div>

              {/* <CheckoutTotal form={form} /> */}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
