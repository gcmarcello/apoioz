import { headers } from "next/headers";
import { listSupporters } from "../../api/campaign";
import clsx from "clsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

export default async function LatestSupporters({ userId, campaign }: { userId: string; campaign: any }) {
  const supporters = await listSupporters(userId, campaign.id, {
    take: 4,
    dateFrom: dayjs().subtract(1, "week").toISOString(),
  });

  const referralColor = (level: number) => {
    switch (level) {
      case 4:
        return { circle: "bg-yellow-500", shadow: "bg-yellow-500/20" };
      case 3:
        return { circle: "bg-emerald-500", shadow: "bg-emerald-500/20" };
      case 2:
        return { circle: "bg-blue-500", shadow: "bg-blue-500/20" };
      case 1:
        return { circle: "bg-red-500", shadow: "bg-red-500/20" };

      default:
        break;
    }
  };

  return (
    <div className="mt-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Novos Apoiadores</h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista dos apoiadores adicionados desde {dayjs().subtract(1, "week").format("DD/MM/YYYY")}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div>
      </div>
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Nome
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Indicado por
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Zona
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Seção
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {typeof supporters !== "number" &&
                    supporters.map((supporter) => (
                      <tr key={supporter.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {supporter.user.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="mt-1 flex items-center gap-x-1.5">
                            {supporter.referral?.name}
                            <div
                              className={clsx(
                                "flex-none rounded-full p-1",
                                referralColor(supporter.referral?.supporter[0]?.level!!)?.shadow
                              )}
                            >
                              <div
                                className={clsx(
                                  "h-1.5 w-1.5 rounded-full",
                                  referralColor(supporter.referral?.supporter[0]?.level!!)?.circle
                                )}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {supporter.user.info?.zone}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {supporter.user.info?.section}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Ver Mais<span className="sr-only">, {supporter.user.name}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  {typeof supporters === "number" && (
                    <tr>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm  text-gray-900 sm:pl-6">
                        Mais {supporters} apoiadores se juntaram à campanha na última semana!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
