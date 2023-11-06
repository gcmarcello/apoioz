/* eslint-disable react/display-name */
import clsx from "clsx";
import { forwardRef, useId } from "react";
import { Controller } from "react-hook-form";
import { Label } from "./_shared/Label";
import { fieldClasses } from "./_shared/fieldClasses";
import { InputField } from "./_shared/InputField";
import InputMask from "react-input-mask";

type TextFieldProps = Omit<React.ComponentPropsWithoutRef<"input">, "id"> & {
  label: string;
  relative?: JSX.Element;
  options?: {
    errorMessage?: string | undefined;
  };
};

type MaskedTextFieldProps = TextFieldProps & {
  mask: {
    fieldName: string;
    control: any;
    value: string;
  };
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (_props, ref) => {
    const id = useId();

    const { options, ...props } = _props;

    return (
      <div className={props.className}>
        {props.label && <Label id={id}>{props.label}</Label>}
        <InputField
          errorMessage={options?.errorMessage}
          relative={props.relative}
        >
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
  }
);

export const MaskedTextField = forwardRef<
  HTMLInputElement,
  MaskedTextFieldProps
>((_props, ref) => {
  const id = useId();

  const { options, mask, onChange, onBlur, ...props } = _props;

  return (
    <div className={props.className}>
      {props.label && <Label id={id}>{props.label}</Label>}
      <InputField
        errorMessage={options?.errorMessage}
        relative={props.relative}
      >
        <Controller
          name={mask.fieldName}
          control={mask.control}
          render={({ field }) => (
            <InputMask
              mask={mask.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              value={field.value || ""}
              id={id}
              type={props.type}
              {...props}
              className={clsx(
                fieldClasses,
                options?.errorMessage
                  ? "border-red-500 ring-red-500"
                  : "focus:border-indigo-500 focus:ring-indigo-500"
              )}
            />
          )}
        />
      </InputField>
    </div>
  );
});
