import { ExternalPollForm } from "../components/ExternalPollForm";
import { readCampaign } from "@/app/api/panel/campaigns/service";
import { cookies, headers } from "next/headers";
import { PollHeader } from "../components/PollHeader";
import { notFound, redirect } from "next/navigation";
import { AuthMiddleware } from "@/middleware/functions/auth.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";

export default async function PesquisaExternalPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = await UseMiddlewares(
    { token: cookies().get("token")?.value },
    {
      roles: ["user"],
    }
  ).then(AuthMiddleware);

  const ip = headers().get("X-Forwarded-For")!;

  const _poll = await prisma.poll.findFirst({
    where: { id: params.id },
    include: {
      PollQuestion: {
        select: {
          id: true,
          allowFreeAnswer: true,
          question: true,
          allowMultipleAnswers: true,
          PollOption: true,
        },
      },
      PollAnswer: {
        select: {
          ip: true,
          supporter: true,
        },
        where: {
          OR: [{ supporter: { userId: userId } }, { ip: ip }],
        },
      },
    },
  });

  if (!_poll) return notFound();

  const { PollAnswer, ...poll } = _poll;

  const pollHasAnswer = PollAnswer?.length || 0 > 0;

  const campaign = (await readCampaign({ campaignId: poll.campaignId }))!;

  if (pollHasAnswer) {
    return (
      <div className="px-4 pb-20 pt-10">
        <PollHeader alreadyVoted={true} campaign={campaign} />
      </div>
    );
  }

  return <ExternalPollForm data={poll} campaign={campaign} mode="external" />;
}
