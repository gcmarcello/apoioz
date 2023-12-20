"use client";
import dynamic from "next/dynamic";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { createMapData } from "@/app/api/panel/map/actions";
import { LoadingSpinner } from "../../_shared/components/Spinners";
import { UserGroupIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { toProperCase } from "@/_shared/utils/format";
import { useAction } from "../../_shared/hooks/useAction";
import Image from "next/image";
import { Zone } from "prisma/generated/zod";
import {
  generateContrastingColorsArray,
  generateRandomHexColor,
} from "../../_shared/utils/colors";
import { Neighborhood } from "@prisma/client";
import DisclosureAccordion from "../../_shared/components/Disclosure";
import { useFieldArray, useForm } from "react-hook-form";
import CheckboxInput from "../../_shared/components/fields/Checkbox";
import { Button } from "../../_shared/components/Button";

type FilterForm = {
  zones: (Zone & { label: number; color: string; checked: boolean })[];
  neighborhoods: (Neighborhood & { label: string; color: string; checked: boolean })[];
  sections: {
    showEmptySections: boolean;
  };
};

const WithCustomLoading = dynamic(
  () =>
    import("../../../../app/(frontend)/painel/mapa/components/SupportersMap").then(
      (mod) => mod.SupportersMap
    ),
  {
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    ),
    ssr: false,
  }
);

