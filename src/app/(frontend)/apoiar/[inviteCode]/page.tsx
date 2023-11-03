import { getCampaign } from "@/app/api/panel/campaigns/actions";
import Footer from "../../painel/_shared/components/Footer";
import SupporterSignUpPage from "./components/SupporterSignUpPage";
import { getSupporterByUser } from "@/app/api/panel/supporters/actions";
import { getZonesByCampaign } from "@/app/api/elections/zones/actions";
import { validateInviteCode } from "@/app/api/auth/invites/action";
import { getUserFromSupporter } from "@/app/api/user/actions";
import prisma from "prisma/prisma";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Error from "./error";

export default async function Apoiar({ params }: { params: { inviteCode: string } }) {
  try {
    const { inviteCode } = params;
    const inviteCodeInfo = await validateInviteCode(inviteCode);

    const campaign = await getCampaign({
      campaignId: inviteCodeInfo.campaignId,
    });
    const zones = await getZonesByCampaign(inviteCodeInfo.campaignId);
    const user = await getUserFromSupporter(inviteCodeInfo.referralId);
    const referral = await prisma.supporter.findUnique({
      where: { id: inviteCodeInfo.referralId },
    });

    return (
      <ErrorBoundary errorComponent={Error}>
        <>
          <SupporterSignUpPage
            referral={referral}
            campaign={campaign}
            user={user}
            zones={zones}
          />

          <Footer />
        </>
      </ErrorBoundary>
    );
  } catch (error) {
    return <Error error={error} />;
  }
}
