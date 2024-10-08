import { XCircleIcon } from "@heroicons/react/24/solid";

export default function ErrorAlert({
  errors,
  ref,
}: {
  errors: string[];
  ref?: any;
}) {
  if (!errors) return;
  return (
    <>
      <div ref={ref} className="rounded-md bg-red-50 p-3 lg:p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Ocorreu um erro!
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <ul role="list" className="list-disc space-y-1 pl-5">
                {errors.map((error: string, index: number) => (
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
