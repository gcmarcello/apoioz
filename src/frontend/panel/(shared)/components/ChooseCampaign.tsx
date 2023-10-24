"use client";
import {
  activateCampaign,
  createCampaign,
} from "@/backend/resources/campaign/campaign.actions";
import clsx from "clsx";
import { Toast } from "@/frontend/(shared)/components/alerts/toast";
import { usePanel } from "../hooks/usePanel";
import { fakerPT_BR } from "@faker-js/faker";
import dayjs from "dayjs";
import { Mocker } from "@/frontend/(shared)/components/Mocker";
import { Campaign, Prisma } from "@prisma/client";

export default function ChooseCampaign({
  campaigns,
  user,
}: {
  campaigns: Campaign[];
  user: Prisma.UserGetPayload<{ include: { info: true } }>;
}) {
  const mockData = () => {
    const date = dayjs(fakerPT_BR.date.soon({ days: Math.ceil(Math.random() * 30) }));

    return {
      userId: user.id,
      name: fakerPT_BR.person.fullName() + " " + date.format("YYYY"),
      type: "vereador",
      cityId: user?.info?.cityId,
      stateId: null,
      year: date.format("YYYY"),
    };
  };

  return (
    <div className="mt-6 px-4 sm:px-6 lg:px-8">
      <Toast />
      <Mocker submit={async () => await createCampaign(mockData())} />
      <div className="flex">
        <h2 className="mb-4 text-4xl font-medium text-gray-900">Bem Vindo,</h2>
        <div className="flex">
          {user ? (
            <div className="mb-4 ms-3 text-4xl font-medium text-gray-900">
              {user?.name}
            </div>
          ) : (
            <div className="mb-4 ms-3 flex w-64  animate-pulse items-center rounded-lg bg-gray-300"></div>
          )}
        </div>
      </div>

      <h2 className="text-sm font-medium text-gray-900">Campanhas Ativas</h2>
      <ul
        role="list"
        className="mt-3 grid grid-cols-1 gap-4 empty:hidden sm:grid-cols-2 sm:gap-6 xl:grid-cols-4"
      >
        {campaigns.map((campaign: any) => (
          <li
            key={campaign.id}
            role="button"
            className="relative col-span-1 flex rounded-md shadow-sm"
            onClick={async () => await activateCampaign(campaign.id)}
          >
            <div
              className={clsx(
                "bg-pink-600",
                "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
              )}
            >
              {campaign.name.split(" ")[0][0] + campaign.name.split(" ")[1][0]}
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white duration-200 hover:bg-slate-100">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <a href="#" className="font-medium text-gray-900 hover:text-gray-600">
                  {campaign.name}
                </a>
                <p className="text-gray-500">{campaign._count.supporters} Apoiadores</p>
              </div>
              {/* <Menu as="div" className="flex-shrink-0 pr-2">
                <Menu.Button className="inline-flex h-8 w-8 items-center justify-center rounded-full  text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-10 top-3 z-10 mx-3 mt-1 w-48 origin-top-right divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={clsx(
                              active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            View
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={clsx(
                              active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Removed from pinned
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={clsx(
                              active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                              "block px-4 py-2 text-sm"
                            )}
                          >
                            Share
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
