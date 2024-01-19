"use client";
import { Button } from "@/app/(frontend)/_shared/components/Button";
import { Campaign, PollQuestion, Prisma } from "@prisma/client";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { set, useFieldArray, useForm } from "react-hook-form";
import { BottomNavigation } from "../../_shared/components/navigation/BottomNavigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { pollAnswerDto } from "@/app/api/panel/polls/dto";
import CheckboxInput from "../../_shared/components/fields/Checkbox";
import RadioInput from "../../_shared/components/fields/Radio";
import { useAction } from "@odinkit/hooks/useAction";
import { answerPoll } from "@/app/api/panel/polls/action";
import { showToast } from "../../_shared/components/alerts/toast";
import { TextAreaField } from "../../_shared/components/fields/Text";
import { scrollToElement } from "../../_shared/utils/scroll";
import { PollHeader } from "./PollHeader";

interface PossibleStates {
  preview: {
    setShowPreview: Dispatch<SetStateAction<boolean>>;
  };
  external: {};
  internal: {};
}

interface PollFormProps<T extends keyof PossibleStates> {
  data: Prisma.PollGetPayload<{
    include: {
      PollQuestion: {
        select: {
          id: true;
          allowFreeAnswer: true;
          allowMultipleAnswers: true;
          question: true;
          PollOption: true;
        };
      };
    };
  }>;
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
  const pollId = data.id;
  const form = useForm({
    defaultValues: {
      pollId,
      questions: data.PollQuestion.map((question) => ({
        questionId: question.id,
        answers: {
          freeAnswer: "",
        },
      })),
    },
    resolver: zodResolver(pollAnswerDto),
  });
  const { fields } = useFieldArray({
    control: form.control,
    name: "questions",
  });
  const [success, setSuccess] = useState(false);

  const refs = useRef<HTMLTableCellElement[]>([]);

  function findQuestionById(id: string) {
    return data.PollQuestion.find((q) => q.id === id);
  }

  const { trigger: vote } = useAction({
    action: answerPoll,
    onSuccess: (res) => {
      setSuccess(true);
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
  });

  return (
    <form
      className="px-4 pb-20 pt-10"
      onSubmit={form.handleSubmit((data) => vote(data))}
    >
      <PollHeader campaign={campaign} success={success} alreadyVoted={false} />

      {!success && (
        <>
          <div className="my-4">
            {fields.map(
              (question, index) =>
                question.questionId && (
                  <div
                    key={index}
                    id={`question-${index}`}
                    className="my-4 overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5"
                  >
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            ref={(el) => {
                              if (el) {
                                refs.current[index] = el;
                              }
                            }}
                            onClick={() => scrollToElement(refs.current[index])}
                          >
                            <div className="font-semibold">
                              {
                                data.PollQuestion.find(
                                  (q) => q.id === question.questionId
                                )?.question
                              }
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {findQuestionById(question.questionId)?.PollOption.map(
                          (option, k) => {
                            const optionName = option.name;
                            return (
                              <tr key={`question-${index}-option-${k}`}>
                                <td className="flex items-center whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  {data.PollQuestion.find(
                                    (q) => q.id === question.questionId
                                  )?.allowMultipleAnswers ? (
                                    <CheckboxInput
                                      hform={form}
                                      label={optionName}
                                      name={`questions.${index}.answers.options.${option.id}`}
                                    />
                                  ) : (
                                    <RadioInput
                                      hform={form}
                                      label={optionName}
                                      group={`questions.${index}.answers.options`}
                                      name={`questions.${index}.answers.options.${option.id}`}
                                      data={option.id}
                                    />
                                  )}
                                </td>
                              </tr>
                            );
                          }
                        )}

                        {findQuestionById(question.questionId)
                          ?.allowFreeAnswer && (
                          <tr>
                            <td className="p-4">
                              <TextAreaField
                                hform={form}
                                label={
                                  findQuestionById(question.questionId)
                                    ?.PollOption.length
                                    ? "Comentários:"
                                    : "Resposta:"
                                }
                                name={`questions.${index}.answers.freeAnswer`}
                              />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )
            )}
          </div>
          <BottomNavigation className="flex justify-end gap-3 py-3 lg:hidden">
            <div className="mx-3 flex items-center gap-2">
              {!form.formState.isValid && (
                <p className="text-xs text-red-500">
                  Responda todas as perguntas para enviar
                </p>
              )}
              <Button
                variant="primary"
                type="submit"
                disabled={!form.formState.isValid}
              >
                Enviar
              </Button>
            </div>
          </BottomNavigation>
        </>
      )}
    </form>
  );
}
