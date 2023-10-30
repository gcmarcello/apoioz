"use client";

import { TextField } from "@/app/(frontend)/_shared/components/Fields";
import { Mocker } from "@/app/(frontend)/_shared/components/Mocker";
import { ButtonSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import ErrorAlert from "@/app/(frontend)/_shared/components/alerts/errorAlert";
import { LoginDto, loginDto } from "@/app/api/auth/dto";
import { login } from "@/app/api/auth/action";
import { fakerPT_BR } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const {
    formState: { errors },
    register,
    handleSubmit,
    ...form
  } = useForm<LoginDto>({
    mode: "onChange",
    resolver: zodResolver(loginDto),
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function submit(data: LoginDto) {
    try {
      setIsLoading(true);
      const response = await login(data);
      if (!response.data) {
        throw response?.message;
      }
      router.push("/painel");
    } catch (error: any) {
      ``;
      form.setError("root.serverError", {
        type: "400",
        message: error || "Erro inesperado",
      });
      setIsLoading(false);
    }
  }

  const generateFakeData = () => {
    form.setValue("identifier", fakerPT_BR.internet.email());
    form.setValue("password", fakerPT_BR.internet.password());
  };

  return (
    <>
      <div className="absolute bottom-0 right-0 p-4">
        <Mocker mockData={generateFakeData} submit={handleSubmit(submit)} />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="mt-4 space-y-6" onSubmit={handleSubmit(submit)}>
          {errors.root?.serverError.message ? (
            <ErrorAlert errors={[errors.root.serverError.message]} />
          ) : null}

          <TextField
            {...register("identifier")}
            label="Email"
            name="identifier"
            placeholder="seu_email@email.com"
            options={{ errorMessage: errors.identifier?.message }}
          />

          <TextField
            {...register("password")}
            label="Senha"
            name="password"
            type={"password"}
            placeholder="•••••••••••"
            options={{ errorMessage: errors.password?.message }}
          />

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="flex min-h-[36px] w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {isLoading ? <ButtonSpinner /> : "Login"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
