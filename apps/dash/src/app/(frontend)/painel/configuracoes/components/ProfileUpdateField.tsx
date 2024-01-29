import { formatPhone } from "@/_shared/utils/format";
import { Date } from "@/app/(frontend)/_shared/components/Date";
import {
  PasswordField,
  TextField,
} from "@/app/(frontend)/_shared/components/fields/Text";
import { SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import InputMask from "react-input-mask";

export function ProfileUpdateField<T>({
  field,
  form,
  setShowFields,
  trigger,
}: {
  field: { label: string; show: boolean; name: string };
  setShowFields: React.Dispatch<SetStateAction<any>>;
  form: UseFormReturn<any, any, any>;
  trigger: any;
}) {
  return (
    <div className="pt-6 sm:flex">
      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
        {field.label}
      </dt>
      <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
        {field.show ? (
          <ProfileUpdatedInput form={form} type={field.name} />
        ) : (
          <ProfileUpdateDescription type={field.name} form={form} />
        )}
        <ProfileUpdateButtons
          field={field}
          setShowFields={setShowFields}
          trigger={trigger}
          form={form}
        />
      </dd>
    </div>
  );
}

function ProfileUpdatedInput({
  type,
  form,
}: {
  type: string;
  form: UseFormReturn;
}) {
  switch (type) {
    case "birthDate":
      return (
        <InputMask
          type="text"
          inputMode="numeric"
          autoComplete="birthDate"
          {...form.register("birthDate", { required: true })}
          name="birthDate"
          id="birthDate"
          className="block w-3/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          mask={"99/99/9999"}
        />
      );
    case "phone":
      return (
        <InputMask
          type="text"
          inputMode="numeric"
          autoComplete="phone"
          {...form.register("phone", { required: true })}
          name="phone"
          id="phone"
          className="block w-3/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          mask={"(99) 99999-9999"}
        />
      );

    case "password":
      return (
        <div className="flex flex-col gap-4 lg:flex-row">
          <PasswordField
            hform={form}
            name="password"
            placeholder="Nova Senha"
          />
          <PasswordField
            hform={form}
            name="confirmPassword"
            placeholder="Confirmar Senha"
          />
        </div>
      );

    default:
      return <TextField hform={form} name={type} placeholder={type} />;
  }
}

function ProfileUpdateDescription({
  type,
  form,
}: {
  type: string;
  form: UseFormReturn;
}) {
  switch (type) {
    case "birthDate":
      return (
        <div className="text-gray-900">
          <Date value={form.getValues(type)} />
        </div>
      );
    case "phone":
      return (
        <div className="text-gray-900">
          {formatPhone(form.getValues(type) || "")}
        </div>
      );
    case "password":
      return <div className="text-gray-900">******</div>;
    default:
      return <div className="text-gray-900">{form.getValues(type)}</div>;
  }
}

function ProfileUpdateButtons({
  field,
  setShowFields,
  trigger,
  form,
}: {
  field: { name: string; show: boolean; label: string };
  setShowFields: React.Dispatch<
    SetStateAction<{
      [key: string]: { name: string; show: boolean; label: string };
    }>
  >;
  trigger: any;
  form: UseFormReturn<any, any, any>;
}) {
  return (
    <div className="flex flex-col justify-evenly gap-y-3 space-x-3 lg:flex-row">
      {field.show && (
        <button
          type="button"
          className="font-semibold text-gray-400 hover:text-gray-600"
          onClick={() => {
            setShowFields((prevShowFields) => ({
              ...prevShowFields,
              [field.name]: {
                ...prevShowFields[field.name],
                show: false,
              },
            }));
          }}
        >
          Cancelar
        </button>
      )}
      <button
        type={!field.show ? "submit" : "button"}
        disabled={field.show && !form.formState.isValid ? true : false}
        className="font-semibold text-indigo-600 hover:text-indigo-500 disabled:text-indigo-200"
        onClick={() => {
          setShowFields((prevShowFields) => ({
            ...prevShowFields,
            [field.name]: {
              ...prevShowFields[field.name],
              show: !prevShowFields[field.name].show,
            },
          }));
        }}
      >
        {field.show ? "Salvar" : "Atualizar"}
      </button>
    </div>
  );
}
