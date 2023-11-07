/* eslint-disable react/display-name */
import clsx from "clsx";
import { forwardRef, useId } from "react";
import { InputField } from "./_shared/InputField";
import { Label } from "./_shared/Label";
import { fieldClasses } from "./_shared/fieldClasses";

type TextFieldProps = Omit<React.ComponentPropsWithoutRef<"textarea">, "id"> & {
  label: string;
  options?: {
    errorMessage?: string | undefined;
  };
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextFieldProps>(
  (_props, ref) => {
    const id = useId();

    const { options, ...props } = _props;

    return (
      <div className={props.className}>
        {props.label && <Label id={id}>{props.label}</Label>}
        <InputField errorMessage={options?.errorMessage}>
          <textarea
            ref={ref}
            id={id}
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
