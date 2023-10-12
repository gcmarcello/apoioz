import { headers } from "next/headers";
import Table from "../../../common/components/tables/supporterTable";
import { listCampaigns, listSupporters } from "../../api/services/campaign";
import { ColumnDef } from "@tanstack/react-table";
import SupporterTable from "../../../common/components/tables/supporterTable";
import { parseSupporters } from "../../../common/functions/parseSupporters";

export default async function RelatoriosPage({}) {
  const supporters = await listSupporters({
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  });

  if (!supporters) return;
  if (typeof supporters === "number") return;

  return (
    <>
      <div className="md:flex md:items-center md:justify-between mb-1 -mt-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Relatório de Apoiadores
          </h2>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Edit
          </button>
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Publish
          </button>
        </div>
      </div>
      <div className="text-sm mb-4">
        Nessa página você tem acesso a todos os apoiadores da sua rede,
        indicados por você ou seus indicados!
      </div>
      <SupporterTable
        originalData={{
          supporters: supporters.supporters,
          count: supporters.count,
        }}
      />
    </>
  );
}
