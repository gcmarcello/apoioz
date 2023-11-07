import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { ErrorField } from "../ErrorField";

export const InputField = ({ children, errorMessage, relative }: any) => (
  <>
    <div className="relative rounded-md">
      {children}
      <div
        className={clsx(
          "absolute inset-y-0 right-0  z-30 items-center",
          errorMessage ? "text-red-500" : "text-gray-400"
        )}
      >
        <div className="flex h-full w-full items-center pr-2">
          {errorMessage ? (
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          ) : (
            relative
          )}
        </div>
      </div>
    </div>
    <ErrorField message={errorMessage} />
  </>
);
