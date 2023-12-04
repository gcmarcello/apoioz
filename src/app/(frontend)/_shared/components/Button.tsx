import clsx from "clsx";
import React, { cloneElement } from "react";

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

interface IconOnlyButtonProps extends ButtonProps {
  icon?: any;
  iconClassName?: string;
}

const buttonDictionary = {
  primary:
    "bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 focus-visible:outline-indigo-600 text-white",
  secondary:
    "bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-900 focus-visible:outline-white ring-gray-300",
  danger:
    "bg-red-400 hover:bg-red-200 disabled:opacity-70 text-white focus-visible:outline-white ring-red-200",
};

export function Button({
  children,
  onClick,
  className,
  variant,
  type,
  disabled,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      type={type || "button"}
      onClick={onClick}
      className={clsx(
        "rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
        variant && buttonDictionary[variant]
      )}
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
      onClick={onClick}
    >
      <Icon className={clsx(iconClassName, disabled && "opacity-50")} />
    </button>
  );
}
