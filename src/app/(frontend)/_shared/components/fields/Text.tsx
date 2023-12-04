/* eslint-disable react/display-name */
import clsx from "clsx";
import React, { forwardRef, useId } from "react";
import { Controller, Path, useForm } from "react-hook-form";
import { BaseProps, Field, fieldClasses } from "./Field";
import InputMask from "react-input-mask";

type TextFieldProps<Fields> = Omit<React.ComponentPropsWithoutRef<"input">, "id"> &
  BaseProps<Fields>;

type TextAreaFieldProps<Fields> = Omit<React.ComponentPropsWithoutRef<"textarea">, "id"> &
  BaseProps<Fields>;

type MaskedTextFieldProps<Fields> = TextFieldProps<Fields> & {
  mask: string;
};

export function TextField<T>(props: TextFieldProps<T>) {
  const id = useId();

  const errorMessage = props.hform.formState.errors[props.name]?.message as string;

  const className = clsx(
    fieldClasses,
    props.className,
    errorMessage
      ? "border-red-500 ring-red-500"
      : "focus:border-indigo-500 focus:ring-indigo-500",
    "pr-8"
  );

  return (
    <Field
      errorMessage={errorMessage}
      relative={props.relative}
      id={id}
      label={props.label}
    >
      <input
        id={id}
        type={props.type}
        {...props.hform.register(props.name, props.registeroptions)}
        {...props}
        className={className}
      />
    </Field>
  );
}

export function TextAreaField<T>(props: TextAreaFieldProps<T>) {
  const id = useId();

  const errorMessage = props.hform.formState.errors[props.name]?.message as string;

  const className = clsx(
    fieldClasses,
    props.className,
    errorMessage
      ? "border-red-500 ring-red-500"
      : "focus:border-indigo-500 focus:ring-indigo-500",
    "pr-8"
  );

  return (
    <Field
      errorMessage={errorMessage}
      relative={props.relative}
      id={id}
      label={props.label}
    >
      <textarea id={id} {...props} className={className} />
    </Field>
  );
}

export function MaskedTextField<T>(_props: MaskedTextFieldProps<T>) {
  const id = useId();

  const { mask, onChange, onBlur, ...props } = _props;

  const errorMessage = props.hform.formState.errors[props.name]?.message as string;

  const className = clsx(
    fieldClasses,
    props.className,
    errorMessage
      ? "border-red-500 ring-red-500"
      : "focus:border-indigo-500 focus:ring-indigo-500",
    "pr-8"
  );

  return (
    <Field
      errorMessage={errorMessage}
      relative={props.relative}
      id={id}
      label={props.label}
    >
      <Controller
        name={props.name}
        control={props.hform.control}
        render={({ field }) => (
          <InputMask
            mask={mask}
            onChange={field.onChange}
            onBlur={field.onBlur}
            value={(field.value as string) || ""}
            id={id}
            type={props.type}
            {...props}
            className={className}
          />
        )}
      />
    </Field>
  );
}
