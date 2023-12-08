import { readPoll, readPollAnswers } from "@/app/api/panel/polls/service";
import QuestionGraph from "./components/pollGraph";
import { PageTitle } from "@/app/(frontend)/_shared/components/text/PageTitle";
import PageHeader from "@/app/(frontend)/_shared/components/PageHeader";
import Footer from "../../_shared/components/Footer";
import PollTable from "./components/pollTable";

export default async function PesquisaPage({ params }: { params: { id: string } }) {
  const poll = await readPoll({ id: params.id });
  const answers = await readPollAnswers({ id: params.id });

  return (
    <>
      <PageHeader
        title={`${poll.title} - Relatório`}
        primaryButton={{ href: `./${params.id}/editar`, text: "Editar" }}
        secondaryButton={{ href: "../pesquisas/", text: "Voltar" }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x ">
        <div className="col-span-1 flex flex-col justify-evenly">
          <div className="me-4">
            {poll.questions.map((question, index) => (
              <QuestionGraph key={index} question={question} />
            ))}
          </div>
        </div>
        <div className="col-span-2 ">
          <div className="ms-4">
            <PollTable answers={answers} poll={poll} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
