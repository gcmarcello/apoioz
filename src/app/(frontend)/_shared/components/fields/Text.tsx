/* eslint-disable react/display-name */
import clsx from "clsx";
import React, { useId } from "react";
import { Controller, FieldValues } from "react-hook-form";
import { BaseProps, Field, fieldClasses, getErrorMessage } from "./Field";
import InputMask from "react-input-mask";

type TextFieldProps<Fields extends FieldValues> = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "id"
> &
  BaseProps<Fields>;

type TextAreaFieldProps<Fields extends FieldValues> = Omit<
  React.ComponentPropsWithoutRef<"textarea">,
  "id"
> &
  BaseProps<Fields>;

type MaskedTextFieldProps<Fields extends FieldValues> = TextFieldProps<Fields> & {
  mask: string;
};

export function TextField<T extends FieldValues>(props: TextFieldProps<T>) {
  const id = useId();

  const errorMessage = getErrorMessage(props.hform, props.name);

  const className = clsx(
    fieldClasses,
    props.className,
    errorMessage
      ? "border-red-500 ring-red-500"
      : "focus:border-indigo-500 focus:ring-indigo-500 ",
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
        {...props.hform.register(props.name)}
        {...props}
        className={className}
      />
    </Field>
  );
}

export function TextFieldWithAddon<T extends FieldValues>(
  props: TextFieldProps<T> & { addon: string }
) {
  const id = useId();

  const errorMessage = getErrorMessage(props.hform, props.name);

  const className = clsx(
    fieldClasses,
    props.className,
    errorMessage
      ? "border-red-500 ring-red-500"
      : "focus:border-indigo-500 focus:ring-indigo-500 ",
    "pr-8"
  );

  return (
    <Field
      errorMessage={errorMessage}
      relative={props.relative}
      id={id}
      label={props.label}
    >
      <div className="mt-2 flex rounded-md shadow-sm">
        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
          {props.addon}
        </span>
        <input
          id={id}
          type={props.type}
          {...props.hform.register(props.name)}
          {...props}
          className={clsx(className, "rounded-l-none")}
        />
      </div>
    </Field>
  );
}

export function TextAreaField<T extends FieldValues>(props: TextAreaFieldProps<T>) {
  const id = useId();

  const errorMessage = getErrorMessage(props.hform, props.name);

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
      <textarea
        id={id}
        {...props}
        {...props.hform.register(props.name)}
        className={className}
      />
    </Field>
  );
}

export function MaskedTextField<T extends FieldValues>(_props: MaskedTextFieldProps<T>) {
  const id = useId();

  const { mask, onChange, onBlur, ...props } = _props;

  const errorMessage = getErrorMessage(props.hform, props.name);

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
        control={props.hform.control as any}
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
            maskPlaceholder=""
          />
        )}
      />
    </Field>
  );
}
