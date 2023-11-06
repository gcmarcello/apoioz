/* eslint-disable react/display-name */
import clsx from "clsx";
import { forwardRef, useId } from "react";
import { Label } from "./_shared/Label";
import { fieldClasses } from "./_shared/fieldClasses";

type SelectFieldProps = Omit<React.ComponentPropsWithoutRef<"select">, "id"> & {
  label: string;
  options?: {
    errorMessage?: string | undefined;
  };
};

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (props, ref) => {
    const id = useId();

    return (
      <div className={props.className}>
        {props.label && <Label id={id}>{props.label}</Label>}
        <select
          ref={ref}
          id={id}
          {...props}
          className={clsx(fieldClasses, "pr-8")}
        />
      </div>
    );
  }
);
