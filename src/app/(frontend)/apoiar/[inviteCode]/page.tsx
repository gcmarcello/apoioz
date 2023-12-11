import { readCampaign } from "@/app/api/panel/campaigns/actions";
import Footer from "../../painel/_shared/components/Footer";
import SupporterSignUpPage from "./components/SupporterSignUpPage";
import { readZonesByCampaign } from "@/app/api/elections/zones/actions";
import { validateInviteCode } from "@/app/api/auth/invites/action";
import { readUserFromSupporter } from "@/app/api/user/actions";
import prisma from "prisma/prisma";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Error from "./error";
import { readActivePoll } from "@/app/api/panel/polls/service";

export default async function Apoiar({ params }: { params: { inviteCode: string } }) {
  try {
    const { inviteCode } = params;
    const inviteCodeInfo = await validateInviteCode(inviteCode);

    const campaign = await readCampaign({
      campaignId: inviteCodeInfo.campaignId,
    });
    const zones = await readZonesByCampaign(inviteCodeInfo.campaignId);
    const user = await readUserFromSupporter(inviteCodeInfo.referralId);
    const referral = await prisma.supporter.findUnique({
      where: { id: inviteCodeInfo.referralId },
    });

    const poll = await readActivePoll({ campaignId: inviteCodeInfo.campaignId });

    return (
      <ErrorBoundary errorComponent={Error}>
        <SupporterSignUpPage
          referral={referral}
          campaign={campaign}
          user={user}
          zones={zones}
          poll={poll}
        />
      </ErrorBoundary>
    );
  } catch (error) {
    return <Error error={error} />;
  }
}
