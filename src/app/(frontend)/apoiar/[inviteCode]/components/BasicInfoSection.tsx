import { normalizePhone } from "@/_shared/utils/format";
import {
  MaskedTextField,
  TextField,
} from "@/app/(frontend)/_shared/components/fields/Text";
import { AddSupporterDto } from "@/app/api/panel/supporters/dto";
import { useForm } from "react-hook-form";

export function BasicInfoSection({
  form,
}: {
  form: ReturnType<typeof useForm<AddSupporterDto>>;
}) {
  return (
    <>
      <div className="mt-2">
        <TextField
          hform={form}
          label="Nome do Apoiador"
          name={"user.name"}
          autoComplete="name"
          placeholder="ex. João Silva"
        />
      </div>
      <div className="mt-2">
        <TextField
          hform={form}
          label="Email"
          name={"user.email"}
          autoComplete="email"
          placeholder="ex. joao@silva.com"
        />
      </div>
      <div className="mt-2">
        <MaskedTextField
          hform={form}
          label="Celular"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="ex. 999999999"
          name="user.phone"
          mask={
            normalizePhone(form.watch("user.phone"))?.length < 11
              ? "(99) 9999-99999"
              : "(99) 99999-9999"
          }
        />
      </div>
      <div className="mt-2">
        <MaskedTextField
          hform={form}
          label="Data de Nascimento"
          inputMode="numeric"
          autoComplete="birthDate"
          placeholder="ex. 01/01/1990"
          name="user.info.birthDate"
          mask="99/99/9999"
        />
      </div>
    </>
  );
}
