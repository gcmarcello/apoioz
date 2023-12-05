import { useForm, Controller, Control } from "react-hook-form";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

interface SwitchInputProps {
  control: any; //TODO: Fix typing
  name: string;
  label: string;
  subLabel?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function SwitchInput({
  control,
  name,
  label,
  subLabel,
  disabled,
  children,
}: SwitchInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Switch.Group as="div" className="flex items-center">
          <Switch
            disabled={disabled}
            checked={value}
            onChange={onChange}
            className={clsx(
              value ? "bg-indigo-600" : "bg-gray-200",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
              disabled && "opacity-50"
            )}
          >
            <span
              aria-hidden="true"
              className={clsx(
                value ? "translate-x-5" : "translate-x-0",
                "pointer-events-none flex h-5 w-5 transform items-center rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            >
              {children}
            </span>
          </Switch>
          <Switch.Label as="span" className="ml-3 text-sm">
            <span className="font-medium text-gray-900">{label}</span>{" "}
            {subLabel && <span className="text-gray-500">{subLabel}</span>}
          </Switch.Label>
        </Switch.Group>
      )}
    ></Controller>
  );
}
