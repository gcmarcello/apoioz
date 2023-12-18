import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Campaign, User } from "@prisma/client";
import { generateMainPageStats } from "@/app/api/panel/campaigns/actions";

export default function MainStats({
  user,
  campaign,
}: {
  user: User;
  campaign: Campaign;
}) {
  const [mainPageStats, setMainPageStats] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (user && campaign) {
        generateMainPageStats({
          campaignId: campaign.id,
          userId: user.id,
        })
          .then((data: any) => setMainPageStats(data))
          .catch((err) => console.log(err));
      }
    })();
  }, [campaign, user]);

  if (!mainPageStats)
    return (
      <div>
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Estatísticas Semanais
        </h3>
        <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900">Total de Apoiadores</dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex animate-pulse items-baseline text-2xl font-semibold text-indigo-600">
                Carregando...
                <span className="ml-2 text-clip text-sm font-medium text-gray-500"></span>
              </div>
            </dd>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900">Seção Líder</dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex animate-pulse items-baseline text-2xl font-semibold text-indigo-600">
                Carregando...
                <span className="ml-2 text-clip text-sm font-medium text-gray-500"></span>
              </div>
            </dd>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900">Líder de Indicações</dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex animate-pulse items-baseline text-2xl font-semibold text-indigo-600">
                Carregando...
                <span className="ml-2 text-clip text-sm font-medium text-gray-500"></span>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    );

  const totalSupportersChange =
    mainPageStats?.totalSupporters -
    mainPageStats?.supportersLastWeek / mainPageStats?.supportersLastWeek;

  const stats = [
    {
      name: "Total de Apoiadores",
      stat: mainPageStats?.totalSupporters,
      previousStat: mainPageStats?.supportersLastWeek + " na semana passada",
      change:
        totalSupportersChange !== Infinity && !Number.isNaN(totalSupportersChange)
          ? totalSupportersChange + "%"
          : "",
      changeType: !!(mainPageStats?.totalSupporters - mainPageStats?.supportersLastWeek)
        ? "increase"
        : "decrease",
    },
    {
      name: "Seção Líder",
      stat: mainPageStats?.leadingSection.section.number,
      previousStat: `Zona ${mainPageStats?.leadingSection.zone?.number} - ${mainPageStats?.leadingSection.section?.Address.location}`,
      change: `${mainPageStats?.leadingSection.count}`,
      changeType: false,
    },
    {
      name: "Líder de indicações",
      stat: mainPageStats?.referralLeader.user?.name,
      previousStat: `${mainPageStats?.referralLeader.count} no total`,
      change: `${Math.round(
        (mainPageStats?.referralLeader.count / mainPageStats?.totalSupporters) * 100
      )}%`,
      changeType: false,
    },
  ];

  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Estatísticas Semanais
      </h3>
      <dl className="mt-5 grid grid-cols-1 divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((item) => (
          <div key={item.name} className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900">{item.name}</dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                {item.stat}
                <span className="ml-2 text-clip text-sm font-medium text-gray-500">
                  {item.previousStat}
                </span>
              </div>

              {
                <div
                  className={clsx(
                    item.changeType === "increase"
                      ? "bg-green-100 text-green-800"
                      : item.changeType
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-600",
                    "inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0"
                  )}
                >
                  {item.changeType === "increase" ? (
                    <ArrowUpIcon
                      className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-green-500"
                      aria-hidden="true"
                    />
                  ) : item.changeType ? (
                    <ArrowDownIcon
                      className="-ml-1 mr-0.5 h-5 w-5 flex-shrink-0 self-center text-red-500"
                      aria-hidden="true"
                    />
                  ) : (
                    ""
                  )}

                  <span className="sr-only">
                    {" "}
                    {item.changeType === "increase" ? "Increased" : "Decreased"} by{" "}
                  </span>
                  {item.change}
                </div>
              }
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
