/* eslint-disable react/display-name */
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useId, forwardRef } from "react";
import { Controller } from "react-hook-form";
import InputMask from "react-input-mask";

const fieldClasses =
  "block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none sm:text-sm";

function Label({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <label htmlFor={id} className="mb-3 block text-sm font-medium text-black">
      {children}
    </label>
  );
}

type TextFieldProps = Omit<React.ComponentPropsWithoutRef<"input">, "id"> & {
  label: string;
  relative?: JSX.Element;
  options?: {
    errorMessage?: string | undefined;
  };
};

export const ErrorField = ({ message }: { message: string | undefined }) =>
  message ? <p className="mt-1 h-2 w-full text-[11px] text-red-600">{message}</p> : null;

const InputField = ({ children, errorMessage, relative }: any) => (
  <>
    <div className="relative rounded-md">
      {children}
      <div
        className={clsx(
          "absolute inset-y-0 right-0  z-30 items-center",
          errorMessage ? "text-red-500" : "text-gray-400"
        )}
      >
        <div className="flex h-full w-full items-center pr-2">
          {errorMessage ? (
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          ) : (
            relative
          )}
        </div>
      </div>
    </div>
    <ErrorField message={errorMessage} />
  </>
);

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>((_props, ref) => {
  const id = useId();

  const { options, ...props } = _props;

  return (
    <div className={props.className}>
      {props.label && <Label id={id}>{props.label}</Label>}
      <InputField errorMessage={options?.errorMessage} relative={props.relative}>
        <input
          ref={ref}
          id={id}
          type={props.type}
          {...props}
          className={clsx(
            fieldClasses,
            "pr-8",
            options?.errorMessage
              ? "border-red-500 ring-red-500"
              : "focus:border-indigo-500 focus:ring-indigo-500"
          )}
        />
      </InputField>
    </div>
  );
});

type MaskedTextFieldProps = TextFieldProps & {
  mask: {
    fieldName: string;
    control: any;
    value: string;
  };
};

export const MaskedTextField = forwardRef<HTMLInputElement, MaskedTextFieldProps>(
  (_props, ref) => {
    const id = useId();

    const { options, mask, onChange, onBlur, ...props } = _props;

    return (
      <div className={props.className}>
        {props.label && <Label id={id}>{props.label}</Label>}
        <InputField errorMessage={options?.errorMessage} relative={props.relative}>
          <Controller
            name={mask.fieldName}
            control={mask.control}
            render={({ field }) => (
              <InputMask
                mask={mask.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                value={field.value}
                id={id}
                type={props.type}
                {...props}
                className={clsx(
                  fieldClasses,
                  options?.errorMessage
                    ? "border-red-500 ring-red-500"
                    : "focus:border-emerald-500 focus:ring-emerald-500"
                )}
              />
            )}
          />
        </InputField>
      </div>
    );
  }
);

export function SelectField({
  label,
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"select">, "id"> & { label: string }) {
  const id = useId();

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(fieldClasses, "pr-8")} />
    </div>
  );
}
