import { useForm } from "react-hook-form";
import QuestionFieldArray from "../../components/QuestionFieldArray";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { CampaignLeaderMiddleware } from "@/middleware/functions/campaignLeader.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { readPoll } from "@/app/api/panel/polls/service";
import { redirect } from "next/navigation";

export default async function EditarPesquisaPage({ params }: { params: { id: string } }) {
  const { request: parsedRequest } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware)
    .then(CampaignLeaderMiddleware);

  const poll = await readPoll({ ...parsedRequest, id: params.id });

  if (!poll) {
    return redirect("/404");
  }

  const defaultValues = {
    title: poll.title,
    activeAtSignUp: poll.activeAtSignUp,
    active: poll.active,
    questions: poll.PollQuestion.map((question) => ({
      id: question.id,
      question: question.question,
      allowMultipleAnswers: question.allowMultipleAnswers,
      allowFreeAnswer: question.allowFreeAnswer,
      active: question.active,
      options: question.PollOption.map((option) => ({
        name: option.name,
        id: option.id,
        active: option.active,
      })),
    })),
    id: poll.id,
  };

  return (
    <>
      <QuestionFieldArray defaultValues={defaultValues} />
    </>
  );
}
