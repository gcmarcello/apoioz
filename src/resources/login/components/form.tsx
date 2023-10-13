"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import ButtonSpinner from "../../../common/components/buttonSpinner";
import ErrorAlert from "../../../common/components/errorAlert";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(data: any) {
    try {
      setIsLoading(true);
      await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      router.push("/painel");
    } catch (error: any) {
      console.log(error);
      setError("root.serverError", {
        type: "400",
        message: error.response.data?.message || "Erro inesperado",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6 mt-4" onSubmit={handleSubmit(handleLogin)}>
        {errors.root?.serverError.message ? (
          <ErrorAlert errors={[errors.root.serverError.message]} />
        ) : null}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-white"
          >
            Endereço de Email
          </label>
          <div className="mt-2">
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register("identifier", { required: true })}
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-white"
            >
              Senha
            </label>
            <div className="text-sm">
              <a
                href="#"
                className="font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Esqueceu a senha?
              </a>
            </div>
          </div>
          <div className="mt-2">
            <input
              id="password"
              {...register("password", { required: true })}
              type="password"
              autoComplete="current-password"
              className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            disabled={isLoading}
            type="submit"
            className="flex w-full min-h-[36px] justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            {isLoading ? <ButtonSpinner /> : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
