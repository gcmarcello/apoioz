import LatestSupportersTable from "./LatestSupportersTable";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { readSupportersGroupSupportersWithRelation } from "@/app/api/panel/supporters/services/read.service";

export async function LatestSupporters() {
  const {
    request: { supporterSession },
  } = await UseMiddlewares().then(UserSessionMiddleware).then(SupporterSessionMiddleware);

  const latestSupporters = await readSupportersGroupSupportersWithRelation({
    pagination: { pageIndex: 0, pageSize: 5 },
    supporterSession,
  });

  if (!latestSupporters) return;

  return (
    <div className="mt-8">
      <LatestSupportersTable
        initialData={latestSupporters.data}
        pagination={latestSupporters.pagination}
      />
    </div>
  );
}
