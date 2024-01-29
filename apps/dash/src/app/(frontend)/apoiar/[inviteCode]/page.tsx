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

  console.log(inviteCodeInfo);

  const campaign = await readCampaign({
    campaignId: inviteCodeInfo.campaignId,
  });
  const zones = await readZonesByCampaign(inviteCodeInfo.campaignId);
  const user = await readUserFromSupporter(inviteCodeInfo.referralId);

  const poll = await readActivePoll({
    campaignId: inviteCodeInfo.campaignId,
  });

  if (!campaign) return;

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {campaign.name}
      </h2>
      <h3 className="text-xl font-bold  tracking-tight text-zinc-700">
        {campaign.state?.name || (
          <>
            {campaign.city?.name}, {campaign.city?.State?.code}
          </>
        )}
      </h3>
      <p className="mt-2 text-lg leading-8 text-gray-600">
        Preencha seus dados abaixo para fazer parte da nossa rede de apoio!
      </p>
      {user && (
        <div className="my-4 inline-flex text-gray-500 hover:text-gray-600">
          <UserIcon className="me-2 h-6 w-6" /> <p>Convidado por {user.name}</p>
        </div>
      )}
      <SupporterSignUpForm
        campaign={campaign}
        inviteCodeId={inviteCode}
        poll={poll}
        zones={zones}
      />
    </>
  );
}
