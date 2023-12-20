"use client";

import { ButtonSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import { useAction } from "@/app/(frontend)/_shared/hooks/useAction";
import { resetPassword } from "@/app/api/auth/action";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function NewPasswordForm({
  resetInfo,
}: {
  resetInfo: {
    valid: boolean;
    code: string;
    userName: string | null;
    userId: string;
  };
}) {
  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
      userId: resetInfo.userId,
      code: resetInfo.code,
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    data: newPassword,
    trigger: submitPasswordReset,
    isMutating: loading,
  } = useAction({
    action: resetPassword,
    onSuccess: () => {
      router.push("/painel");
    },
    onError: (err) => showToast({ message: err, title: "Erro", variant: "error" }),
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center bg-white px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
        />

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-700">
          Olá {resetInfo.userName}!
        </h2>
      </div>

      <div className="my-2 flex flex-col justify-end space-y-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="mb-2 text-center text-sm text-gray-500">
          Digite e confime sua nova senha abaixo para reaver o acesso ao painel de
          controle das redes de apoio que você participa!
        </p>
        <form
          onSubmit={form.handleSubmit((data) => submitPasswordReset(data))}
          className="flex flex-col items-center"
        >
          <label
            htmlFor="password"
            className="block w-full text-left text-sm font-medium leading-6 text-gray-900"
          >
            Senha
          </label>
          <div className="mb-4 mt-2 flex w-full rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="password"
                {...form.register("password", { required: true })}
                id="password"
                className="block w-full  rounded-none rounded-l-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md border-none bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {showPassword ? (
                <EyeSlashIcon
                  className="-ml-0.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              ) : (
                <EyeIcon className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </button>
          </div>

          <label
            htmlFor="password"
            className="block w-full text-left text-sm font-medium leading-6 text-gray-900"
          >
            Confirmar Senha
          </label>
          <div className="mt-2 flex w-full rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="password"
                {...form.register("confirmPassword", {
                  required: true,
                  validate: (value) => value === form.watch("password"),
                })}
                id="confirmPassword"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <button
            disabled={loading || !form.formState.isValid}
            className="my-4 inline-flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:bg-indigo-300"
          >
            <div className="flex items-center">
              {loading && <ButtonSpinner />}
              <span className="ms-2">Criar nova senha e acessar o painel</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
