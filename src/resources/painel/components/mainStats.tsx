import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { generateMainPageStats } from "../../api/services/campaign";
import { headers } from "next/headers";

export default async function MainStats({ campaign }: { campaign: any }) {
  const userId = headers().get("userId")!;
  const mainPageStats = await generateMainPageStats(userId, campaign.id);

  const stats = [
    {
      name: "Total de Apoiadores",
      stat: mainPageStats.totalSupporters,
      previousStat: mainPageStats.supportersLastWeek + " na semana passada",
      change:
        Math.round(
          (mainPageStats.totalSupporters - mainPageStats.supportersLastWeek) /
            mainPageStats.supportersLastWeek
        ) *
          100 +
        "%",
      changeType: !!(
        mainPageStats.totalSupporters - mainPageStats.supportersLastWeek
      )
        ? "increase"
        : "decrease",
    },
    {
      name: "Seção Líder",
      stat: mainPageStats.leadingSection.section.number,
      previousStat: `Zona ${mainPageStats.leadingSection.zone?.number} - ${mainPageStats.leadingSection.section?.Address.location}`,
      change: `${mainPageStats.leadingSection.count}`,
      changeType: false,
    },
    {
      name: "Líder de indicações",
      stat: mainPageStats.referralLeader.user?.name,
      previousStat: `${mainPageStats.referralLeader.count} no total`,
      change: `${Math.round(
        (mainPageStats.referralLeader.count / mainPageStats.totalSupporters) *
          100
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
                    {item.changeType === "increase"
                      ? "Increased"
                      : "Decreased"}{" "}
                    by{" "}
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
