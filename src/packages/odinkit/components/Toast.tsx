"use client";
import React, { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import toast, { Toast } from "react-hot-toast";

interface ToastContentProps {
  toastElement: ToastType;
  visible: boolean;
}

interface ToastType {
  message: string | string[];
  title: string;
  variant: "success" | "error" | "alert";
}

export const toastVariants = {
  success: {
    bg: "bg-lime-300",
    border: "border-lime-400",
    icon: <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />,
  },
  error: {
    bg: "bg-red-500",
    border: "border-red-700",
    icon: <XCircleIcon className="h-6 w-6 text-zinc-900" aria-hidden="true" />,
  },
  alert: {
    bg: "bg-yellow-500",
    border: "border-yellow-700",
    icon: <ExclamationCircleIcon className="h-6 w-6 text-black" aria-hidden="true" />,
  },
};

export type ToastVariantTypes = typeof toastVariants;

const ToastContent: React.FC<ToastContentProps> = ({ toastElement, visible }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [visible]);

  return (
    <Transition
      show={show}
      enter="transition ease-out duration-300"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-300"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
      className={clsx("w-full")}
    >
      <div
        className={clsx(
          "rounded-lg",
          "border",
          toastVariants[toastElement.variant].bg,
          toastVariants[toastElement.variant].border
        )}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {toastVariants[toastElement.variant].icon}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-black">{toastElement.title}</p>
              <p className="mt-1 text-sm text-black">{toastElement.message}</p>
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                className="inline-flex rounded-md  text-black hover:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                onClick={() => {
                  toast.dismiss();
                }}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export function showToast(toastElement: ToastType): string {
  return toast.custom((t) => (
    <div className="pointer-events-auto flex w-full max-w-md bg-transparent shadow-lg ring-opacity-5">
      <ToastContent toastElement={toastElement} visible={t.visible} />
    </div>
  ));
}
