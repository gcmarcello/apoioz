import { InformationCircleIcon } from "@heroicons/react/24/solid";

export function InfoAlert({ children }) {
  return (
    <div className="mb-4 flex text-sm text-gray-600">
      <InformationCircleIcon className="me-1 h-5 w-5" />
      {children}
    </div>
  );
}
