"use client";
import { useForm } from "react-hook-form";
import QuestionFieldArray from "./components/QuestionFieldArray";
import { PageTitle } from "../../_shared/components/text/PageTitle";

const defaultValues = {
  title: "",
  activeAtSignUp: false,
  questions: [
    {
      name: "",
      allowMultipleAnswers: false,
      allowFreeAnswer: false,
      options: [{ name: "" }],
    },
  ],
};

export default function PesquisasPage() {
  const form = useForm({ defaultValues });

  return (
    <>
      <QuestionFieldArray form={form} />
    </>
  );
}
