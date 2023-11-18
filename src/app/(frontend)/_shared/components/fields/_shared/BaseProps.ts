import { Path, useForm } from "react-hook-form";

export interface BaseProps<Fields> {
  label: string;
  hform: ReturnType<typeof useForm<Fields>>;
  name: Path<Fields>;
  relative?: JSX.Element;
  disabled?: boolean;
}
