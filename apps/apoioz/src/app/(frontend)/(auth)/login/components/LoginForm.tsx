"use client";

import { ButtonSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import ErrorAlert from "@/app/(frontend)/_shared/components/alerts/errorAlert";
import { LoginDto, loginDto } from "@/app/api/auth/dto";
import { login } from "@/app/api/auth/action";
import { fakerPT_BR } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { TextField } from "@/app/(frontend)/_shared/components/fields/Text";
import { useAction } from "odinkit/hooks/useAction";
import { Button } from "@/app/(frontend)/_shared/components/Button";

export default function LoginForm({
  supportRedirect,
}: {
  supportRedirect?: string;
}) {
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
    onError: (error) => {
      form.setError("root.serverError", {
        type: "400",
        message: (error as string) || "Erro inesperado",
      });
    },
    redirect: true,
  });

  const generateFakeData = () => {
    form.setValue("identifier", fakerPT_BR.internet.email());
    form.setValue("password", fakerPT_BR.internet.password());
  };

  return (
    <>
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

          <TextField
            hform={form}
            label="Senha"
            name="password"
            type={"password"}
            placeholder="•••••••••••"
          />

          <div>
            <Button
              className="w-full"
              disabled={isLoading}
              variant="primary"
              type="submit"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <ButtonSpinner size="medium" />
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
