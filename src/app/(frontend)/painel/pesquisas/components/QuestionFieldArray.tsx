"use client";
import { useFieldArray, useForm } from "react-hook-form";
import OptionFieldArray from "./OptionFieldArray";
import { TextField } from "@/app/(frontend)/_shared/components/fields/Text";
import {
  CheckCircleIcon,
  EyeIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Button, IconOnlyButton } from "../../../_shared/components/Button";
import { BottomNavigation } from "@/app/(frontend)/_shared/components/navigation/BottomNavigation";
import SwitchInput from "@/app/(frontend)/_shared/components/fields/Switch";
import { InfoAlert } from "@/app/(frontend)/_shared/components/alerts/infoAlert";
import { PollForm } from "./PollForm";
import { useState } from "react";
import clsx from "clsx";
import { ArrowLeftCircleIcon } from "@heroicons/react/20/solid";
import { useAction } from "@odinkit/hooks/useAction";
import { createPoll, updatePoll } from "@/app/api/panel/polls/action";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import { useRouter } from "next/navigation";
import Loading from "@/app/(frontend)/loading";
import PageHeader from "@/app/(frontend)/_shared/components/PageHeader";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpsertPollDto, upsertPollDto } from "@/app/api/panel/polls/dto";

export default function QuestionFieldArray({ defaultValues }: { defaultValues: any }) {
  const form = useForm({
    defaultValues,
    resolver: zodResolver(upsertPollDto),
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
    rules: { minLength: 1, required: true },
  });
  const router = useRouter();

  const [showPreview, setShowPreview] = useState(false);
  const { trigger, isMutating } = useAction({
    action: (data: UpsertPollDto) => {
      return defaultValues.id ? updatePoll(data) : createPoll(data);
    },
    onSuccess: (res) => {
      router.push("/painel/pesquisas");
      showToast({
        message: !defaultValues.id
          ? "Pesquisa criada com sucesso!"
          : "Pesquisa atualizada com sucesso!",
        title: "Sucesso",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        message: error,
        title: "Erro",
        variant: "error",
      });
    },
  });

  function handleTogglePreview() {
    setShowPreview((prev) => !prev);
    scrollTo({ top: 0, behavior: "smooth" });
  }

  let pseudoIndex = 0;

  if (isMutating) return <Loading />;

  return (
    <>
      {showPreview ? (
        <PollForm data={form.watch()} mode={"preview"} states={{ setShowPreview }} />
      ) : (
        <form onSubmit={form.handleSubmit((data) => trigger(data))}>
          <PageHeader
            title={defaultValues.id ? "Editar Pesquisa" : "Nova Pesquisa"}
            secondaryButton={{ href: "../", text: "Voltar" }}
          />
          <div className="space-y-4 pb-20">
            <div className="flex space-x-4">
              <div className="flex-grow">
                <TextField
                  hform={form}
                  placeholder="ex. Pesquisa de Opinião"
                  label="Nome"
                  name={"title"}
                />
              </div>

              <div className="hidden space-x-4 lg:flex lg:items-end">
                {form.watch("title") && (
                  <Button
                    onClick={() => setShowPreview((prev) => !prev)}
                    variant="secondary"
                  >
                    <div className="flex items-center justify-center gap-x-2">
                      Visualizar <EyeIcon className="h-5 w-5" />
                    </div>
                  </Button>
                )}
                <Button
                  onClick={() =>
                    append({
                      question: "",
                      allowMultipleAnswers: false,
                      allowFreeAnswer: false,
                      active: true,
                      options: [{ name: "", active: true }],
                    })
                  }
                  variant="secondary"
                >
                  <div className="flex items-center justify-center gap-x-2">
                    Adicionar Pergunta <PlusCircleIcon className="h-5 w-5" />
                  </div>
                </Button>
                <Button type="submit" variant="primary">
                  <div className="flex items-center justify-center gap-x-2">
                    Salvar <CheckCircleIcon className="h-5 w-5" />
                  </div>
                </Button>
              </div>
            </div>
            {form.getValues("id") && (
              <SwitchInput control={form.control} label="Ativada" name="active" />
            )}
            <SwitchInput
              control={form.control}
              label="Pesquisa Principal"
              name="activeAtSignUp"
            />

            <InfoAlert>
              Se marcado, essa pesquisa será exibida ao cadastrar um novo apoiador.
            </InfoAlert>
            <hr className="my-4" />
            {fields.map((item, index) => {
              if (!form.watch(`questions.${index}.active`)) return null;
              pseudoIndex++;
              return (
                <div key={item.id}>
                  <div className="flex items-end ">
                    <div className="flex-grow">
                      <TextField
                        label="Pergunta"
                        hform={form}
                        placeholder="ex. O que falta no seu bairro?"
                        name={`questions.${index}.question` as const}
                      />
                    </div>
                    <IconOnlyButton
                      icon={XCircleIcon}
                      onClick={() => {
                        if (form.getValues(`questions.${index}.id`)) {
                          form.setValue(`questions.${index}.active`, false);
                        } else {
                          remove(index);
                        }
                      }}
                      className="mx-2 h-8 w-8"
                      iconClassName={"text-red-600"}
                      disabled={fields.length <= 1}
                    />
                  </div>
                  <div className="my-4 space-y-4">
                    <SwitchInput
                      control={form.control}
                      disabled={!form.watch(`questions.${index}.options`)?.length}
                      label="Permitir múltiplas respostas?"
                      name={`questions.${index}.allowMultipleAnswers` as const}
                    />
                    <SwitchInput
                      control={form.control}
                      disabled={!form.watch(`questions.${index}.options`)?.length}
                      label="Permitir resposta livre?"
                      name={`questions.${index}.allowFreeAnswer` as const}
                    />
                  </div>
                  <div>
                    <OptionFieldArray
                      nestIndex={index}
                      form={form}
                      {...{ control: form.control, register: form.register }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </form>
      )}
      <BottomNavigation className={clsx("gap-3 py-3 lg:hidden")}>
        <div className={clsx("mx-3 flex space-x-3", "justify-between")}>
          <Button onClick={() => handleTogglePreview()} variant="secondary">
            {showPreview ? (
              <div className="flex gap-2">
                <ArrowLeftCircleIcon className="h-5 w-5" /> Voltar
              </div>
            ) : (
              <>
                <EyeIcon className="h-5 w-5" />
              </>
            )}
          </Button>
          {!showPreview && (
            <Button
              onClick={() =>
                append({
                  question: "",
                  allowMultipleAnswers: false,
                  allowFreeAnswer: false,
                  active: true,
                  options: [{ name: "", active: true }],
                })
              }
              variant="secondary"
            >
              <div className="flex items-center justify-center gap-x-2">
                Adicionar Pergunta <PlusCircleIcon className="h-6 w-6" />
              </div>
            </Button>
          )}
          <Button type="submit" variant="primary">
            <div className="flex items-center justify-center gap-x-2">
              Salvar <CheckCircleIcon className="h-6 w-6" />
            </div>
          </Button>
        </div>
      </BottomNavigation>
    </>
  );
}
