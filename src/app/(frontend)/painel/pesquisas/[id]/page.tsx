import { useForm } from "react-hook-form";
import QuestionFieldArray from "../components/QuestionFieldArray";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { CampaignLeaderMiddleware } from "@/middleware/functions/campaignLeader.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { getPoll } from "@/app/api/panel/polls/service";
import PageHeader from "@/app/(frontend)/_shared/components/PageHeader";

export default async function EditarPesquisaPage({ params }: { params: { id: string } }) {
  const { request: parsedRequest } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware)
    .then(CampaignLeaderMiddleware);

  const poll = await getPoll({ ...parsedRequest, id: params.id });

  const defaultValues = {
    title: poll.title,
    activeAtSignUp: poll.activeAtSignUp,
    questions: poll.PollQuestion.map((question) => ({
      id: question.id,
      question: question.question,
      allowMultipleAnswers: question.allowMultipleAnswers,
      allowFreeAnswer: question.allowFreeAnswer,
      disabled: question.disabled,
      options: question.PollOption.map((option) => ({
        name: option.name,
        id: option.id,
        disabled: option.disabled,
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
