import { readPollWithAnswers } from "@/app/api/panel/polls/service";
import QuestionGraph from "./components/pollGraph";
import { PageTitle } from "@/app/(frontend)/_shared/components/text/PageTitle";
import PageHeader from "@/app/(frontend)/_shared/components/PageHeader";
import Footer from "../../_shared/components/Footer";
import PollTable from "./components/pollTable";
import { PollOption } from "@prisma/client";
import { redirect } from "next/navigation";

interface SupporterAnswers {
  supporter: any;
  answers: any[];
  parsedAnswers: { [key: string]: any };
}

interface TableRowType {
  [key: string]: SupporterAnswers;
}

export default async function PesquisaPage({ params }: { params: { id: string } }) {
  const poll = await readPollWithAnswers({ id: params.id });

  if (!poll) return redirect("/painel/pesquisas");

  const questionsWithAnswers = poll.poll?.PollQuestion.map((question) => {
    const answers = question.PollAnswer.map((answer) => {
      return {
        supporter: { id: answer.supporter?.id, name: answer.supporter?.user.name },
        options: (answer.answer as any).options.map((option: PollOption) => ({
          id: option,
          name: question.PollOption.find((o) => o.id === option.id)?.name,
        })),
      };
    });

    return {
      questionId: question.id,
      question: question.question,
      options: question.PollOption.map((option) => ({
        id: option.id,
        name: option.name,
      })),
      answers: answers,
    };
  });

  const answers = poll.answers.reduce<TableRowType>((acc, answer) => {
    const supporterId = (answer.supporter?.id || answer.ip)!;

    const questionId = answer.questionId;
    if (!acc[supporterId]) {
      acc[supporterId] = {
        supporter: answer.supporter || {
          user: {
            name: "Anônimo",
            info: { Section: { Address: { neighborhood: "Anônimo" } } },
          },
        },
        answers: [],
        parsedAnswers: {},
      };
    }
    acc[supporterId].answers.push(answer);
    const answerString = (answer.answer as any).options
      .map(
        (option: PollOption) =>
          poll.poll?.PollQuestion.find((q) => q.id === questionId)?.PollOption.find(
            (o) => o.id === option.id
          )?.name
      )
      .join(", ");
    acc[supporterId].parsedAnswers[questionId] = answerString;
    acc[supporterId].parsedAnswers[`${questionId}_freeAnswer`] = (
      answer.answer as any
    ).freeAnswer;
    return acc;
  }, {});

  const parsedPoll = {
    title: poll.poll?.title,
    questions: questionsWithAnswers,
  };

  const parsedAnswers = Object.values(answers);

  return (
    <>
      <PageHeader
        title={`${poll.poll?.title} - Relatório`}
        primaryButton={{ href: `./${params.id}/editar`, text: "Editar" }}
        secondaryButton={{ href: "../pesquisas/", text: "Voltar" }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x ">
        <div className="col-span-1 flex flex-col justify-evenly">
          <div className="me-4">
            {parsedPoll.questions?.map((question, index) => (
              <QuestionGraph key={index} question={question} />
            ))}
          </div>
        </div>
        <div className="col-span-2 ">
          <div className="ms-4 ">
            <PollTable answers={parsedAnswers} poll={parsedPoll} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
