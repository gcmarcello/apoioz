"use client";
import SelectListbox, {
  ListboxOptionType,
} from "@/frontend/shared/components/SelectListbox";
import {
  ChevronUpDownIcon,
  CheckIcon,
  InformationCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { Party, State } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import CheckoutTotal from "./CheckoutTotal";
import { getCities } from "@/backend/resources/locations/locations.service";
import Image from "next/image";
import {
  getZonesByCity,
  getZonesByState,
} from "@/backend/resources/zones/zones.service";
import { getSectionsByZone } from "@/backend/resources/sections/sections.service";
import { Button } from "@/frontend/panel/(shared)/components/button";
import dayjs from "dayjs";
import axios from "axios";
import ErrorAlert from "@/frontend/shared/components/errorAlert";

export default function RegistrarPage({
  parties,
  states,
}: {
  parties: Party[];
  states: State[];
}) {
  const [campaignLevel, setCampaignLevel] = useState<
    "municipal" | "estadual" | null
  >(null);
  const errRef = useRef<null | HTMLDivElement>(null);
  const [cities, setCities] = useState<ListboxOptionType[]>([]);
  const [zones, setZones] = useState<ListboxOptionType[]>([]);
  const [sections, setSections] = useState<ListboxOptionType[]>([]);
  const form = useForm();
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
  const parsedParties: ListboxOptionType[] = [
    { id: "0", name: "Sem Partido", value: "" },
  ].concat(
    parties.map((party) => ({
      id: party.id,
      name: party.id,
      value: party.id,
    }))
  );
  const parsedStates: ListboxOptionType[] = states.map((state) => ({
    id: state.id,
    name: state.name,
    value: state.id,
  }));

  const handleSubmit = async (data: any) => {
    const body = {
      user: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        stateId: data.state.id,
        cityId: data.city.id,
        zoneId: data.zone.id,
        sectionId: data.section.id,
        birthDate: data.birthDate,
      },
      campaign: {
        type: data.campaignType.value,
        name: `${data.name} ${dayjs().year().toString()}`,
        partyId: data.party.value,
        cityId: data.city.id,
        stateId: data.state.id,
        year: dayjs().year().toString(),
      },
    };
    try {
      const { data: response } = await axios.post("/api/auth/signup", body);
      if (response.user === "success") {
        window.location.href = "/auth/login";
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

  useEffect(() => {
    if (!form.watch("state")) return;
    form.resetField("city");
    getCities({ stateId: form.watch("state").id }).then((cities) => {
      setCities(
        cities.map((city) => ({ id: city.id, name: city.name, value: city.id }))
      );
    });
  }, [form.watch("state")]);

  useEffect(() => {
    if (
      form.watch("campaignType") === "conselheiro" ||
      form.watch("campaignType") === "vereador" ||
      form.watch("campaignType") === "prefeito"
    ) {
      setCampaignLevel("municipal");
    } else {
      setCampaignLevel("estadual");
    }
  }, [form]);

  useEffect(() => {
    if (!form.watch("city")) return;
    getZonesByCity(form.watch("city")?.id).then((zones) =>
      setZones(
        zones.zones.map((zone) => ({
          id: zone.id,
          name: zone.number,
          value: zone.id,
        }))
      )
    );
  }, [form.watch("city")]);

  useEffect(() => {
    if (!form.watch("zone")) return;
    getSectionsByZone(form.watch("zone")?.id).then((sections) => {
      setSections(
        sections.map((section) => ({
          id: section.id,
          name: section.number,
          value: section.id,
        }))
      );
    });
  }, [form.watch("zone")]);

  return (
    <div className="bg-white">
      {/* Background color split screen for large screens */}

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
              <Image
                src={"/logo.svg"}
                alt="logo"
                height={80}
                width={80}
              ></Image>
              <span className="ms-2 text-xl font-bold text-white">
                Cadastro
              </span>
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
                <div ref={errRef} className="scroll-mt-64">
                  <ErrorAlert
                    errors={[form.formState.errors.root.serverError.message]}
                  />
                </div>
              ) : null}
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

                <div className="mt-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nome Completo
                  </label>
                  <div className="mt-1">
                    <input
                      {...form.register("name", { required: true })}
                      type="text"
                      id="name"
                      name="name"
                      autoComplete="name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Endereço de Email
                  </label>
                  <div className="mt-1">
                    <input
                      {...form.register("email", { required: true })}
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                  <div className="col-span-4 sm:col-span-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Telefone de Contato
                    </label>
                    <div className="mt-1">
                      <InputMask
                        type="text"
                        inputMode="numeric"
                        autoComplete="phone"
                        {...form.register("phone", { required: true })}
                        name="phone"
                        id="phone"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        mask={"(99) 99999-9999"}
                      />
                    </div>
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label
                      htmlFor="birthDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Data de Nascimento
                    </label>
                    <div className="mt-1">
                      <InputMask
                        type="text"
                        inputMode="numeric"
                        autoComplete="birthDate"
                        {...form.register("birthDate", { required: true })}
                        name="birthDate"
                        id="birthDate"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        mask={"99/99/9999"}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                  <div className="col-span-4 sm:col-span-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Senha
                    </label>
                    <div className="mt-1">
                      <input
                        {...form.register("password", { required: true })}
                        type="password"
                        id="password"
                        name="password"
                        autoComplete="password"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirmar Senha
                    </label>
                    <div className="mt-1">
                      <input
                        {...form.register("confirmPassword", {
                          required: true,
                          validate: (value) => value === form.watch("password"),
                        })}
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        autoComplete="phone"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">
                  Informações da sua campanha
                </h3>
                <h4 className="text-sm text-gray-500">
                  Aqui vão os dados da campanha e a zona/seção do candidato.
                </h4>
                <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6 sm:grid-cols-4">
                  <div
                    className={clsx(
                      "col-span-4",
                      form.watch("campaignType")?.value !== "conselheiro" &&
                        "sm:col-span-2"
                    )}
                  >
                    <div className="mt-1">
                      <SelectListbox
                        options={campaignTypes}
                        label={"Tipo de Campanha"}
                        formLabel={"campaignType"}
                        form={form}
                      />
                    </div>
                  </div>

                  {form.watch("campaignType")?.value !== "conselheiro" && (
                    <div className="col-span-4 sm:col-span-2">
                      <div className="mt-1">
                        <SelectListbox
                          options={parsedParties}
                          label={"Partido Político"}
                          formLabel={"party"}
                          form={form}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                  <div className={clsx("col-span-4 sm:col-span-2")}>
                    <div className="mt-1">
                      <SelectListbox
                        options={parsedStates}
                        label={"Estado"}
                        formLabel={"state"}
                        form={form}
                      />
                    </div>
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <div className="mt-1">
                      <SelectListbox
                        options={cities}
                        label={"Cidade"}
                        formLabel={"city"}
                        form={form}
                        disabled={!cities.length}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                  {form.watch("city") && (
                    <div
                      className={clsx(
                        "col-span-4",
                        sections.length && "sm:col-span-2"
                      )}
                    >
                      <div className="mt-1">
                        <SelectListbox
                          options={zones}
                          label={"Zona"}
                          formLabel={"zone"}
                          form={form}
                          disabled={!zones.length}
                          reverseOptions={true}
                        />
                      </div>
                    </div>
                  )}

                  {form.watch("zone") && sections.length ? (
                    <div className="col-span-4 sm:col-span-2">
                      <div className="mt-1">
                        <SelectListbox
                          options={sections}
                          label={"Seção"}
                          formLabel={"section"}
                          form={form}
                          disabled={!sections.length}
                          reverseOptions={true}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="my-4 flex justify-end">
                <Button type="submit" variant="primary">
                  Finalizar Pagamento
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
