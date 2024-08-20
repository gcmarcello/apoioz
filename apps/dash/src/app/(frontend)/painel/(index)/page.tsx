import Footer from "../_shared/components/Footer";
import { readSupportersFromSupporterGroupWithRelation } from "@/app/api/panel/supporters/service";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import LatestSupportersTable from "./components/LatestSupportersTable";
import { cookies } from "next/headers";
import MainStats from "./components/MainStats";
import { readZonesByCampaign } from "@/app/api/elections/zones/service";
import { readSectionsById } from "@/app/api/elections/sections/service";
import {
  readAddressesFromIds,
  readAddressesFromSections,
} from "@/app/api/elections/locations/service";

export default async function PanelPage() {
  if (!cookies().get("activeCampaign")?.value) return;

  const {
    request: { supporterSession, userSession },
  } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware);

  const { data, pagination } =
    await readSupportersFromSupporterGroupWithRelation({
      pagination: { skip: 0, take: 5 },
      supporterSession,
    });

  const zones = await readZonesByCampaign(supporterSession.campaignId);

  const parsedSections = data.map((s) => s.sectionId).filter((s) => s);

  const sections = await readSectionsById(parsedSections as string[]);

  const parsedAddresses = data.map((s) => s.addressId).filter((s) => s);

  const addresses = await readAddressesFromIds(parsedAddresses as string[]);

  if (!pagination) return;

  return (
    <>
      <MainStats />
      <LatestSupportersTable
        data={data}
        sections={sections}
        zones={zones}
        addresses={addresses}
        pagination={pagination}
      />
      <Footer />
    </>
  );
}
