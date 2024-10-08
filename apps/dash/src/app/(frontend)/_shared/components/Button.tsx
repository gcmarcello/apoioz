import clsx from "clsx";
import React, { cloneElement } from "react";

interface ExtraButtonProps {
  variant?: "primary" | "secondary" | "danger" | "excel" | "success";
}

type ButtonProps = ExtraButtonProps & React.ComponentProps<"button">;

interface IconOnlyButtonProps extends ButtonProps {
  icon?: any;
  iconClassName?: string;
}

const buttonDictionary = {
  primary:
    "bg-rose-600 hover:bg-rose-500 disabled:opacity-50 focus-visible:outline-rose-600 text-white",
  secondary:
    "bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-900 focus-visible:outline-white ring-gray-300",
  danger:
    "bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white focus-visible:outline-white ring-red-700",
  success:
    "bg-green-500 hover:bg-green-600 disabled:opacity-70 text-white focus-visible:outline-white ring-green-500",
  excel:
    "bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white focus-visible:outline-white ring-emerald-500",
};

export function Button({
  children,
  className,
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-md px-3  py-2 text-sm font-semibold shadow-sm ring-1 ring-inset focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
        variant && buttonDictionary[variant]
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconOnlyButton({
  icon,
  className,
  iconClassName,
  onClick,
  type = "button",
  disabled,
}: IconOnlyButtonProps) {
  const Icon = icon;
  return (
    <button
      className={className || "h-6 w-6"}
      disabled={disabled}
      type={type}
      onClick={() => onClick}
    >
      <Icon className={clsx(iconClassName, disabled && "opacity-50")} />
    </button>
  );
}
