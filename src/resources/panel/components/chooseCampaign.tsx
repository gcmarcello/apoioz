"use client";
import clsx from "clsx";
import { activateCampaign } from "../server/activateCampaign";
import { usePanel } from "../../../common/hooks/usePanel";
import Toast from "../../../common/components/toast";

export default function ChooseCampaign({ campaigns }: { campaigns: any }) {
  const { user, campaign, setCampaign, setShowToast } = usePanel();

  const handleCampaignSelection = async (campaignId: string) => {
    try {
      const campaign = await activateCampaign(campaignId, user.id);
      setCampaign(campaign);
    } catch (error) {
      console.log(error);
      setShowToast;
    }
  };

  if (campaign) return;

  return (
    <div className="mt-6 px-4 sm:px-6 lg:px-8">
      <Toast />
      <h2 className="text-4xl mb-4 font-medium text-gray-900">Bem Vindo, {user.name}</h2>
      <h2 className="text-sm font-medium text-gray-900">Campanhas Ativas</h2>
      <ul role="list" className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {campaigns.map((campaign: any) => (
          <li
            key={campaign.id}
            role="button"
            className="relative col-span-1 flex rounded-md shadow-sm"
            onClick={async () => handleCampaignSelection(campaign.id)}
          >
            <div
              className={clsx(
                "bg-pink-600",
                "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
              )}
            >
              {campaign.name.split(" ")[0][0] + campaign.name.split(" ")[1][0]}
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white hover:bg-slate-100 duration-200">
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
