import { normalizePhone } from "@/_shared/utils/format";
import { SignUpAsSupporterDto } from "@/app/api/auth/dto";
import {
  Description,
  Fieldset,
  Input,
  Label,
  useFormContext,
} from "odinkit/client";
import { useMemo } from "react";

export function BasicInfoSection() {
  const form = useFormContext<SignUpAsSupporterDto>();

  const Field = useMemo(() => form.createField(), []);

  return (
    <Fieldset>
      <Field name={"user.name"} className="mt-2">
        <Label>Nome do Apoiador</Label>
        <Input autoComplete="name" placeholder="ex. João Silva" />
      </Field>
      <Field name="user.phone" className="mt-2">
        <Label>Celular</Label>
        <Input
          inputMode="numeric"
          autoComplete="tel"
          placeholder="ex. 999999999"
          mask={
            normalizePhone(form.watch("user.phone"))?.length < 11
              ? "(99) 9999-99999"
              : "(99) 99999-9999"
          }
        />
      </Field>
      <Field name="user.info.birthDate" className="mt-2">
        <Label>Data de Nascimento</Label>
        <Input
          inputMode="numeric"
          autoComplete="birthDate"
          placeholder="ex. 01/01/1990"
          mask="99/99/9999"
        />
      </Field>
      <Field enableAsterisk={false} name={"user.email"} className="mt-2">
        <Label>Email (opcional)</Label>
        <Input
          autoComplete="email"
          autoCapitalize="off"
          autoCorrect="off"
          inputMode="email"
          placeholder="ex. joao@silva.com"
        />
        <Description>
          Se um email não for cadastrado, você precisará contatar seu indicador
          caso queira acessar o painel!
        </Description>
      </Field>
    </Fieldset>
  );
}
