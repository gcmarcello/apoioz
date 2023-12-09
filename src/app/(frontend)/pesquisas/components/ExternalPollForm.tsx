"use client";
import { Button } from "@/app/(frontend)/_shared/components/Button";
import CheckboxInput from "@/app/(frontend)/_shared/components/fields/Checkbox";
import RadioInput from "@/app/(frontend)/_shared/components/fields/Radio";
import { TextAreaField } from "@/app/(frontend)/_shared/components/fields/Text";
import { PageSubtitle } from "@/app/(frontend)/_shared/components/text/PageSubtitle";
import { PageTitle } from "@/app/(frontend)/_shared/components/text/PageTitle";
import { SectionTitle } from "@/app/(frontend)/_shared/components/text/SectionTitle";
import { ArrowLeftCircleIcon } from "@heroicons/react/20/solid";
import { EyeIcon } from "@heroicons/react/24/solid";
import { Campaign } from "@prisma/client";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useAction } from "../../_shared/hooks/useAction";
import { showToast } from "../../_shared/components/alerts/toast";
import { BottomNavigation } from "../../_shared/components/navigation/BottomNavigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { pollAnswerDto } from "@/app/api/panel/polls/dto";
import ExternalPollSubFieldArray from "./ExternalPollSubFieldArray";

interface PossibleStates {
  preview: {
    setShowPreview: Dispatch<SetStateAction<boolean>>;
  };
  external: {};
  internal: {};
}

interface PollFormProps<T extends keyof PossibleStates> {
  data: {
    id: string;
    title: string;
    activeAtSignUp: boolean;
    PollQuestion: {
      question: string;
      id: string;
      allowMultipleAnswers: boolean;
      allowFreeAnswer: boolean;
      PollOption: { name: string; active: boolean; id: string }[];
    }[];
  };
  mode: T;
  states?: PossibleStates[T];
  campaign: Campaign;
}

export function ExternalPollForm<T extends keyof PossibleStates>({
  data,
  campaign,
  mode,
  states,
}: PollFormProps<T>) {
  console.log(data);
  const pollId = data.id;
  const form = useForm({
    defaultValues: {
      pollId,
      questions: data.PollQuestion.map((question) => ({
        questionId: question.id,
        answers: question.PollOption.map((option) => ({
          optionId: option.id,
          freeAnswer: "",
        })),
      })),
    },
    resolver: zodResolver(pollAnswerDto),
  });
  const { fields } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "questions", // unique name for your Field Array
  });

  console.log(fields);

  /* const {
    data: signUpData,
    trigger: vote,
    isMutating: isSigningUp,
    reset: resetSignUp,
  } = useAction({
    action: answerPoll,
    onSuccess: (res) => {
      setTimeout(() => {
        scrollTo({ top: 0, behavior: "smooth" });
      }, 350);
      showToast({
        message: "Pesquisa respondida com sucesso.",
        title: "Sucesso!",
        variant: "success",
      });
    },
    onError: (err) => {
      form.setError("root.serverError", {
        type: "400",
        message: err.toString() || "Erro inesperado",
      });
    },
  }); */

  return (
    <form
      className="px-4 pb-20 pt-10"
      onSubmit={form.handleSubmit((data) => console.log(data))}
    >
      <div
        className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl lg:top-[-10rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none  rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="flex space-x-4">
        {mode === "preview" && (
          <Button
            onClick={() =>
              (states as PossibleStates["preview"]).setShowPreview((prev) => !prev)
            }
            variant="secondary"
            className="my-auto hidden lg:block"
          >
            <div className="flex items-center justify-center gap-x-2">
              <ArrowLeftCircleIcon className="h-5 w-5" /> Voltar
            </div>
          </Button>
        )}
      </div>
      {(mode === "preview" || mode === "external") && (
        <div className="flex flex-col items-center justify-center">
          <Image
            width={100}
            height={100}
            className="rounded-full bg-gray-50"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt=""
          />
          <div className="my-2 flex flex-col items-center">
            <PageTitle>{campaign.name}</PageTitle>
            <PageSubtitle>
              Nos ajude a entender mais sobre você e como você pensa!
            </PageSubtitle>
          </div>
        </div>
      )}
      <div className="my-4">
        {fields.map(
          (question, index) =>
            question.questionId && (
              <div
                key={index}
                className="my-4 overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5"
              >
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        <div className="font-semibold">
                          {
                            data.PollQuestion.find((q) => q.id === question.questionId)
                              ?.question
                          }
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    <ExternalPollSubFieldArray
                      hform={form}
                      nestIndex={index}
                      question={data.PollQuestion.find(
                        (q) => q.id === question.questionId
                      )}
                    />
                    {/* {question.allowFreeAnswer && (
                      <tr>
                        <td className="p-4">
                          <TextAreaField
                            hform={form}
                            label={
                              question.PollOption.length ? "Comentários:" : "Resposta:"
                            }
                            name={`answers.${question.id}.answer.freeAnswer`}
                          />
                        </td>
                      </tr>
                    )} */}
                  </tbody>
                </table>
              </div>
            )
        )}

        <button type="submit">Enviar</button>
        <Button type="submit" variant="primary"></Button>
      </div>
      <BottomNavigation className="flex justify-end gap-3 py-3 lg:hidden">
        <div className="mx-3"></div>
      </BottomNavigation>
    </form>
  );
}
