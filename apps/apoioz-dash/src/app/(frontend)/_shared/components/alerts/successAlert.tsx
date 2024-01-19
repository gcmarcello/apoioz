import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function SuccessAlert({ successes }: { successes: string[] }) {
  if (!successes) return;
  return (
    <>
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Sucesso!</h3>
            <div className="mt-2 text-sm text-green-700">
              <ul role="list" className="list-disc space-y-1 pl-5">
                {successes.map((error: string, index: number) => (
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
