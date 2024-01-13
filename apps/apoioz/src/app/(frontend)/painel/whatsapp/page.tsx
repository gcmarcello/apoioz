import clsx from "clsx";
import LatestSupportersTable from "../(index)/components/LatestSupportersTable";
import StatsSection from "../../_shared/components/StatsSection";
import { DefaultTable } from "../../_shared/components/tables/table";
import {
  CheckIcon,
  ClipboardDocumentIcon,
  HandThumbUpIcon,
  ShareIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import WhatsAppIcon from "../../_shared/components/icons/WhatsAppIcon";
import Footer from "../_shared/components/Footer";
import Link from "next/link";
import Paragraph from "../../_shared/components/text/Paragraph";
import { SectionTitle } from "../../_shared/components/text/SectionTitle";

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

  const timeline = [
    {
      id: 1,
      content: "Copie o link de convite da comunidade clicando",
      target: "aqui ou acima",
      href: "#",
      icon: ClipboardDocumentIcon,
      iconBackground: "bg-gray-400",
    },
    {
      id: 2,
      content: "Envie para seus contatos do",
      target: "WhatsApp",
      href: "#",
      date: "Sep 22",
      datetime: "2020-09-22",
      icon: ShareIcon,
      iconBackground: "bg-blue-500",
    },
    {
      id: 3,
      content: "Pronto, agora é só esperar as pessoas entrarem no grupo!",
      href: "#",
      date: "Sep 28",
      datetime: "2020-09-28",
      icon: HandThumbUpIcon,
      iconBackground: "bg-green-500",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-6 lg:divide-x">
        <div className="col-span-full flex flex-col items-center justify-center lg:col-span-1">
          <SectionTitle className="w-full text-start">
            Convidar novos apoiadores
          </SectionTitle>
          <Paragraph className="my-4 w-full text-start">
            Para convidar pessoas para as comunidades do WhatsApp, é muito
            simples:
          </Paragraph>
          <div className="flow-root">
            <ul role="list" className="-mb-8">
              {timeline.map((event, eventIdx) => (
                <li key={event.id}>
                  <div className="relative pb-8">
                    {eventIdx !== timeline.length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={clsx(
                            event.iconBackground,
                            "flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-white"
                          )}
                        >
                          <event.icon
                            className="h-5 w-5 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">
                            {event.content}{" "}
                            <a
                              href={event.href}
                              className="font-medium text-gray-900"
                            >
                              {event.target}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Paragraph className="mt-6 text-start">
            Se preferir, você pode compartilhar o link de convite diretamente
            pelo WhatsApp para vários contatos ao mesmo tempo:
          </Paragraph>
          <Link
            href={`https://wa.me/?text=a`}
            className="w-full"
            target="_blank"
          >
            <div className="my-4 flex justify-center space-x-2 rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:bg-green-400">
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
