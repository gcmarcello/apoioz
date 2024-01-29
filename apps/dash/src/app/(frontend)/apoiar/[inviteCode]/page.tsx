import { readCampaign } from "@/app/api/panel/campaigns/service";
import { readZonesByCampaign } from "@/app/api/elections/zones/service";
import { readUserFromSupporter } from "@/app/api/user/service";
import { validateInviteCode } from "@/app/api/auth/invites/service";
import { redirect } from "next/navigation";
import { UserIcon } from "@heroicons/react/24/solid";
import { readActivePoll } from "@/app/api/panel/polls/service";
import SupporterSignUpForm from "./components/SupporterSignupForm";

export default async function Apoiar({
  params,
}: {
  params: { inviteCode: string };
}) {
  const { inviteCode } = params;
  const inviteCodeInfo = await validateInviteCode(inviteCode).catch(() => {
    redirect("/painel");
  });

  const campaign = await readCampaign({
    campaignId: inviteCodeInfo.campaignId,
  });
  const zones = await readZonesByCampaign(inviteCodeInfo.campaignId);
  const user = await readUserFromSupporter(inviteCodeInfo.referralId);

  const poll = await readActivePoll({
    campaignId: inviteCodeInfo.campaignId,
  });

  if (!campaign) return;

  if (!user) return;

  return (
    <>
      <SupporterSignUpForm
        campaign={campaign}
        inviteCodeId={inviteCode}
        poll={poll}
        zones={zones}
        user={user}
      />
    </>
  );
}
