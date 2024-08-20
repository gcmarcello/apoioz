import { readSupportersFromSupporterGroupWithRelation } from "@/app/api/panel/supporters/service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { z } from "zod";
import { readZonesByCampaign } from "@/app/api/elections/zones/service";
import { readSectionsById } from "@/app/api/elections/sections/service";
import { readAddressesFromIds } from "@/app/api/elections/locations/service";
import ReportsPage from "./ReportsPage";

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: {
    as: string;
    page: string;
  };
}) {
  const {
    request: { supporterSession },
  } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware);

  const as = searchParams.as;

  const { data } = await readSupportersFromSupporterGroupWithRelation({
    supporterSession,
    where: {
      supporterId: z.string().uuid().safeParse(as) ? as : undefined,
    },
  });

  const zones = await readZonesByCampaign(supporterSession.campaignId);

  const parsedSections = data.map((s) => s.sectionId).filter((s) => s);

  const sections = await readSectionsById(parsedSections as string[]);

  const parsedAddresses = data.map((s) => s.addressId).filter((s) => s);

  const addresses = await readAddressesFromIds(parsedAddresses as string[]);

  const seeingAs = data.find((supporter) => supporter.id === as);

  const props = { zones, sections, addresses, seeingAs, supporters: data };

  return <ReportsPage {...props} />;
}
