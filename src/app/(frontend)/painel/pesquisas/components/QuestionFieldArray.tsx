import { UseFormReturn, useFieldArray } from "react-hook-form";
import OptionFieldArray from "./OptionFieldArray";
import { TextField } from "@/app/(frontend)/_shared/components/fields/Text";
import {
  CheckCircleIcon,
  EyeIcon,
  InformationCircleIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Button, IconOnlyButton } from "../../../_shared/components/Button";
import { BottomNavigation } from "@/app/(frontend)/_shared/components/navigation/BottomNavigation";
import { PageTitle } from "@/app/(frontend)/_shared/components/text/PageTitle";
import SwitchInput from "@/app/(frontend)/_shared/components/fields/Switch";
import { InfoAlert } from "@/app/(frontend)/_shared/components/alerts/infoAlert";
import { PollForm } from "./PollForm";
import { useState } from "react";
import clsx from "clsx";

export default function QuestionFieldArray({ form }: { form: any }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
    rules: { minLength: 1, required: true },
  });
  const [showPreview, setShowPreview] = useState(false);

  function handleSubmit(data) {
    console.log(data);
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {showPreview ? (
          <PollForm data={form.watch()} mode={"preview"} />
        ) : (
          <>
            <PageTitle>Nova Pesquisa</PageTitle>
            <div className="space-y-4 pb-20">
              <div className="flex space-x-4">
                <div className="flex-grow">
                  <TextField
                    hform={form}
                    placeholder="ex. Pesquisa de Opinião"
                    label="Nome"
                    name={"title"}
                    registeroptions={{ required: true }}
                  />
                </div>

                <div className="hidden space-x-4 lg:flex lg:items-end">
                  <Button
                    className="max-h-[40px]"
                    onClick={() =>
                      append({
                        name: "",
                        allowMultipleAnswers: false,
                        allowFreeAnswer: false,
                        options: [{ name: "" }],
                      })
                    }
                    variant="secondary"
                  >
                    <div className="flex items-center justify-center gap-x-2">
                      Adicionar Pergunta <PlusCircleIcon className="h-6 w-6" />
                    </div>
                  </Button>
                  <Button
                    className="max-h-[40px]"
                    type="submit"
                    disabled={!form.formState.isValid}
                    variant="primary"
                  >
                    <div className="flex items-center justify-center gap-x-2">
                      Salvar <CheckCircleIcon className="h-6 w-6" />
                    </div>
                  </Button>
                </div>
              </div>
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
                return (
                  <div key={item.id}>
                    <div className="flex items-end ">
                      <div className="flex-grow">
                        <TextField
                          label="Pergunta"
                          hform={form}
                          placeholder="ex. O que falta no seu bairro?"
                          registeroptions={{ required: true }}
                          name={`questions.${index}.name` as const}
                        />
                      </div>
                      <IconOnlyButton
                        icon={XCircleIcon}
                        onClick={() => remove(index)}
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
          </>
        )}

        <BottomNavigation className={clsx("gap-3 py-3 lg:hidden")}>
          <div className={clsx("mx-3 flex space-x-3", "justify-between")}>
            <Button onClick={() => setShowPreview((prev) => !prev)} variant="secondary">
              <EyeIcon className="h-5 w-5" />
            </Button>
            {!showPreview && (
              <Button
                onClick={() =>
                  append({
                    name: "",
                    allowMultipleAnswers: false,
                    allowFreeAnswer: false,
                    options: [{ name: "" }],
                  })
                }
                variant="secondary"
              >
                <div className="flex items-center justify-center gap-x-2">
                  Adicionar Pergunta <PlusCircleIcon className="h-6 w-6" />
                </div>
              </Button>
            )}
            <Button type="submit" variant="primary" disabled={!form.formState.isValid}>
              <div className="flex items-center justify-center gap-x-2">
                Salvar <CheckCircleIcon className="h-6 w-6" />
              </div>
            </Button>
          </div>
        </BottomNavigation>
      </form>
    </>
  );
}
