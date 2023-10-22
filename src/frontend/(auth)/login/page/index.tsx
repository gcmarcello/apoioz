import { useSearchParams } from "next/navigation";
import LoginForm from "../components/form";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { success?: number };
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Faça login no ApoioZ
        </h2>
        {searchParams.success && (
          <div className="my-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon
                  className="h-5 w-5 text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Campanha criada com sucesso! Faça login para continuar.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <LoginForm />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="mt-10 text-center text-sm text-gray-400">
          Not a member?{" "}
          <a
            href="#"
            className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
          >
            Start a 14 day free trial
          </a>
        </p>
      </div>
    </div>
  );
}
