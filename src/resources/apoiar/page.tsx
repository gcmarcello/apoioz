"use client";
import { Switch } from "@headlessui/react";
import { useRef, useState } from "react";
import clsx from "clsx";
import InputMask from "react-input-mask";
import { Controller, useForm } from "react-hook-form";
import ComboboxInput from "../../common/components/combobox";
import ErrorAlert from "../../common/components/errorAlert";
import { AddressType, SectionType, ZoneType } from "../../common/types/locationTypes";
import axios from "axios";
import { normalizePhone } from "../../common/utils/normalize";
import toProperCase from "../../common/functions/toProperCase";
import { EyeIcon, EyeSlashIcon, UserIcon } from "@heroicons/react/24/outline";
import { BarsArrowUpIcon, EnvelopeIcon, UsersIcon } from "@heroicons/react/24/solid";
import { redirect } from "next/navigation";
import AddSupporterSuccess from "./components/addSupporterSuccess";

export default function SupporterSignUpPage({ referral, campaign }: { referral: any; campaign: any }) {
  const [willAddPassword, setWillAddPassword] = useState(false);
  const [sectionList, setSectionList] = useState<SectionType[]>([]);
  const [displayAddress, setDisplayAddress] = useState<AddressType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const ref = useRef<null | HTMLDivElement>(null);
  const errRef = useRef<null | HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    control,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      sectionId: "",
      password: "",
      zoneId: "",
      campaign: {
        referralId: referral?.id,
        campaignId: campaign.id,
      },
    },
  });

  const addSupporter = async (supporterInfo: any) => {
    try {
      if (campaign.cityId) supporterInfo.cityId = campaign.cityId;
      if (campaign.stateId) supporterInfo.stateId = campaign.stateId;
      supporterInfo.phone = normalizePhone(supporterInfo.phone);
      await axios.post(`/api/supporter/`, supporterInfo);
      setSuccess(true);
    } catch (error: any) {
      setError("root.serverError", {
        type: "400",
        message: error.response.data?.message || "Erro inesperado",
      });
    }
  };

  const fetchSections = async (zoneId: string) => {
    try {
      setDisplayAddress(null);
      resetField("sectionId");
      setIsLoading(true);
      const { data } = await axios.get(`/api/locations/sections/${zoneId}/`);
      setSectionList(data);
    } catch (error: any) {
      setError("root.serverError", {
        type: "400",
        message: error.response.data?.message || "Erro inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComboBoxChange = async (onChange: any, value: string) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `/api/locations/address/${sectionList.find((section: SectionType) => section.id === value)?.addressId}`
      );
      setDisplayAddress(data);
      onChange(value);
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350);
    } catch (error: any) {
      setError("root.serverError", {
        type: "400",
        message: error.response.data?.message || "Erro inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) return <AddSupporterSuccess campaign={campaign} />;

  return (
    <div className="isolate bg-white px-6 py-8  lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl ">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{campaign.name}</h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Preencha seus dados abaixo para fazer parte da nossa rede de apoio!
        </p>
        {referral && (
          <div className="my-4 inline-flex text-gray-500 hover:text-gray-600">
            <UserIcon className="h-6 w-6 me-2" /> <p>Convidado por {referral.name}</p>
          </div>
        )}
        <form
          className="flex h-full flex-col divide-y divide-gray-200  text-left"
          onSubmit={handleSubmit(addSupporter)}
        >
          <div className="space-y-4 pb-5 ">
            {errors.root?.serverError.message ? (
              <div ref={errRef} className="scroll-mt-64">
                <ErrorAlert errors={[errors.root.serverError.message]} />
              </div>
            ) : null}
            <div>
              <label htmlFor="project-name" className="block text-sm font-medium leading-6 text-gray-900">
                Nome do Apoiador
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="ex. João Silva"
                  {...register("name", { required: true })}
                  id="name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  autoComplete="email"
                  placeholder="ex. joao@silva.com"
                  {...register("email", { required: true })}
                  id="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="project-name" className="block text-sm font-medium leading-6 text-gray-900">
                Celular
              </label>
              <div className="mt-2">
                <InputMask
                  type="text"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="ex. 999999999"
                  {...register("phone", { required: true })}
                  name="phone"
                  id="phone"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  mask="(99) 99999-9999"
                />
              </div>
            </div>
            <div className="relative flex items-start">
              <div className="flex h-6 items-center">
                <input
                  id="candidates"
                  aria-describedby="candidates-description"
                  name="candidates"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  onChange={(event) => {
                    setWillAddPassword(event.target.checked);
                    resetField("password");
                    setShowPassword(false);
                  }}
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label htmlFor="candidates" className="font-medium text-gray-900">
                  <span className="me-1">Configurar senha</span>
                  <span id="candidates-description" className="text-gray-500">
                    <span className="sr-only">Configurar senha </span>para ter acesso ao painel de controle.
                  </span>
                </label>{" "}
              </div>
            </div>
            {willAddPassword && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Senha
                </label>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <div className="relative flex flex-grow items-stretch focus-within:z-10">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="password"
                      {...register("password", { required: true })}
                      id="password"
                      className="block w-full rounded-none rounded-l-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    className="relative -ml-px inline-flex items-center gap-x-1.5 border-none rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    ) : (
                      <EyeIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            )}
            <div className="grid gap-3 grid-cols-2">
              <div className="col-span-1">
                <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                  Zona
                </label>
                <select
                  id="zone"
                  {...register("zoneId", { onChange: (e) => fetchSections(e.target.value) })}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                >
                  <option disabled value={""}>
                    Selecione
                  </option>
                  {campaign.zones?.map((zone: ZoneType) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.number.toString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="project-name" className="block text-sm font-medium leading-6 text-gray-900">
                  Seção
                </label>
                <div className="mt-2">
                  <Controller
                    name="sectionId"
                    control={control}
                    defaultValue={""}
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <ComboboxInput
                        data={sectionList}
                        disabled={!sectionList.length}
                        onChange={(value: string) => handleComboBoxChange(onChange, value)}
                        value={value}
                      />
                    )}
                  ></Controller>
                </div>
              </div>
            </div>
          </div>
          {displayAddress && !isLoading && (
            <div ref={ref} className="mt-6 border-t border-gray-100 text-left">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Local de Votação</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {toProperCase(displayAddress.location)}
                  </dd>
                </div>
                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">Endereço</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {toProperCase(displayAddress.address + ", " + displayAddress.Zone?.City?.name)}
                  </dd>
                </div>
              </dl>
            </div>
          )}
          <button
            disabled={!isValid}
            type="submit"
            className=" inline-flex justify-center rounded-md disabled:bg-indigo-300 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Inscrever
          </button>
        </form>
      </div>
    </div>
  );
}
