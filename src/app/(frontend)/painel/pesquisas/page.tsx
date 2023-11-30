"use client";
import { useForm } from "react-hook-form";
import QuestionFieldArray from "./components/QuestionFieldArray";

const defaultValues = {
  test: [
    {
      name: "useFieldArray1",
      nestedArray: [{ field1: "field1" }],
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