export default function MapPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const form = useForm<FilterForm>({
    defaultValues: {
      zones: [],
      neighborhoods: [],
      sections: {
        showEmptySections: false,
      },
    },
  });

  const { fields: zoneFields } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "zones", // unique name for your Field Array
  });
  const { fields: neighborhoodFields } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "neighborhoods", // unique name for your Field Array
  });

  const { data: mapData, trigger } = useAction({
    action: createMapData,
    parser: (data) => {
      const addresses = data.addresses;
      const neighborhoodList: Neighborhood[] = data.neighborhoods;
      const zoneList: Zone[] = data.zones;

      const parsed = addresses.map((a) => {
        const sectionsCount = a.Section.length;
        const supportersCount = a.Section.reduce((accumulator, section) => {
          return accumulator + section.Supporter.length;
        }, 0);
        return {
          address: a.address,
          geocode: [Number(a.lat), Number(a.lng)],
          location: a.location,
          neighborhood: a.neighborhood,
          zone: a.Section[0].Zone.number,
          sectionsCount,
          supportersCount,
          id: a.id,
        };
      });

      form.setValue(
        "neighborhoods",
        neighborhoodList
          .map((neighborhood, index) => ({
            ...neighborhood,
            label: toProperCase(neighborhood.name),
            color: generateRandomHexColor(),
            checked: false,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );

      form.setValue(
        "zones",
        zoneList
          .map((zone, index) => ({
            ...zone,
            label: zone.number,
            color: generateRandomHexColor(),
            checked: false,
          }))
          .sort((a, b) => a.label - b.label)
      );

      return parsed;
    },
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <div className="bg-white">
      {/* Mobile filter dialog */}
      {/* <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setMobileFiltersOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto overflow-x-hidden bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filtros</h2>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <form className="mt-4 border-t border-gray-200">
                  <h3 className="sr-only">Filtros</h3>

                  {filters.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.id}
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => {
                        console.log(open);
                        return (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                                  ) : (
                                    <PlusIcon className="h-5 w-5" aria-hidden="true" />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.options.map((option, optionIdx) => (
                                  <div key={option.value} className="flex items-center">
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      defaultChecked={option.checked}
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 min-w-0 flex-1 text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        );
                      }}
                    </Disclosure>
                  ))}
                </form>
                <ul
                  role="list"
                  className="ms-4 space-y-4 px-2 py-3 text-sm text-gray-900"
                >
                  <li>
                    <div className="flex items-center">
                      <input
                        id={`showZones`}
                        name={`showPolygons`}
                        checked={mapOptions.showZones}
                        onChange={() =>
                          setMapOptions({
                            ...mapOptions,
                            showZones: !mapOptions.showZones,
                          })
                        }
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />

                      <label
                        htmlFor={`filter-showZones`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        Mostrar Zonas Eleitorais
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <input
                        id={`showNeighborhoods`}
                        name={`showPolygons`}
                        checked={mapOptions.showNeighborhoods}
                        onChange={() =>
                          setMapOptions({
                            ...mapOptions,
                            showNeighborhoods: !mapOptions.showNeighborhoods,
                          })
                        }
                        type="radio"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />

                      <label
                        htmlFor={`showNeighborhoods`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        Mostrar Bairros
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <input
                        id={`filter-showNeighborhoods`}
                        name={`filter-showNeighborhoods`}
                        checked={mapOptions.showNeighborhoods}
                        type="checkbox"
                        onChange={() =>
                          setMapOptions({
                            ...mapOptions,
                            showNeighborhoods: !mapOptions.showNeighborhoods,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={`filter-showZones`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        Mostrar Bairros
                      </label>
                    </div>
                  </li>

                  <li>
                    <div className="flex items-center">
                      <input
                        id={`filter-showAddresses`}
                        name={`filter-showAddresses`}
                        checked={mapOptions.showAddresses}
                        type="radio"
                        onChange={() =>
                          setMapOptions({
                            ...mapOptions,
                            showAddresses: !mapOptions.showAddresses,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={`filter-showAddresses`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        Mostrar Colégios
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <input
                        id={`filter-showEmptyAddresses`}
                        name={`filter-showEmptyAddresses`}
                        checked={mapOptions.showEmptyAddresses}
                        type="checkbox"
                        onChange={() =>
                          setMapOptions({
                            ...mapOptions,
                            showEmptyAddresses: !mapOptions.showEmptyAddresses,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={`filter-showEmptyAddresses`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        Mostrar Colégios Sem Apoio
                      </label>
                    </div>
                  </li>
                </ul>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root> */}

      <div className="flex items-baseline justify-between border-b border-gray-200 pb-4 lg:hidden">
        <div className="flex items-center">
          <button
            type="button"
            className="-m-2 ml-1 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
          >
            <span className="sr-only">View grid</span>
            <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="-m-2 ml-2 p-2 text-gray-400 hover:text-gray-500 sm:ml-6"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <span className="sr-only">Filtros</span>
            <FunnelIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <section aria-labelledby="products-heading" className="pb-24">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
          {/* Filters */}
          <div className="lg:col-span-2">
            <form className="hidden lg:block">
              <DisclosureAccordion title={"Zonas"}>
                <div className="max-h-96 overflow-y-auto ps-1">
                  {zoneFields.map((field, index) => (
                    <CheckboxInput
                      key={`filter-${index}`}
                      hform={form}
                      onChange={() =>
                        form.setValue(
                          "neighborhoods",
                          form
                            .watch("neighborhoods")
                            .map((n) => ({ ...n, checked: false }))
                        )
                      }
                      label={
                        <span className="flex items-center gap-2 space-x-2">
                          {field.color && (
                            <span
                              style={{ backgroundColor: field.color }}
                              className="min-h-[16px] min-w-[16px] rounded"
                            ></span>
                          )}
                          {field.label}
                        </span>
                      }
                      data={field.id}
                      name={`zones.${index}.checked`}
                    />
                  ))}
                </div>
              </DisclosureAccordion>
              <DisclosureAccordion title={"Bairros"}>
                <div className="max-h-96 overflow-y-auto ps-1">
                  {neighborhoodFields.map((field, index) => (
                    <CheckboxInput
                      key={`filter-${index}`}
                      hform={form}
                      onChange={() =>
                        form.setValue(
                          "zones",
                          form.watch("zones").map((n) => ({ ...n, checked: false }))
                        )
                      }
                      label={
                        <span className="flex items-center gap-2 space-x-2">
                          {field.color && (
                            <span
                              style={{ backgroundColor: field.color }}
                              className="min-h-[16px] min-w-[16px] rounded"
                            ></span>
                          )}
                          {field.label}
                        </span>
                      }
                      data={field.id}
                      name={`neighborhoods.${index}.checked`}
                    />
                  ))}
                </div>
              </DisclosureAccordion>
              <DisclosureAccordion defaultOpen={true} title={"Opções"}>
                <div className="max-h-96 overflow-y-auto ps-1">
                  <CheckboxInput
                    key={`showEmptySections`}
                    hform={form}
                    label="Mostrar Colégios sem Apoio"
                    name={`sections.showEmptySections`}
                  />
                  {/* <Button
                    variant="secondary"
                    role="button"
                    className="my-2 flex w-full justify-center"
                    onClick={(e) => clearFilters(e)}
                  >
                    Limpar Filtros
                  </Button> TODO */}
                </div>
              </DisclosureAccordion>
            </form>
          </div>

          <div className="lg:col-span-10">
            <WithCustomLoading
              mapData={mapData}
              zones={form.watch("zones")}
              neighborhoods={form.watch("neighborhoods")}
              sections={form.watch("sections")}
            />
            {/* <div className="w-100 my-auto h-full bg-blue-400">Mapa</div> */}
          </div>
        </div>
      </section>
    </div>
  );
}
