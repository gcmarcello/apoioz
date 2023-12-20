import { useState } from "react";
import { useForm } from "react-hook-form";

export type MetaForm = {
  form: any;
  submit: any;
};

export const useMetaForm = () => {
  const [metaForm, setMetaform] = useState<MetaForm>();

  const submit = metaForm?.form.handleSubmit(metaForm.submit);

  const isValid = metaForm?.form?.formState?.isValid;

  const reset = metaForm?.form?.reset;

  return { submit, reset, isValid, setMetaform };
};
