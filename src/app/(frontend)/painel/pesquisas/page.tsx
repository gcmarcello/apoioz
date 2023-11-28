"use client";
import { useForm } from "react-hook-form";
import QuestionFieldArray from "./components/QuestionFieldArray";

const defaultValues = {
  test: [
    {
      name: "useFieldArray1",
      nestedArray: [{ field1: "field1", field2: "field2" }],
    },
    {
      name: "useFieldArray2",
      nestedArray: [{ field1: "field1", field2: "field2" }],
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
