import { CheckCircleIcon } from "@heroicons/react/24/solid";
import LoginForm from "./components/LoginForm";
import Link from "next/link";
import ErrorAlert from "../../_shared/components/alerts/errorAlert";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error: string };
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center bg-white px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-700">
          Faça login no ApoioZ
        </h2>
        {searchParams.error === "invalidRecoveryCode" && (
          <div className="my-2">
            <ErrorAlert errors={["Código de recuperação inválido"]} />
          </div>
        )}
      </div>

      <LoginForm />
      <div className="my-2 flex justify-center sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="text-center text-sm text-gray-500">
          Esqueceu a senha ou não configurou?{" "}
          <Link
            href={"/recuperar"}
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-400"
          >
            Clique aqui!
          </Link>
        </p>
      </div>
    </div>
  );
}
