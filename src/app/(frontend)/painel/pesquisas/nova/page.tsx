import { useForm } from "react-hook-form";
import QuestionFieldArray from "../components/QuestionFieldArray";
import { PageTitle } from "../../../_shared/components/text/PageTitle";
import PageHeader from "@/app/(frontend)/_shared/components/PageHeader";

const defaultValues = {
  title: "",
  activeAtSignUp: false,
  questions: [
    {
      question: "",
      allowMultipleAnswers: false,
      allowFreeAnswer: false,
      options: [{ name: "" }],
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
