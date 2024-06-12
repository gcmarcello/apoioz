"use client";

import { loginDto } from "@/app/api/auth/dto";
import { login } from "@/app/api/auth/action";

import { useMemo } from "react";

import {
  Button,
  ErrorMessage,
  Fieldset,
  Form,
  Input,
  Label,
  useAction,
  useForm,
} from "odinkit/client";
import { Alertbox, ButtonSpinner, Container, List } from "odinkit";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

export default function LoginForm({
  supportRedirect,
  email,
}: {
  supportRedirect?: string;
  email?: string;
}) {
  const form = useForm({
    mode: "onChange",
    schema: loginDto,
    defaultValues: {
      identifier: email || "",
      password: "",
    },
    fieldOptions: {
      enableAsterisk: false,
    },
  });

  const errors = form.formState.errors;

  const Field = useMemo(() => form.createField(), []);

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

  return (
    <Container className="mx-auto w-full max-w-sm">
      <Form onSubmit={loginAction} className="mt-4" hform={form}>
        {errors.root?.serverError?.message ? (
          <Alertbox type="error">
            <List data={[errors.root?.serverError?.message as string]} />
          </Alertbox>
        ) : null}

        <Fieldset className={"space-y-3"}>
          <Field name="identifier">
            <Label>Email ou Telefone</Label>
            <Input
              placeholder="email@email.com - (99) 99999-9999"
              mask={(_: any, rawValue: any) => {
                if (Number(rawValue)) {
                  if (rawValue.length >= "99999999999".length) {
                    return "(99) 99999-9999";
                  } else if (rawValue.length === "9999999999".length) {
                    return "(99) 9999-9999";
                  }
                }
                return "";
              }}
            />
            <ErrorMessage />
          </Field>

          <Field name="password">
            <Label>Senha</Label>
            <Input type="password" placeholder="•••••••••••" />
            <ErrorMessage />
          </Field>

          <Button
            className="mt-3 w-full"
            disabled={isLoading}
            color="indigo"
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
        </Fieldset>
      </Form>
    </Container>
  );
}
