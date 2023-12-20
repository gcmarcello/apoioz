import { readPoll, verifyExistingVote } from "@/app/api/panel/polls/service";
import { ExternalPollForm } from "../components/ExternalPollForm";
import { readCampaign } from "@/app/api/panel/campaigns/service";
import { headers } from "next/headers";
import { PollHeader } from "../components/PollHeader";
import { notFound, redirect } from "next/navigation";

export default async function PesquisaExternalPage({
  params,
}: {
  params: { id: string };
}) {
  const poll = await readPoll({ id: params.id });
  if (!poll) {
    return notFound();
  }
  const campaign = await readCampaign({ campaignId: poll.campaignId });

  if (
    await verifyExistingVote({ ip: headers().get("X-Forwarded-For"), pollId: params.id })
  ) {
    return (
      <div className="px-4 pb-20 pt-10">
        <PollHeader alreadyVoted={true} campaign={campaign} />
      </div>
    );
  }

  return <ExternalPollForm data={poll} campaign={campaign} mode="external" />;
}
