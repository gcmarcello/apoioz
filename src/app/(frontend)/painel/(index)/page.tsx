import Footer from "../_shared/components/Footer";
import { readSupportersFromSupporterGroupWithRelation } from "@/app/api/panel/supporters/service";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import LatestSupportersTable from "./components/LatestSupportersTable";
import { cookies } from "next/headers";
import MainStats from "./components/MainStats";

export default async function PanelPage() {
  if (!cookies().get("activeCampaign")?.value) return;

  const {
    request: { supporterSession, userSession },
  } = await UseMiddlewares().then(UserSessionMiddleware).then(SupporterSessionMiddleware);

  const latestSupporters = await readSupportersFromSupporterGroupWithRelation({
    pagination: { skip: 0, take: 5 },
    supporterSession,
  });

  if (!latestSupporters) return;

  console.log(latestSupporters);

  return (
    <>
      <MainStats />
      <LatestSupportersTable
        data={latestSupporters.data}
        pagination={latestSupporters.pagination}
      />
      <Footer />
    </>
  );
}
