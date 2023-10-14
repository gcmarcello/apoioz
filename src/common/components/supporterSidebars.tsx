"use client";
import { Dispatch, Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LinkIcon } from "@heroicons/react/20/solid";
import { AddressType, SectionType, ZoneType } from "../types/locationTypes";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import ComboboxInput from "./combobox";
import { toProperCase } from "../utils/format";
import ErrorAlert from "./errorAlert";
import InputMask from "react-input-mask";
import { normalizePhone } from "../utils/format";
import { usePanel } from "../hooks/usePanel";
import QRCode from "react-qr-code";
import Link from "next/link";
import Toast from "./toast";
import { mockSupporter } from "../tests/mockSupporter";
import { Campaign } from "@prisma/client";

export default function SupporterSideBar({
  open,
  setOpen,
  userId,
}: {
  open: boolean;
  setOpen: Dispatch<boolean>;
  userId: string;
}) {
  const {
    setUpdatingLatestSupporters,
    setShowToast,
    siteURL,
    campaign,
    supporter,
  } = usePanel();

  const [option, setOption] = useState<string | null>(null);
  const [sectionList, setSectionList] = useState<SectionType[]>([]);
  const [displayAddress, setDisplayAddress] = useState<AddressType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<null | HTMLDivElement>(null);
  const errRef = useRef<null | HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      sectionId: "",
      zoneId: "",
      birthDate: "",
      campaign: {
        referralId: supporter?.id,
        campaignId: campaign?.id,
      },
    },
  });

  useEffect(() => {
    setValue("campaign.referralId", supporter?.id);
  }, [supporter, setValue]);

  async function addMockSupporter(e) {
    e.preventDefault();
    await addSupporter(await mockSupporter(campaign.id, supporter!.id));
  }

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
        `/api/locations/address/${
          sectionList.find((section: SectionType) => section.id === value)
            ?.addressId
        }`
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

  const addSupporter = async (supporterInfo: any) => {
    try {
      if (campaign.cityId) supporterInfo.cityId = campaign.cityId;
      if (campaign.stateId) supporterInfo.stateId = campaign.stateId;
      supporterInfo.phone = normalizePhone(supporterInfo.phone);
      await axios.post(`/api/supporter/`, supporterInfo);
      setUpdatingLatestSupporters(true);
      setShowToast({
        show: true,
        message: `${supporterInfo.name} já faz parte da transformação!`,
        title: "Apoiador adicionado com sucesso!",
        variant: "success",
      });
      setOpen(false);
    } catch (error: any) {
      setShowToast({
        show: true,
        message: `${error.message}`,
        title: "Erro",
        variant: "error",
      });
      setError("root.serverError", {
        type: "400",
        message: error.response.data?.message || "Erro inesperado",
      });
      setTimeout(() => {
        errRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 350);
    }
  };

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => {
        setOption(null);
        setDisplayAddress(null);
        reset();
      }}
    >
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <div className="fixed inset-0" />
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form
                    className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                    onSubmit={handleSubmit(addSupporter)}
                  >
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="fixed w-full bg-indigo-700 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            Adicionar Apoiador
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Fechar menu</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-indigo-300">
                            Complete os campos e faça parte da transformação.
                          </p>
                          <button onClick={(e) => addMockSupporter(e)}>
                            Teste
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between mt-28">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          {!option && (
                            <div className="flex flex-col gap-8 pb-4 pt-20">
                              <button
                                onClick={() => setOption("add")}
                                type="button"
                                className="rounded-md mx-auto bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                <UserPlusIcon className="h-30 w-30 text-indigo-500 group-hover:text-indigo-900" />
                                Adicionar Apoiador
                              </button>
                              <button
                                onClick={() => setOption("share")}
                                type="button"
                                className="rounded-md mx-auto bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                              >
                                <LinkIcon className="h-30 w-30 text-gray-400 group-hover:text-gray-500" />
                                Compartilhar Link
                              </button>
                            </div>
                          )}
                          {option === "share" && (
                            <div className="space-y-6 pb-5 pt-8 flex flex-col items-center">
                              <QRCode
                                className="rounded-md h-[250px] w-[250px]"
                                value={`${siteURL}/apoiar/${campaign.id}?referral=${userId}`}
                              />

                              <div className="w-[300px] space-y-4">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigator.clipboard.writeText(
                                      `${siteURL}/apoiar/${campaign.id}?referral=${userId}`
                                    );
                                    setShowToast({
                                      message: "Link copiado!",
                                      show: true,
                                      title: "Sucesso",
                                      variant: "success",
                                    });
                                  }}
                                  className="rounded-md w-full bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                  Copiar Link
                                </button>
                                <Link
                                  href={`https://wa.me/?text=${siteURL}/apoiar/${campaign.id}?referral=${userId}`}
                                  target="_blank"
                                >
                                  <div className="flex my-4 rounded-md justify-center space-x-2 bg-green-500 hover:bg-green-400 px-3 py-2 text-sm font-semibold text-white">
                                    <svg
                                      role="button"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 fill-white"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                    <div>Compartilhar no WhatsApp</div>
                                  </div>
                                </Link>
                              </div>
                            </div>
                          )}
                          {option === "add" && (
                            <div className="space-y-6 pb-5 pt-6">
                              <div className="flex items-center">
                                <h4 className="block text-lg font-medium leading-6 text-gray-900">
                                  Adicionar Manualmente
                                </h4>
                              </div>
                              {errors.root?.serverError.message ? (
                                <div ref={errRef} className="scroll-mt-64">
                                  <ErrorAlert
                                    errors={[errors.root.serverError.message]}
                                  />
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
                                    {...register("phone", { required: true })}
                                    name="phone"
                                    id="phone"
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
                                    {...register("birthDate", {
                                      required: true,
                                      minLength: 10,
                                    })}
                                    name="birthDate"
                                    id="birthDate"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    mask="99/99/9999"
                                  />
                                </div>
                              </div>
                              <div className="grid gap-3 grid-cols-2">
                                <div className="col-span-1">
                                  <label
                                    htmlFor="location"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                  >
                                    Zona
                                  </label>
                                  <select
                                    id="zone"
                                    {...register("zoneId", {
                                      onChange: (e) =>
                                        fetchSections(e.target.value),
                                    })}
                                    className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={""}
                                  >
                                    <option disabled value={""}>
                                      Selecione
                                    </option>
                                    {campaign.zones.map((zone: ZoneType) => (
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
                                      name="sectionId"
                                      control={control}
                                      defaultValue={""}
                                      render={({
                                        field: { onChange, value },
                                      }) => (
                                        <ComboboxInput
                                          data={sectionList}
                                          disabled={!sectionList.length}
                                          onChange={(value: string) =>
                                            handleComboBoxChange(
                                              onChange,
                                              value
                                            )
                                          }
                                          value={value}
                                        />
                                      )}
                                    ></Controller>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {isLoading && (
                            <div className="flex items-center justify-center">
                              <svg
                                className="animate-spin w-[50px] h-[50px] mt-24"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-10"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="rgb(67, 56, 202)"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </div>
                          )}
                          {displayAddress && !isLoading && (
                            <div
                              ref={ref}
                              className="mt-6 border-t border-gray-100"
                            >
                              <dl className="divide-y divide-gray-100">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6 text-gray-900">
                                    Local de Votação
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {toProperCase(displayAddress.location)}
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6 text-gray-900">
                                    Endereço
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                    {toProperCase(
                                      displayAddress.address +
                                        ", " +
                                        displayAddress.City?.name
                                    )}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => {
                          if (option) {
                            setOption(null);
                            reset();
                            setDisplayAddress(null);
                          } else setOpen(false);
                        }}
                      >
                        Voltar
                      </button>
                      {option === "add" && (
                        <button
                          type="submit"
                          className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                          Salvar
                        </button>
                      )}
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
