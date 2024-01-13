import {
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

export default function WarningAlert({ warnings }: { warnings: string[] }) {
  if (!warnings) return;
  return (
    <>
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Alerta!</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul role="list" className="list-disc space-y-1 pl-5">
                {warnings.map((error: string, index: number) => (
                  <li key={index}>
                    <p dangerouslySetInnerHTML={{ __html: error }}></p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
