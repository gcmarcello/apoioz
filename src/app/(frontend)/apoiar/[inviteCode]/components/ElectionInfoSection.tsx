import { EyeSlashIcon, EyeIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { Zone } from "@prisma/client";
import { Controller } from "react-hook-form";
import { Fragment, useRef, useState } from "react";
import { AddressType, SectionType, ZoneType } from "@/_shared/types/locationTypes";
import { getSectionsByZone } from "@/app/api/elections/sections/action";
import { getAddressBySection } from "@/app/api/elections/locations/actions";
import { toProperCase } from "@/_shared/utils/format";
import { PresentationChartBarIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useAction } from "@/app/(frontend)/_shared/hooks/useAction";
import ComboboxField from "@/app/(frontend)/_shared/components/fields/Select";

export function ElectionInfoSection({ form, zones }: { form: any; zones: ZoneType[] }) {
  const [displayAddress, setDisplayAddress] = useState<AddressType | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [willAddPassword, setWillAddPassword] = useState(null);
  const ref = useRef<null | HTMLDivElement>(null);

  const {
    data: sectionList,
    isMutating: isLoading,
    trigger: fetchSections,
  } = useAction({
    action: getSectionsByZone,
    parser: (data) => {
      form.resetField("info.sectionId");
      setDisplayAddress(null);
      return data;
    },
    onError: (error) => {
      form.setError("root.serverError", {
        type: "400",
        message: error || "Erro inesperado",
      });
    },
  });

  const {
    data: address,
    trigger: fetchAddress,
    isMutating: isFetchingAddress,
    reset: resetAddress,
  } = useAction({
    action: getAddressBySection,
  });

  return (
    <>
      <div className="my-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setWillAddPassword(true);
            form.resetField("password");
            setShowPassword(false);
          }}
          className={clsx(
            "mx-auto rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 duration-200 lg:hover:bg-gray-50",
            willAddPassword ? "bg-indigo-600 bg-opacity-100 lg:bg-white" : "bg-opacity-20"
          )}
        >
          <div className="flex flex-col items-center">
            <PresentationChartBarIcon
              className={clsx(
                "h-20 w-20 group-hover:text-indigo-900",
                willAddPassword ? "text-white lg:text-indigo-500" : "text-indigo-500"
              )}
            />
            <span
              className={clsx(
                willAddPassword ? "text-white lg:text-gray-900" : "text-gray-900"
              )}
            >
              Quero acesso ao painel
            </span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => {
            setWillAddPassword(false);
            form.resetField("password");
            setShowPassword(false);
          }}
          className={clsx(
            "mx-auto rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 duration-200 lg:hover:bg-gray-50",
            !willAddPassword && willAddPassword !== null
              ? "bg-indigo-600 bg-opacity-100 lg:bg-white"
              : "bg-opacity-20"
          )}
        >
          <div className="flex flex-col items-center">
            <UserPlusIcon
              className={clsx(
                "h-20 w-20 group-hover:text-indigo-900",
                !willAddPassword && willAddPassword !== null
                  ? "text-white lg:text-indigo-500"
                  : "text-indigo-500"
              )}
            />
            <span
              className={clsx(
                !willAddPassword && willAddPassword !== null
                  ? "text-white lg:text-gray-900"
                  : "text-gray-900"
              )}
            >
              Quero apenas apoiar
            </span>
          </div>
        </button>
      </div>
      {willAddPassword && (
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Senha
          </label>
          <div className="mt-2 flex rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="password"
                {...form.register("password", { required: true })}
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
                <EyeIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      )}
      {willAddPassword !== null && (
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
              {...form.register("info.zoneId", {
                onChange: async (e) => await fetchSections(e.target.value),
              })}
              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={""}
            >
              <option disabled value={""}>
                Selecione
              </option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.number.toString()}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-1">
            <ComboboxField
              hform={form}
              data={sectionList}
              disabled={!sectionList.length}
              onChange={(value) => {
                fetchAddress(value.id);
              }}
              name={"info.sectionId"}
              label="Seção"
              displayValueKey={"number"}
            />
          </div>
        </div>
      )}
      {address && !isLoading && (
        <div ref={ref} className="mt-6 border-t border-gray-100 text-left">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Local de Votação
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {toProperCase(address.location)}
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
    </>
  );
}
