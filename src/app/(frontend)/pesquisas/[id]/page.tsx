import { readPoll } from "@/app/api/panel/polls/service";
import { ExternalPollForm } from "../components/ExternalPollForm";
import { getCampaign } from "@/app/api/panel/campaigns/service";

export default async function PesquisaExternalPage({
  params,
}: {
  params: { id: string };
}) {
  const poll = await readPoll({ id: params.id });
  const campaign = await getCampaign({ campaignId: poll.campaignId });
  return <ExternalPollForm data={poll} campaign={campaign} mode="external" />;
}
