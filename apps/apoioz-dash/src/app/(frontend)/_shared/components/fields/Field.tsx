import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { ReactNode } from "react";
import { useForm, Path, FieldValues } from "react-hook-form";

interface FieldProps {
  children: any;
  errorMessage: string;
  label: ReactNode;
  id: string;
  relative?: ReactNode;
}

export interface BaseProps<Fields extends FieldValues> {
  label?: string;
  hform: ReturnType<typeof useForm<Fields>>;
  name: Path<Fields>;
  relative?: JSX.Element;
  disabled?: boolean;
}

export const fieldClasses =
  "block w-full appearance-none rounded-md border border-gray-200  px-3 py-1.5 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm";

export const passwordFieldClasses =
  "block w-full appearance-none rounded-s-md border border-gray-200  px-3 py-1.5 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm";

export const getErrorMessage = (form: any, name: string) => {
  const path = name.split(".");

  const errorMessage = path.reduce(
    (acc, part) => acc && acc[part],
    form.formState.errors
  )?.message as string;

  return errorMessage;
};

export const ErrorField = ({ message }: { message: string | undefined }) =>
  message ? (
    <p className="mt-1 h-2 w-full text-[11px] text-red-600">{message}</p>
  ) : null;

export function Label({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-black">
      {children}
    </label>
  );
}

export const Field = ({
  children,
  errorMessage,
  relative,
  label,
  id,
}: FieldProps) => (
  <div>
    {label && <Label id={id}>{label}</Label>}
    <div className="relative rounded-md">
      {children}
      <div
        className={clsx(
          "absolute inset-y-0 right-0  z-30 items-center",
          errorMessage ? "text-red-500" : "text-gray-400"
        )}
      >
        <div className="flex h-full w-full items-center pr-2">
          {errorMessage && !relative ? (
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          ) : (
            relative
          )}
        </div>
      </div>
    </div>
    <ErrorField message={errorMessage} />
  </div>
);
