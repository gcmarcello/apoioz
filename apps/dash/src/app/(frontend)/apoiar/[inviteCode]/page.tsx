import { readCampaign } from "@/app/api/panel/campaigns/service";
import { readZonesByCampaign } from "@/app/api/elections/zones/service";
import { readUserFromSupporter } from "@/app/api/user/service";
import {
  getLastInviteCode,
  readInviteCode,
  validateInviteCode,
} from "@/app/api/auth/invites/service";
import { redirect } from "next/navigation";
import { readActivePoll } from "@/app/api/panel/polls/service";
import SupporterSignUpForm from "./components/SupporterSignupForm";

export default async function Apoiar({
  params,
}: {
  params: { inviteCode: string };
}) {
  const { inviteCode: inviteCodeId } = params;

  const inviteCode = await readInviteCode({
    id: inviteCodeId,
  });

  if (!inviteCode) return redirect("/painel");

  const isInviteCodeValid = await validateInviteCode(inviteCode);

  if (!isInviteCodeValid) return redirect("/painel");

  const campaign = await readCampaign({
    campaignId: inviteCode.campaignId,
  });
  const zones = await readZonesByCampaign(inviteCode.campaignId);
  const user = await readUserFromSupporter(inviteCode.referralId);

  const poll = await readActivePoll({
    campaignId: inviteCode.campaignId,
  });

  if (!campaign) return;

  if (!user) return;

  return (
    <>
      <SupporterSignUpForm
        campaign={campaign}
        inviteCodeId={inviteCode.id}
        poll={poll}
        zones={zones}
        user={user}
      />
    </>
  );
}
