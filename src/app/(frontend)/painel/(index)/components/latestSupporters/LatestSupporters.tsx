import dayjs from "dayjs";
import Link from "next/link";
import LatestSupportersTable from "./LatestSupportersTable";
import { Date } from "@/app/(frontend)/_shared/components/Date";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { readSupportersFromGroupWithRelations } from "@/app/api/panel/supporters/service";
import { ParagraphLink } from "@/app/(frontend)/_shared/components/text/ParagraphLink";

export async function LatestSupporters() {
  const {
    request: { supporterSession },
  } = await UseMiddlewares().then(UserSessionMiddleware).then(SupporterSessionMiddleware);

  const latestSupporters = await readSupportersFromGroupWithRelations({
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
