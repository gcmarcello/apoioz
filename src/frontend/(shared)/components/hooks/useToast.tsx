import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

export interface ToastType {
  show: boolean;
  message: string;
  title: string;
  variant: "success" | "error" | "alert";
}

export const toastVariants = {
  success: {
    bg: "bg-green-300",
    icon: <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />,
  },
  error: {
    bg: "bg-red-300",
    icon: <XCircleIcon className="h-6 w-6 text-gray-800" aria-hidden="true" />,
  },
  alert: {
    bg: "bg-yellow-300",
    icon: <ExclamationCircleIcon className="h-6 w-6 text-black" aria-hidden="true" />,
  },
};

export type ToastVariantTypes = typeof toastVariants;

export const useToast = () => {
  const [toast, setToast] = useState<ToastType>({
    message: `This is a default toast!`,
    title: "Default Toast!",
    show: false,
    variant: "success",
  });
  return { toast, setToast };
};
