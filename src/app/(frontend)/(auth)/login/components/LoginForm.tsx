"use client";

import { Mocker } from "@/app/(frontend)/_shared/components/Mocker";
import { ButtonSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import ErrorAlert from "@/app/(frontend)/_shared/components/alerts/errorAlert";
import { LoginDto, loginDto } from "@/app/api/auth/dto";
import { login } from "@/app/api/auth/action";
import { fakerPT_BR } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { TextField } from "@/app/(frontend)/_shared/components/fields/Text";
import { useAction } from "@/app/(frontend)/_shared/hooks/useAction";

export default function LoginForm({ supportRedirect }: { supportRedirect?: string }) {
  const form = useForm<LoginDto>({
    mode: "onChange",
    resolver: zodResolver(loginDto),
  });
  const router = useRouter();

  const {
    formState: { errors },
    handleSubmit,
  } = form;

  const { trigger: loginAction, isMutating: isLoading } = useAction({
    action: login,
    onSuccess: () => {
      router.push(`/${supportRedirect}` || "/painel");
    },
    onError: (error) => {
      form.setError("root.serverError", {
        type: "400",
        message: (error as string) || "Erro inesperado",
      });
    },
  });

  const generateFakeData = () => {
    form.setValue("identifier", fakerPT_BR.internet.email());
    form.setValue("password", fakerPT_BR.internet.password());
  };

  return (
    <>
      <div className="absolute bottom-0 right-0 p-4">
        <Mocker
          mockData={generateFakeData}
          submit={handleSubmit((data) => loginAction(data))}
        />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="mt-4 space-y-6"
          onSubmit={handleSubmit((data) => loginAction(data))}
        >
          {errors.root?.serverError.message ? (
            <ErrorAlert errors={[errors.root.serverError.message]} />
          ) : null}

          <TextField
            hform={form}
            label="Email"
            name="identifier"
            placeholder="seu_email@email.com"
          />

          <div>
            <TextField
              hform={form}
              label="Senha"
              name="password"
              type={"password"}
              placeholder="•••••••••••"
            />
          </div>

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="flex min-h-[36px] w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm duration-200 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {isLoading ? <ButtonSpinner /> : "Login"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
