import {
  Description as HeadlessDescription,
  Field as HeadlessField,
  Fieldset as HeadlessFieldset,
  Label as HeadlessLabel,
  Legend as HeadlessLegend,
  type DescriptionProps as HeadlessDescriptionProps,
  type FieldProps as HeadlessFieldProps,
  type FieldsetProps as HeadlessFieldsetProps,
  type LabelProps as HeadlessLabelProps,
  type LegendProps as HeadlessLegendProps,
} from "@headlessui/react";
import clsx from "clsx";
import type React from "react";
import { createContext, useContext } from "react";
import {
  useForm,
  Path,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { ZodObject, ZodRawShape, ZodType, ZodTypeAny, z } from "zod";
import { getEntryFromPath } from "./utils/getEntryFromPath";

export function Form<Fields extends FieldValues>(props: {
  children: React.ReactNode;
  onSubmit: (data: Fields) => void;
  hform: ReturnType<typeof useForm<Fields>>;
  className?: string;
}) {
  return (
    <FormProvider {...props.hform}>
      <form
        className={props.className}
        onSubmit={props.hform?.handleSubmit((data) => props.onSubmit(data))}
      >
        {props.children}
      </form>
    </FormProvider>
  );
}

export function Fieldset({
  className,
  ...props
}: { disabled?: boolean } & HeadlessFieldsetProps) {
  return (
    <HeadlessFieldset
      {...props}
      className={clsx(
        className,
        "[&>*+[data-slot=control]]:mt-6 [&>[data-slot=text]]:mt-1"
      )}
    />
  );
}

export function Legend({ ...props }: HeadlessLegendProps) {
  return (
    <HeadlessLegend
      {...props}
      data-slot="legend"
      className={clsx(
        props.className,
        "text-base/6 font-semibold text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-white"
      )}
    />
  );
}

export function FieldGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div {...props} data-slot="control" className={clsx(className)} />;
}

const FieldContext = createContext<{
  error: string;
  name: string;
  isRequired: boolean;
}>(null!);

export function useField() {
  return useContext(FieldContext);
}

type FieldProps<Fields extends FieldValues> = HeadlessFieldProps & {
  name: Path<Fields>;
};

function Field<Fields extends FieldValues>({
  className,
  enableAsterisk,
  zodobject,
  ...props
}: FieldProps<Fields> & {
  zodobject: ZodObject<ZodRawShape, "strip", ZodTypeAny, Fields, Fields>;
  enableAsterisk: boolean;
}) {
  const form = useFormContext();

  const name = props["name"];
  const zodField = getEntryFromPath(zodobject.shape, name, "shape").entryValue;
  const isRequired = enableAsterisk && !zodField?.isOptional();

  const fieldContextValue = {
    name,
    isRequired,
    error: getEntryFromPath(form.formState.errors, name).entryValue?.message,
  };

  return (
    <FieldContext.Provider value={fieldContextValue}>
      <HeadlessField
        className={clsx(
          className,
          "[&>[data-slot=label]+[data-slot=control]]:mt-3",
          "[&>[data-slot=label]+[data-slot=description]]:mt-1",
          "[&>[data-slot=description]+[data-slot=control]]:mt-3",
          "[&>[data-slot=control]+[data-slot=description]]:mt-3",
          "[&>[data-slot=control]+[data-slot=error]]:mt-3",
          "[&>[data-slot=label]]:font-medium"
        )}
        {...props}
      />
    </FieldContext.Provider>
  );
}

export function createField<Fields extends FieldValues>({
  zodObject,
  enableAsterisk = false,
}: {
  zodObject: ZodObject<ZodRawShape, "strip", ZodTypeAny, Fields, Fields>;
  enableAsterisk?: boolean;
}) {
  // eslint-disable-next-line react/display-name
  return (props: FieldProps<Fields>) => {
    return <Field {...props} enableAsterisk={enableAsterisk} zodobject={zodObject} />;
  };
}

export function Label({
  className,
  children,
  ...props
}: { className?: string } & HeadlessLabelProps) {
  const { isRequired } = useField();

  return (
    <HeadlessLabel
      {...props}
      data-slot="label"
      className={clsx(
        className,
        "select-none text-base/6 text-zinc-950 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-white"
      )}
    >
      <>
        {children} {isRequired && <span className="text-red-600">*</span>}
      </>
    </HeadlessLabel>
  );
}

export function Description({
  className,
  disabled,
  ...props
}: { className?: string; disabled?: boolean } & HeadlessDescriptionProps) {
  return (
    <HeadlessDescription
      {...props}
      data-slot="description"
      className={clsx(
        className,
        "text-base/6 text-zinc-500 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-zinc-400"
      )}
    />
  );
}

export function ErrorMessage({
  className,
  disabled,
  ...props
}: { className?: string; disabled?: boolean } & HeadlessDescriptionProps) {
  const { error } = useField()!;

  return (
    <HeadlessDescription
      {...props}
      data-slot="error"
      className={clsx(
        className,
        "text-base/6 text-red-600 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-red-500"
      )}
    >
      {error}
    </HeadlessDescription>
  );
}
