import clsx from "clsx";
import LatestSupportersTable from "../(index)/components/LatestSupportersTable";
import StatsSection from "../../_shared/components/StatsSection";
import { DefaultTable } from "../../_shared/components/tables/table";

import WhatsAppIcon from "../../_shared/components/icons/WhatsAppIcon";
import Footer from "../_shared/components/Footer";
import Link from "next/link";
import Paragraph from "../../_shared/components/text/Paragraph";
import { SectionTitle } from "../../_shared/components/text/SectionTitle";
import WhatsappForm from "./components/WhatsappForm";

export default function WhatsappPage() {
  const people = [
    {
      name: "Meire Barros #1",
      number: "2000",
      link: "https://wa.me",
    },
    {
      name: "Meire Barros #2",
      number: "125",
      link: "https://wa.me",
    },
    // More people...
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-6 lg:divide-x">
        <WhatsappForm />
        <div className="order-1 col-span-full lg:col-span-1 lg:ps-6">
          <StatsSection
            stats={[
              {
                name: "Número de Participantes",
                stat: 2125,
              },
              { name: "Número de Grupos no Whatsapp", stat: 2 },
            ]}
          />
          <div className="my-6">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Grupos
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  Uma lista de todas as comunidades do WhatsApp da nossa rede de
                  apoio!
                </p>
              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Nome
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Participantes
                          </th>

                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {people.map((person) => (
                          <tr key={person.name}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {person.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {person.number}/2000
                            </td>

                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <a
                                href={person.link}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Abrir
                                <span className="sr-only">, {person.name}</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
