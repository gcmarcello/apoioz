import { headers } from "next/headers";
import Table from "../../../common/components/tables/supporterTable";
import { listCampaigns, listSupporters } from "../../api/services/campaign";
import { ColumnDef } from "@tanstack/react-table";
import SupporterTable from "../../../common/components/tables/supporterTable";
import { parseSupporters } from "../../../common/functions/parseSupporters";

export default async function RelatoriosPage({}) {
  const userId = headers().get("userId")!;
  const campaigns = await listCampaigns(userId);
  const supporters = await listSupporters({
    userId: userId,
    campaignId: campaigns[0].id,
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  });

  const supporterTableData = parseSupporters(supporters.supporters);

  if (typeof supporters === "number") return;

  return (
    <>
      {
        <SupporterTable
          originalData={{
            supporters: supporterTableData,
            count: supporters.count,
          }}
          query={{ method: "GET", url: "/api/panel/supporter" }}
        />
      }
    </>
  );
}
