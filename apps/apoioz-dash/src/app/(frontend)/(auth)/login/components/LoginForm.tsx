"use client";

import { loginDto } from "@/app/api/auth/dto";
import { login } from "@/app/api/auth/action";
import { fakerPT_BR } from "@faker-js/faker";
import { useAction } from "odinkit/hooks/useAction";
import { List } from "odinkit/components/List";
import { Alertbox } from "odinkit/components/Alertbox";
import { useForm } from "odinkit/components/Form/Form";
import { Container } from "odinkit/components/Containers";
import { Input } from "odinkit/components/Form/Input";
import { Button } from "odinkit/components/Button";
import { ButtonSpinner } from "odinkit/components/Spinners";
import { If } from "odinkit/components/If";
import { ErrorMessage, Fieldset, Label } from "odinkit/components/Form/Field";
import { Form } from "odinkit/components/Form/Form";

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

  const Field = form.createField();

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
        <If
          if={errors.root?.serverError?.message}
          then={
            <Alertbox type="error">
              <List data={[errors.root?.serverError?.message as string]} />
            </Alertbox>
          }
          else={null}
        />

        <Fieldset className={"space-y-3"}>
          <Field name="identifier">
            <Label>Email ou Telefone</Label>
            <Input
              placeholder="email@email.com - (99) 99999-9999"
              mask={(_, rawValue) => {
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
            <If
              if={isLoading}
              then={
                <div className="flex items-center justify-center">
                  <ButtonSpinner size="medium" />
                </div>
              }
              else={"Login"}
            />
          </Button>
        </Fieldset>
      </Form>
    </Container>
  );
}
