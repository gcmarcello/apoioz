"use client";
import SelectListbox, {
  ListboxOptionType,
} from "@/frontend/shared/components/SelectListbox";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Party } from "@prisma/client";
import clsx from "clsx";
import { Fragment, useState } from "react";

export default function RegistrarPage({ parties }: { parties: Party[] }) {
  const campaignTypes = [
    { id: "1", name: "Conselheiro Tutelar", value: "conselheiro" },
    { id: "2", name: "Vereador", value: "vereador" },
    { id: "3", name: "Prefeito", value: "prefeito" },
    { id: "4", name: "Deputado Estadual", value: "depestadual" },
    { id: "5", name: "Deputado Federal", value: "depfederal" },
  ];
  const parsedParties: ListboxOptionType[] = parties.map((party) => ({
    id: party.id,
    name: party.id,
    value: party.id,
  }));

  return (
    <div className="bg-white">
      {/* Background color split screen for large screens */}
      <div
        className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block"
        aria-hidden="true"
      />
      <div
        className="fixed right-0 top-0 hidden h-full w-1/2 bg-indigo-900 lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
        <h1 className="sr-only">Checkout</h1>

        <section
          aria-labelledby="summary-heading"
          className="bg-indigo-900 py-12 text-indigo-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
        >
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
            <h2 id="summary-heading">ApoioZ</h2>
          </div>
        </section>

        <section
          aria-labelledby="payment-and-shipping-heading"
          className="py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pb-24 lg:pt-0"
        >
          <h2 id="payment-and-shipping-heading" className="sr-only">
            Payment and shipping details
          </h2>

          <form>
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
              <div>
                <h3
                  id="contact-info-heading"
                  className="text-lg font-medium text-gray-900"
                >
                  Informação do Líder de Campanha
                </h3>

                <div className="mt-6">
                  <label
                    htmlFor="email-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nome Completo
                  </label>
                  <div className="mt-1">
                    <input
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
                    htmlFor="email-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email-address"
                      name="email-address"
                      autoComplete="email"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Telefone de Contato
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      autoComplete="phone"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">
                  Informações da sua campanha
                </h3>

                <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6 sm:grid-cols-4">
                  <div className="col-span-4 sm:col-span-2">
                    <div className="mt-1">
                      <SelectListbox
                        options={campaignTypes}
                        label={"Tipo de Campanha"}
                      />
                    </div>
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <div className="mt-1">
                      <SelectListbox
                        options={parsedParties}
                        label={"Partido Político"}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                >
                  Pay now
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
