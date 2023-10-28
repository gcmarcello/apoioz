import React, { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import toast from "react-hot-toast";

export interface ToastType {
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

export function showToast(toastElement: ToastType) {
  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } pointer-events-auto flex w-full max-w-md  bg-white shadow-lg ring-opacity-5`}
    >
      <div className={clsx("w-full rounded-lg", toastVariants[toastElement.variant].bg)}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {toastVariants[toastElement.variant].icon}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-700">{toastElement.title}</p>
              <p className="mt-1 text-sm text-gray-500">{toastElement.message}</p>
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                className="inline-flex rounded-md  text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                onClick={() => {
                  toast.dismiss(t.id);
                }}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));
}
