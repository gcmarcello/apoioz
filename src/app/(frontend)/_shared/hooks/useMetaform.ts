import { useState } from "react";
import { useForm } from "react-hook-form";

export type MetaForm = {
  form: ReturnType<typeof useForm>;
  submit: () => void;
};

export const useMetaForm = () => {
  const [metaForm, setMetaform] = useState<MetaForm>();

  const submit = metaForm?.form.handleSubmit(metaForm.submit);

  const isValid = metaForm?.form?.formState?.isValid;

  const reset = metaForm?.form?.reset;

  return { submit, reset, isValid, setMetaform };
};
