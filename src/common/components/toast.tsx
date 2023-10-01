import { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { usePanel } from "../hooks/usePanel";
import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface ToastVariantTypes {
  success: { bg: string; icon: JSX.Element };
  error: { bg: string; icon: JSX.Element };
  alert: { bg: string; icon: JSX.Element };
}

export default function Toast() {
  const { setShowToast, showToast } = usePanel();

  const handleCloseToast = () => {
    setShowToast({ show: false, message: "", title: "", variant: "" });
  };

  useEffect(() => {
    if (showToast.show) {
      setTimeout(() => {
        handleCloseToast();
      }, 5000);
    }
  }, [showToast]);

  const variants: ToastVariantTypes = {
    success: { bg: "bg-green-300", icon: <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" /> },
    error: { bg: "bg-red-300", icon: <XCircleIcon className="h-6 w-6 text-gray-800" aria-hidden="true" /> },
    alert: { bg: "bg-yellow-300", icon: <ExclamationCircleIcon className="h-6 w-6 text-black" aria-hidden="true" /> },
  };

  if (!showToast.variant) return;

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none z-[9999] fixed inset-0 flex items-end px-4 py-6  sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={showToast.show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={clsx(
                "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5",
                variants[showToast.variant].bg
              )}
            >
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">{variants[showToast.variant].icon}</div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-700">{showToast.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{showToast.message}</p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md  text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                      onClick={() => {
                        handleCloseToast();
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
        </div>
      </div>
    </>
  );
}
