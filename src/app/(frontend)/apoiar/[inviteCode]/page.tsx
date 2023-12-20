import { readCampaign } from "@/app/api/panel/campaigns/actions";
import SupporterSignUpPage from "./components/SupporterSignUpPage";
import { readZonesByCampaign } from "@/app/api/elections/zones/actions";
import { readUserFromSupporter } from "@/app/api/user/actions";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Error from "./error";
import { readActivePoll } from "@/app/api/panel/polls/service";
import { validateInviteCode } from "@/app/api/auth/invites/service";

export default async function Apoiar({ params }: { params: { inviteCode: string } }) {
  try {
    const { inviteCode } = params;
    const inviteCodeInfo = await validateInviteCode(inviteCode);

    const campaign = await readCampaign({
      campaignId: inviteCodeInfo.campaignId,
    });
    const zones = await readZonesByCampaign(inviteCodeInfo.campaignId);
    const user = await readUserFromSupporter(inviteCodeInfo.referralId);

    const poll = await readActivePoll({ campaignId: inviteCodeInfo.campaignId });

    return (
      <ErrorBoundary errorComponent={Error}>
        <SupporterSignUpPage
          inviteCodeId={inviteCodeInfo.id}
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
