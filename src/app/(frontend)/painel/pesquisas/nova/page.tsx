import { useForm } from "react-hook-form";
import QuestionFieldArray from "../components/QuestionFieldArray";
import { PageTitle } from "../../../_shared/components/text/PageTitle";
import PageHeader from "@/app/(frontend)/_shared/components/PageHeader";

const defaultValues = {
  title: "",
  activeAtSignUp: false,
  active: true,
  questions: [
    {
      question: "",
      allowMultipleAnswers: false,
      allowFreeAnswer: false,
      active: true,
      options: [{ name: "", active: true }],
    },
  ],
};

export default function NovaPesquisaPage() {
  return (
    <>
      <QuestionFieldArray defaultValues={defaultValues} />
    </>
  );
}
